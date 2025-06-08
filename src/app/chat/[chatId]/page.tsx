import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import React from 'react'
import { redirect } from 'next/navigation'
import ChatSideBar from '@/components/ChatSideBar'

type Props = {
    params: {
        chatId: string
    }
}

async function ChatPage({params: {chatId}}: Props) {
    const {userId} = await auth()
    if(!userId) {
        return redirect('/sign-in')
    }

    const _chats = await db.select().from(chats).where(eq(chats.userId,userId))

    if(!_chats){
        return redirect('/')
    }
    if(!_chats.find(chat => chat.id === parseInt(chatId))) {
        return redirect('/')
    }
  return (
    <div className='flex max-h-screen '>
        <div className='flex w-full max-h-screen'>
            {/* Chat Sidebar */}
            <div className='flex-[1] max-w-xs'>
                <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
            </div>
            {/* PDF Viewver */}
            <div className='max-h-screen p-4  flex[5]'>
                {/* <PDFViewer /> */}
            </div>
            {/* chat component */}
            <div className='flex-[3] b border-1-4 '>
                {/* <ChatComponent /> */}
            </div>
        </div>
    </div>
  )
}

export default ChatPage