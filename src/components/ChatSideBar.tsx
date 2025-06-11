"use client";
import { DrizzleChat } from "@/lib/db/schema";
import { MessageCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";

type Props = {
    chats: DrizzleChat[];
    chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
    return (
        <Sidebar className="w-64 h-screen bg-gray-900 text-gray-200 dark:bg-gray-800 dark:text-gray-300">
            <SidebarHeader>
                <Link href="/">
                    <Button className="border-dashed border border-white w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> New Chat
                    </Button>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                {chats.map((chat) => (
                    <Link
                        key={chat.id}
                        href={`/chat/${chat.id}`}
                        className={`p-2 text-gray-300 rounded-md hover:bg-gray-800 ${
                            chat.id === chatId ? "bg-gray-700" : ""
                        }`}
                    >
                        <div className="flex items-center">
                            <MessageCircle className="mr-2" />
                            <span className="text-sm overflow-hidden truncate w-full">
                                {chat.pdfName}
                            </span>
                        </div>
                    </Link>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <Link href="/">Home</Link>
                <Link href="/">Source</Link>
            </SidebarFooter>
        </Sidebar>
    );
};


export default ChatSideBar;
