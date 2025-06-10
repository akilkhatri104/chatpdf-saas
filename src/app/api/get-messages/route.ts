import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export const POST = async (request: Request) => {
    const { chatId } = await request.json();
    if (!chatId) {
        return NextResponse.json(
            { error: "Chat ID is required" },
            { status: 400 }
        );
    }

    const _messages = await db
        .select()
        .from(messages)
        .where(eq(messages.chatId, chatId));
    if (_messages.length === 0) {
        return NextResponse.json(
            { error: "No messages found for this chat", messages: [] },
            { status: 404 }
        );
    }

    return NextResponse.json(
        { message: "Messages fetched succesfully", messages: _messages },
        { status: 200 }
    );
};
