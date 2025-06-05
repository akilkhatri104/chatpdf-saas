import { loadS3IntoPinecone } from "@/lib/pinecone";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest,res: NextResponse) {
    try {
        const body = await req.json();
        const {fileKey,fileName} = body
        console.log(fileKey, fileName);
        if (!fileKey || !fileName) {
            return NextResponse.json({ error: "Missing fileKey or fileName" }, { status: 400 });
        }
        const pages = await loadS3IntoPinecone(fileKey)
        console.log("Loaded pages from S3 into Pinecone:", pages);
        
        return NextResponse.json({
            message: "File upload request received",
            fileKey,
            fileName,pages,
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error in POST /api/create-app:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        
    }
}