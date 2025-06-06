import { GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({apiKey: process.env.GOOGLE_GEMINI_API_KEY})

export async function getEmbeddings(text : string){
    try {
        const response = await gemini.models.embedContent({
            model: 'gemini-embedding-exp-03-07',
            contents: text.replace(/\n/g,' '),
            config: {
                outputDimensionality: 1536
            }
        })

        if(!response || !response.embeddings || !Array.isArray(response.embeddings)){
            throw new Error('Error while creating embeddings')
        }

        return response.embeddings[0].values;
    } catch (error) {
        console.error("Error:: getEmbeddings :: ",error);
        throw error        
    }
}