"use client";
import { DrizzleChat } from "@/lib/db/schema";
import { useState } from "react";
import PDFViewer from "./PDFViewer";
import ChatComponent from "./ChatComponent";
import { SidebarTrigger } from "./ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Props = {
    currentChat: DrizzleChat;
};

const PDFChatTabs = ({ currentChat }: Props) => {
    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-row">
            </div>

            {/* Desktop */}
            <div className="hidden flex-row  w-full h-full md:flex">
                {/* PDF Viewver */}
                <div
                    className={`max-h-screen md:flex mx-auto md:w-1/2 p-2 bg-gray-800`}
                >
                    <PDFViewer pdfUrl={currentChat?.pdfUrl || ""} />
                </div>
                {/* chat component */}
                <div
                    className={`md:w-1/2 border-1-4`}
                >
                    <ChatComponent chatId={currentChat?.id} />
                </div>
            </div>

            {/* Mobile */}
            <Tabs defaultValue="chat" className="md:hidden flex flex-col h-full">
                <div className="flex flex-row p-3 sticky top-0 bg-background z-10 border-b">
                    <SidebarTrigger className="md:hidden inline sticky right-0 w-5 p-2" />
                    <TabsList className="mx-auto">
                        <TabsTrigger value="pdf">{currentChat.pdfName}</TabsTrigger>
                        <TabsTrigger value="chat">Chat</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="pdf" className="flex-1 overflow-y-auto">
                    <PDFViewer pdfUrl={currentChat?.pdfUrl || ""} />
                </TabsContent>
                <TabsContent value="chat" className="flex-1">
                    <ChatComponent chatId={currentChat?.id} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PDFChatTabs;
