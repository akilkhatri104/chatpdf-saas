"use client";
import { DrizzleChat } from "@/lib/db/schema";
import { useState } from "react";
import PDFViewer from "./PDFViewer";
import ChatComponent from "./ChatComponent";

type Props = {
    currentChat: DrizzleChat;
};

const PDFChatTabs = ({ currentChat }: Props) => {
    const [tab, setTab] = useState<"pdf" | "chat">("chat");
    return (
        <div className="flex flex-col w-full h-screen">
            <div className="flex justify-center items-center md:hidden sticky top-0   gap-x-4 bg-gray-900 font-bold text-gray-200  border-r ">
                <h1
                    className={`cursor-pointer ${
                        tab === "pdf" && "border-b-2 border-gray-200"
                    }`}
                    onClick={() => setTab("pdf")}
                >
                    {currentChat?.pdfName}
                </h1>
                <h1 className={`cursor-pointer ${
                        tab === "chat" && "border-b-2 border-gray-200"
                    }`} onClick={() => setTab("chat")}>
                    Chat
                </h1>
            </div>
            <div className="flex flex-row  w-full h-screen">
                {/* PDF Viewver */}
                <div
                    className={`max-h-screen md:flex mx-auto md:w-1/2 p-2 ${
                        tab === "pdf" ? "flex" : "hidden"
                    } bg-gray-800`}
                >
                    <PDFViewer pdfUrl={currentChat?.pdfUrl || ""} />
                </div>
                {/* chat component */}
                <div
                    className={`md:w-1/2 border-1-4 ${
                        tab === "chat" ? "flex" : "hidden"
                    }`}
                >
                    <ChatComponent chatId={currentChat?.id} />
                </div>
            </div>
        </div>
    );
};

export default PDFChatTabs;
