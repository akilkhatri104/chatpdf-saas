import { db } from "@/lib/db";
import { chats, DrizzleChat } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import {  desc, eq } from "drizzle-orm";
import React from "react";
import { redirect } from "next/navigation";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import ChatComponent from "@/components/ChatComponent";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import PDFChatTabs from "@/components/PDFChatTabs";

type Props = {
    params: {
        chatId: string;
    };
};

async function ChatPage({ params: { chatId } }: Props) {
    const { userId } = await auth();
    if (!userId) {
        return redirect("/sign-in");
    }

    const _chats = await db
        .select()
        .from(chats)
        .where(eq(chats.userId, userId))
        .orderBy(desc(chats.createdAt));

    if (!_chats) {
        return redirect("/");
    }
    if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
        return redirect("/");
    }

    const currentChat: DrizzleChat | undefined = _chats.find((chat) => chat.id === parseInt(chatId));
    return (
        <SidebarProvider>
            <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />

            <main className="w-screen h-screen flex flex-row bg-gray-900 text-gray-200">
                <SidebarTrigger />
                <PDFChatTabs currentChat={currentChat} />
            </main>
        </SidebarProvider>
    );
}

export default ChatPage;
