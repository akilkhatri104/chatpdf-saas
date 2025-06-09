'use client'
import React from 'react'
import { Input } from "@/components/ui/input"
import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import MessageList from './MessageList';


type Props = {}

const ChatComponent = (props: Props) => {
    const {input,handleInputChange,handleSubmit,messages} = useChat({
        api: '/api/chat',
    })
  return (
    <div className='relative max-h-screen overflow-auto text-gray-200 bg-gray-900 flex flex-col h-full w-full'>
        {/* header */}
        <div className='sticky top-0 inset-x-0 p-2 h-fit border-b'>
            <h3 className='text-xl font-bold'>Chat Component</h3>
        </div>

        {/* message list */}
        <MessageList messages={messages} />

        <form onSubmit={handleSubmit} className='sticky bottom-0 inset-x-0 p-2 bg-gray-800 border-t flex items-center gap-2'>
            <Input value={input} onChange={handleInputChange} placeholder='Ask any question...' className='' />
            <Button>
                <Send className='h-4 w-4'/>
            </Button>
        </form>
    </div>
  )
}

export default ChatComponent