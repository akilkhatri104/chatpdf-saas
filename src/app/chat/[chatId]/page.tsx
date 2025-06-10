import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import {  desc, eq } from "drizzle-orm";
import React from "react";
import { redirect } from "next/navigation";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import ChatComponent from "@/components/ChatComponent";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

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

    const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
    return (
        <SidebarProvider>
            <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />

            <main className="w-screen h-screen flex flex-row bg-gray-900 text-gray-200">
                <SidebarTrigger />
                <div className="flex w-full max-h-screen">
                    {/* PDF Viewver */}
                    <div className="max-h-screen w-1/2 p-2 bg-gray-800">
                        <PDFViewer pdfUrl={currentChat?.pdfUrl || ""} />
                    </div>
                    {/* chat component */}
                    <div className=" w-1/2 border-1-4 ">
                        <ChatComponent chatId={parseInt(chatId)} />
                    </div>
                </div>
            </main>
        </SidebarProvider>
    );
}

export default ChatPage;
