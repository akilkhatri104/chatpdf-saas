"use client";
import { DrizzleChat } from "@/lib/db/schema";
import { MessageCircle, PlusCircle, Trash2, Pen } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { Input } from "./ui/input";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
    chats: DrizzleChat[];
    chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
    const router = useRouter()
    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault()
        toast('Deleting Chat...')
        try {
            const _chatId = (e.target as HTMLFormElement).chatIdInput.value
            const res = await axios.post('/api/delete-chat',{
                chatId: _chatId
            })
            console.log("Chat Deletion Response: ",res)
            if(res.status === 200){
                toast.success('Chat Deleted!')
                router.refresh()
                return
            }
        } catch (error: any) {
            toast.error(error.message)
            
        }
    }
    const handleRename = async (e: React.FormEvent) => {
        e.preventDefault()
        toast('Renaming Chat...')
        try {
            const chatName = (e.target as HTMLFormElement).chatNameInput.value
            console.log(chatName)
            const _chatId = (e.target as HTMLFormElement).chatIdInput.value
            const res = await axios.post(`/api/rename-chat`, { chatId: _chatId, chatName })
            if (res.status === 200) {
                toast.success('Chat Renamed!')
                router.refresh()
            } else {
                throw new Error(res.data.error)
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }
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
                    <div key={chat.id} className={`flex hover:bg-gray-800 w-full justify-between text-gray-300 rounded-md  ${chat.id === chatId ? "bg-gray-700" : ""
                        }`}>
                        <Link href={`/chat/${chat.id}`} className="w-2/3" title={chat.chatName ? chat.chatName : chat.pdfName}>
                            <div
                                className={`p-2`}
                            >
                                <div className="flex items-center">
                                    <MessageCircle className="mr-2" />
                                    <span className="text-sm overflow-hidden truncate">
                                        {chat.chatName ? chat.chatName : chat.pdfName}
                                    </span>
                                </div>
                            </div>
                        </Link>
                        <span className="flex items-end justify-end w-1/3 ml-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant={'secondary'} title="Rename Chat" className="h-fit mr-2">
                                        <Pen className="" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Rename Chat</DialogTitle>
                                    </DialogHeader>
                                    <div>
                                        <form onSubmit={handleRename}>
                                            <Input id='chatNameInput' placeholder="Chat Name" defaultValue={chat.chatName ? chat.chatName : chat.pdfName} />
                                            <DialogFooter className="flex justify-end pt-3">
                                                <Input id='chatIdInput' defaultValue={chat.id}
                                                    readOnly
                                                    type='hidden' />
                                                <DialogClose asChild>
                                                    <Button>Cancel</Button>
                                                </DialogClose>
                                                <DialogClose asChild>
                                                    <Button type='submit'>Save</Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </form>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant={'destructive'} title="Delete Chat" className="h-fit mr-2">
                                        <Trash2 className="" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Are you sure?</DialogTitle>
                                        <DialogDescription>Once deleted the chat will not be recoverable</DialogDescription>
                                    </DialogHeader>
                                    <div>
                                        <form onSubmit={handleDelete}>
                                            <DialogFooter className="flex justify-end pt-3">
                                                <Input id='chatIdInput' defaultValue={chat.id}
                                                    readOnly
                                                    type='hidden' />
                                                <DialogClose asChild>
                                                    <Button>Cancel</Button>
                                                </DialogClose>
                                                <DialogClose asChild>
                                                    <Button 
                                                    variant={'destructive'}
                                                    type='submit'>Delete</Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </form>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            
                        </span>
                    </div>

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
