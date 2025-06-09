import { vector } from "drizzle-orm/pg-core";
import { getPineconeClient } from "./pinecone";
import { convertToASCII } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(
    embeddings: number[],
    fileKey: string
) {
    const pinecone = await getPineconeClient();

    const index = pinecone.Index(process.env.PINECONE_INDEX!);

    try {
        const namespace = index.namespace(convertToASCII(fileKey));
        const queryResponse = await namespace.query({
            vector: embeddings,
            topK: 10,
            includeMetadata: true,
            includeValues: false,
        });

        return queryResponse.matches || [];
    } catch (error) {
        console.error("Error getting matches from embeddings:", error);
        throw error;
    }
}

export async function getContext(query: string, fileKey: string) {
    const queryEmbeddings = await getEmbeddings(query);
    console.log("Query Embeddings: ", queryEmbeddings);
    
    const matches = await getMatchesFromEmbeddings(queryEmbeddings || [], fileKey);
    console.log("Matches found: ", matches.length);

    console.log("Matches: ", matches);
    
    

    const qualifyingMatchs = matches.filter(match => match.score && match.score > 0.5)
    console.log("Qualifying Matches: ", qualifyingMatchs.length);
    console.log("Qualifying Matches: ", qualifyingMatchs);
    
    

    type Metadata = {
        text: string
        pageNumber: number
    }

    const docs = qualifyingMatchs.map(match => (match.metadata as Metadata).text)
    return docs.join('\n').substring(0,3000)
}
