import { cn } from "@/lib/utils";
import { Loader2, MessageSquare } from "lucide-react";
import React, { useEffect } from "react";
import {
    Conversation,
    ConversationContent,
    ConversationEmptyState,
    ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Response } from '@/components/ai-elements/response';
import { Message, MessageContent } from "./ai-elements/message";
import { Message as MessageType } from "ai";
import { stat } from "fs";


type Props = {
    messages: MessageType[];
    isLoading: boolean;
    status: 'submitted' | 'streaming' | 'ready' | 'error'
};

const MessageList = ({ messages, isLoading, status }: Props) => {
    useEffect(() => {
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [messages]);

    return isLoading ? (
        <div className="flex p-4 justify-center w-full min-h-full h-full">
            <Loader2 className="w-6 h-6 animate-spin" />
        </div>
    ): (
                <Conversation>
          <ConversationContent>
            {messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text': // we don't use any reasoning or tool calls in this example
                        return (
                          <Response key={`${message.id}-${i}`}>
                            {part.text}
                          </Response>
                        );
                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            ))}
            {status === 'submitted' && <Loader2 className="animate-spin"/>}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

    //     return isLoading ? (
    //     <div className="flex p-4 justify-center w-full h-full">
    //         <Loader2 className="w-6 h-6 animate-spin" />
    //     </div>
    // ) : !messages || messages.length === 0 ? (
    //     <div className="text-gray-500 text-center w-full h-full flex items-center justify-center">
    //         No messages yet. Start the conversation!
    //     </div>
    // ) : 

        // <div className="flex flex-col gap-2 p-4 h-full min-h-full overflow-auto w-full" id='chat-container'>
        //     {messages.map((message) => (
        //         <div
        //             key={message.id}
        //             className={cn("flex", {
        //                 "justify-end pl-10": message.role === "user",
        //                 "justify-start pr-10": message.role === "system",
        //             })}
        //         >
        //             <div className={cn('rounded-lg px-3 text-sm py-1 shadow-md ring-1', {
        //                 'bg-blue-800 text-white': message.role === 'user',
        //                 'bg-gray-700 text-gray-200': message.role === 'system',
        //                 'bg-gray-600 text-gray-300': message.role === 'assistant',
        //             })}>
        //                 <p dangerouslySetInnerHTML={{__html: message.content}}/>
        //             </div>
        //         </div>
        //     ))}
        //     {status === 'submitted' && (<Loader2 className="animate-spin"/>)}
        // </div>
    )
};

export default MessageList;
