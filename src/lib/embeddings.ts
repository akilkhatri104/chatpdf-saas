import { GoogleGenAI } from "@google/genai";


export async function getEmbeddings(text : string){
    try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
        if(!apiKey){
            throw new Error("`GOOGLE_GENERATIVE_AI_API_KEY` not configured in enviromnet")
        }
        const embeddingModel = process.env.GOOGLE_GENERATIVE_AI_EMBEDDING_MODEL
        if(!embeddingModel){
            throw new Error("`GOOGLE_GENERATIVE_AI_EMBEDDING_MODEL` not configured in environment")
        }

        const gemini = new GoogleGenAI({apiKey})
        text = text.replace(/\n/g,' ')
        if(text.length === 0){
            throw new Error("No text given")
        }
        const response = await gemini.models.embedContent({
            model: embeddingModel,
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