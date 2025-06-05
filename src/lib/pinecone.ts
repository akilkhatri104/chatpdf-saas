import {Pinecone} from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

let pinecone: Pinecone | null = null;

export const getPineconeClient = async () => {
    try {
        if(!pinecone){
            pinecone = new Pinecone({
                apiKey: process.env.PINECONE_API_KEY!
            })
        }
        return pinecone
    } catch (error) {
        console.error("Error initializing Pinecone client:", error);
        throw new Error("Failed to initialize Pinecone client");
        
    }
}

export const loadS3IntoPinecone = async (fileKey : string ) => {
    const fileName = await downloadFromS3(fileKey);
    if(!fileName || typeof fileName !== 'string') {
        throw new Error("Failed to download file from S3");
    }
    const loader = new PDFLoader(fileName);
    const pages = await loader.load()
    console.log("Pages loaded: ",pages);
    
    return pages
}