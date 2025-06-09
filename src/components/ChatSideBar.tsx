'use client'
import { DrizzleChat } from '@/lib/db/schema'
import { MessageCircle, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

type Props = {
    chats: DrizzleChat[],
    chatId: number
}

const ChatSideBar = ({chats,chatId}: Props) => {
  return (
    <div className='w-full h-screen text-gray-200 bg-gray-900 p-2'>
        <Link href='/'>
            <Button  className='border-dashed border border-white w-full'><PlusCircle className='mr-2 h-4 w-4' /> New Chat</Button>
        </Link>

        <div className='flex flex-col-reverse gap-2 mt-4 overflow-y-auto'>
            {chats.map(chat => (
                <Link key={chat.id} href={`/chat/${chat.id}`} className={`p-2 rounded-md hover:bg-gray-800 ${chat.id === chatId ? 'bg-gray-700' : ''}`}>
                    <div className='flex items-center'>
                        <MessageCircle className='mr-2' />
                        <span className='text-sm overflow-hidden truncate w-full'>{chat.pdfName}</span>
                    </div>
                </Link>
            ))}
        </div>
        <div className='absolute bottom-4 left-0 w-full p-4 text-sm text-gray-500'>
            <div className='flex flex-row gap-2'>
                <Link href='/'>Home</Link>
                <Link href='/'>Source</Link>
            </div>
        </div>
    </div>
  )
}

export default ChatSideBar