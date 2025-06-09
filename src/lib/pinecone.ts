import {Pinecone,} from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {Document,RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter'
import { getEmbeddings } from "./embeddings";
import md5 from 'md5'
import { convertToASCII } from "./utils"
import {unlinkSync} from 'fs'

let pinecone: Pinecone | null = null;

export const getPineconeClient = async () => {
    try {
        if(!pinecone){
            pinecone = new Pinecone({
                apiKey: process.env.PINECONE_API_KEY!,
            })
        }
        return pinecone
    } catch (error) {
        console.error("Error initializing Pinecone client:", error);
        throw new Error("Failed to initialize Pinecone client");
        
    }
}

type PDFPage = {
    pageContent: string,
    metadata: {
        loc: {pageNumber:number}
    }    
}

export const loadS3IntoPinecone = async (fileKey : string ) => {
    // download PDF from S3 and load it
    const fileName = await downloadFromS3(fileKey);
    if(!fileName || typeof fileName !== 'string') {
        throw new Error("Failed to download file from S3");
    }
    const loader = new PDFLoader(fileName);
    const pages = (await loader.load() as PDFPage[]) 
    console.log("Pages loaded: ",pages);
    
    // split and segment the pages
    const documents = await Promise.all(pages.map(prepareDocument))

    // vectorize each document
    const vectors = await Promise.all(documents.flat().map(embedDocument))

    // upload to pinecone
    const client = await getPineconeClient()
    // const pineconeIndex = client.Index(process.env.PINECONE_INDEX!)

    // console.log("Inserting vectors into Pinecone");
    const namespace = convertToASCII(fileKey)
    // PineconeUtils.chunkedUpsert(pineconeIndex,vectors,namespace,10)
    const index = client.Index(process.env.PINECONE_INDEX!).namespace(namespace)

    await index.upsert(vectors)

    
    unlinkSync(fileName) // clean up the downloaded file

    return documents[0]
}

export function truncateStringByBytes(str:string,bytes:number) {
    const enc = new TextEncoder()
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0,bytes))
}

async function prepareDocument(pdf:PDFPage) {
    let {pageContent,metadata} = pdf
    pageContent = pageContent.replace(/\n/g,' ')

    const splitter = new RecursiveCharacterTextSplitter()
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent,36000)
            }
        })
    ])
    return docs
}

export async function embedDocument(doc: Document){
    try {
        const embeddings = await getEmbeddings(doc.pageContent)
        const hash = md5(doc.pageContent)   
        
        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber
            } 
        } 
    } catch (error) {
        console.error("Error:: embedDocument :: ",error)
        throw error
    }
}