import { db } from "@/lib/db";
import { chats, DrizzleChat, messages } from "@/lib/db/schema";
import { deletePineconeNameSpace } from "@/lib/pinecone";
import { deleteFromS3 } from "@/lib/s3-server";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {chatId} = await req.json()
        const {userId} = await auth()
        if(!userId){
            return NextResponse.json({error:'Unauthorized'},{status:400})
        }

        const chat:DrizzleChat = (await db.select().from(chats).where(and(eq(chats.userId,userId),eq(chats.id,chatId))).limit(1) as DrizzleChat[])[0]
        console.log(chat)
        if(!chats){
            return NextResponse.json({error:'Chat not found'},{status:404})
        }
        
        const msgRes = await db.delete(messages).where(eq(messages.chatId,chatId))
        console.log("NeonDB Msg Deletion Response: ",msgRes);
        
        if(!msgRes){
            throw new Error('Something went wrong while deleting messages')
        }
        const chatRes = await db.delete(chats).where(and(eq(chats.userId,userId),eq(chats.id,chatId)))
        console.log("NeonDB Chat Deletion Response: ",chatRes);
        
        if(!chatRes){
            throw new Error('Something went wrong while deleting chat')
        }

        const s3Res = await deleteFromS3(chat.fileKey)
        console.log("S3 Object Deletion Response: ",s3Res);
        
        if(!s3Res.success){
            throw new Error(s3Res.error)
        }

        const pineconeRes = await deletePineconeNameSpace(chat.fileKey)
        console.log("Pinecone Namaspace Deletion Response: ",pineconeRes);
        
        if(!pineconeRes.success){
            throw new Error(pineconeRes.error)
        }


        return NextResponse.json({message:'Chat deleted'},{status:200})
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({error:error.message??'Something went wrong'},{status:500})
    }
}