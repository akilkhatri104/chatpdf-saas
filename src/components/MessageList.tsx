import { cn } from "@/lib/utils";
import { Message } from "@ai-sdk/react";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";

type Props = {
    messages: Message[];
    isLoading: boolean;
};

const MessageList = ({ messages,isLoading }: Props) => {
    if(isLoading) {
        return (
            <div className="flex p-4 justify-center w-full h-full">
                <Loader2  className="w-6 h-6 animate-spin"/>
            </div>
        )
    }
    if (!messages || messages.length === 0) {
        return (
            <div className="text-gray-500 text-center w-full h-full flex items-center justify-center">
                No messages yet. Start the conversation!
            </div>
        );
    }

    useEffect(() => {
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [messages]);

    return (
        <div className="flex flex-col  gap-2 p-4 h-full overflow-auto w-full" id='chat-container'>
            {messages.map((message, index) => (
                <div
                    key={message.id}
                    className={cn("flex", {
                        "justify-end pl-10": message.role === "user",
                        "justify-start pr-10": message.role === "system",
                    })}
                >
                    <div className={cn('rounded-lg px-3 text-sm py-1 shadow-md ring-1',{
                        'bg-blue-800 text-white': message.role === 'user',
                        'bg-gray-700 text-gray-200': message.role === 'system',
                        'bg-gray-600 text-gray-300': message.role === 'assistant',
                    })}>
                        <p>{message.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
