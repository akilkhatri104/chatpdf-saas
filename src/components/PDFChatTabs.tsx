"use client";
import { DrizzleChat } from "@/lib/db/schema";
import { useState } from "react";
import PDFViewer from "./PDFViewer";
import ChatComponent from "./ChatComponent";
import { SidebarTrigger } from "./ui/sidebar";

type Props = {
    currentChat: DrizzleChat;
};

const PDFChatTabs = ({ currentChat }: Props) => {
    const [tab, setTab] = useState<"pdf" | "chat">("chat");
    return (
        <div className="flex flex-col w-full h-fit">
            <div className="flex flex-row">
                <SidebarTrigger className="md:hidden inline sticky right-0 w-5 p-2" />
                <div className=" md:hidden sticky top-0 bg-gray-900   mx-auto font-bold  text-gray-200 pt-2  ">
                    <h1
                        className={`inline  px-5 cursor-pointer ${tab === "pdf" && "border-b-2 border- border-gray-200"
                            }`}
                        onClick={() => setTab("pdf")}
                    >
                        {currentChat?.pdfName}
                    </h1>
                    <h1 className={`px-5 inline cursor-pointer ${tab === "chat" && "border-b-2 border-gray-200"
                        }`} onClick={() => setTab("chat")}>
                        Chat
                    </h1>
                </div>
            </div>
            <div className="flex flex-row  w-full h-screen">
                {/* PDF Viewver */}
                <div
                    className={`max-h-screen md:flex mx-auto md:w-1/2 p-2 ${tab === "pdf" ? "flex" : "hidden"
                        } bg-gray-800`}
                >
                    <PDFViewer pdfUrl={currentChat?.pdfUrl || ""} />
                </div>
                {/* chat component */}
                <div
                    className={`md:w-1/2 border-1-4 ${tab === "chat" ? "flex" : "hidden"
                        }`}
                >
                    <ChatComponent chatId={currentChat?.id} />
                </div>
            </div>
        </div>
    );
};

export default PDFChatTabs;
