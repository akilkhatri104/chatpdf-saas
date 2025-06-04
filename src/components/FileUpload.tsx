'use client'


import { uploadToS3 } from "@/lib/s3"
import { Inbox } from "lucide-react"
import React from "react"
import {useDropzone} from "react-dropzone"

const FileUpload = () => {
    const {getInputProps,getRootProps} = useDropzone({
        accept: {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        onDrop: async(accessceptedFiles) => {
            console.log(accessceptedFiles);

            try {
                const file = accessceptedFiles[0];
                if(file.size > 10 * 1024 * 1024) { // 10 MB limit
                    alert("File size exceeds the 10 MB limit.");
                    return
                }
    
                const data = await uploadToS3(file)
                console.log("File uploaded successfully:", data);
                
            } catch (error) {
                console.error("Error uploading file:", error);
                alert("Failed to upload file. Please try again.");
                
            }   

        }
    })
    return (
        <div className="p-2 rounded-xl bg-gray-800">
            <div {...getRootProps()} className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer">
                <input 
                {...getInputProps()} />
                <>
                    <Inbox className="w-10 h-10" />
                    <p className="mt-2 text-sm">Drop PDF here</p>
                </>
            </div>
        </div>
    )
}

export default FileUpload