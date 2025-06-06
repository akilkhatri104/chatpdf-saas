"use client";

import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {toast} from 'react-hot-toast'
import { useRouter } from "next/navigation";

const FileUpload = () => {
    const router = useRouter()
    const [uploading,setUploading] = useState(false)
    const { mutate,isPending } = useMutation({
        mutationFn: async ({
            fileKey,
            fileName,
        }: {
            fileKey: string;
            fileName: string;
        }) => {
            const res = await axios.post("/api/create-chat", {
                fileKey,
                fileName,
            });
            return res.data;
        },
    });
    const { getInputProps, getRootProps } = useDropzone({
        accept: {
            "application/pdf": [".pdf"],
        },
        maxFiles: 1,
        onDrop: async (accessceptedFiles) => {
            console.log(accessceptedFiles);

            try {
                setUploading(true)
                const file = accessceptedFiles[0];
                if (file.size > 10 * 1024 * 1024) {
                    // 10 MB limit
                    toast.error("File size exceeds the 10 MB limit.");
                    return;
                }

                const data = await uploadToS3(file);
                if(!data?.fileKey || !data.fileName) {
                    toast.error("Failed to upload file. Please try again.");
                    return
                }
                console.log("File uploaded to S3:", data);
                mutate({
                    fileKey: data.fileKey,
                    fileName: data.fileName,
                },{
                    onSuccess: ({chatId}) => {
                        toast.success('Chat Created!')
                        router.push(`/chat/${chatId}`)
                    },
                    onError: (error) => {
                        console.error("Error uploading file:", error);
                        toast.error("Failed to upload file. Please try again.");
                        
                    }
                })
            } catch (error) {
                console.error("Error uploading file:", error);
                toast.error("Failed to upload file. Please try again.");
            } finally {
                setUploading(false)
            }
        },
    });
    return (
        <div className="p-2 rounded-xl bg-gray-800">
            <div
                {...getRootProps()}
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer"
            >
                <input {...getInputProps()} />
                {uploading || isPending ? (
                    <>
                        <Loader2 className="h-10 w-10 animate-spin text-white" />
                        <p className="mt-2 text-sm">Uploading the PDF...</p>
                    </>
                ) : (
                    <>
                    <Inbox className="w-10 h-10" />
                    <p className="mt-2 text-sm">Drop PDF here</p>
                </>
                )}
                
            </div>
        </div>
    );
};

export default FileUpload;
