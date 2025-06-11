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


const ChatComponent = ({chatId}: Props) => {
    // const [isFetching, setIsFetching] = React.useState(false);
    const {data: chatMessages,isLoading}= useQuery({
        queryKey: ['chat', chatId],
        queryFn: async() => {
            // setIsFetching(true);
            try {
                const response = await axios.post(`/api/get-messages`,{chatId});
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
    const {input,handleInputChange,handleSubmit,messages,} = useChat({
        api: '/api/chat',
        body: {
            chatId
        },
        initialMessages: chatMessages || []
    })

  return (
    <div className='max-h-screen overflow-auto text-gray-200 bg-gray-900 flex flex-col h-full w-full' >
        {/* header */}
        <div className='sticky top-0 inset-x-0 p-2 h-fit border-b'>
            <h3 className='text-xl font-bold'>Chat</h3>
        </div>

        {/* message list */}
        <MessageList messages={messages} isLoading={isLoading} />

        <form onSubmit={handleSubmit} className='sticky bottom-0 inset-x-0 p-2 bg-gray-800 border-t justify-center flex items-center gap-2'>
            <Input value={input} onChange={handleInputChange} placeholder='Ask any question...' className='' />
            <Button>
                <Send className='h-4 w-4'/>
            </Button>
        </form>
    </div>
  )
}

export default ChatComponent