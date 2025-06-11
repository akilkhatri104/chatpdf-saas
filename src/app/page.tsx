import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default async function Home() {
    const { userId } = await auth();
    const isAuth = !!userId;
    let firstChat = undefined

    if(userId) {
        const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
        if(_chats.length > 0) {
            firstChat = _chats[_chats.length - 1];
        }
    }
    return (
        <div className="w-screen min-h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex gap-x-2 flex-col items-center text-center">
                    <div className="flex md:flex-row flex-col items-center gap-2 justify-center">
                        <h1 className="mr-3 text-center text-5xl font-semibold">
                            Chat with any PDF
                        </h1>
                        <UserButton />
                    </div>
                    <div className="flex  mt-3">
                        {isAuth && firstChat && (
                            <Link href={`/chat/${firstChat.id}`}><Button variant={"secondary"}>Go to Chats</Button></Link>
                        )}
                    </div>
                    <p className="max-w-xl mt-1 text-lg text-gray-300">
                        Join millions of students, researchers, profetionals
                        answer questions and understand research with AI
                    </p>

                    <div className="w-full mt-4">
                        {isAuth ? (
                            <FileUpload />
                        ) : (
                            <Link href="/sign-in">
                                <Button variant="secondary">
                                    Login to get started
                                    <LogIn className="" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
