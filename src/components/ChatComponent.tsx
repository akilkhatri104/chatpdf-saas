'use client'
import React from 'react'
import { Input } from "@/components/ui/input"
import { Message, useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import MessageList from './MessageList';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


type Props = {
    chatId: number
}


const ChatComponent = ({ chatId }: Props) => {
    // const [isFetching, setIsFetching] = React.useState(false);
    const { data: chatMessages, isLoading } = useQuery({
        queryKey: ['chat', chatId],
        queryFn: async () => {
            // setIsFetching(true);
            try {
                const response = await axios.post(`/api/get-messages`, { chatId });
                if (response.status !== 200) {
                    throw new Error('Failed to fetch messages');
                }
                // setIsFetching(false);
                return response.data?.messages;
            } catch (error) {
                console.error('Error fetching messages:', error);
                // setIsFetching(false);
                return [];

            }
        }
    })
    const { input, handleInputChange, handleSubmit, messages, status } = useChat({
        api: '/api/chat',
        body: {
            chatId
        },
        initialMessages: chatMessages || []
    })

    return (
        <div className='text-gray-200 bg-gray-900 flex flex-col h-screen w-full' >
            {/* header */}
            <div className='sticky top-0 z-20 p-3 h-fit border-b bg-gray-900'>
                <h3 className='text-xl font-bold'>Chat</h3>
            </div>

            <div id="chat-container" className='flex-1 overflow-y-auto'>
                <MessageList messages={messages} isLoading={isLoading} status={status} />
            </div>

            <form onSubmit={handleSubmit} className='sticky bottom-0 z-20 p-2 bg-gray-800 border-t justify-center flex items-center gap-2'>
                <Input value={input} onChange={handleInputChange} placeholder='Ask any question...' className='' />
                <Button>
                    <Send className='h-4 w-4' />
                </Button>
            </form>
        </div>
    )
}

export default ChatComponent