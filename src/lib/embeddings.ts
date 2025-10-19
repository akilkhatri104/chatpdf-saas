import { GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!})

export async function getEmbeddings(text : string){
    try {
        text = text.replace(/\n/g,' ')
        if(text.length === 0){
            throw new Error("No text given")
        }
        const response = await gemini.models.embedContent({
            model: 'gemini-embedding-001',
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