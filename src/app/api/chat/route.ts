import { createGoogleGenerativeAI } from '@ai-sdk/google';
import {streamText} from 'ai'

export const runtime = 'edge'

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
})

export async function POST(req: Request) {
    try {
        const {messages} = await req.json();
        const result = await streamText({
            model: google('gemini-1.5-flash'),
            messages: messages,
        })

        return result.toDataStreamResponse()
    } catch (error) {
        console.error("Error:: POST /api/chat :: ", error);
        return new Response(JSON.stringify({error: 'Internal Server Error'}), {status: 500});
        
    }
}