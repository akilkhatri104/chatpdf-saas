import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { NeonHttpQueryResult } from "drizzle-orm/neon-http";

export async function POST(req : NextRequest){
    try {
        const { chatId, chatName } = await req.json();   
        const {userId} = await auth()  
        if(!userId){
            throw new Error('Unauthorized')
        }

        const res = await db.update(chats).set({chatName:chatName}).where(and(eq(chats.userId,userId),eq(chats.id,chatId)))
        if(!res){
            throw new Error('There was an error while updating chatname')
        }
        return NextResponse.json(res,{status:200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message ?? "Something went wrong" }, { status: 500 });
    }
}