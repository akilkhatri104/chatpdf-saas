import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest,res: NextResponse) {
    try {
        const body = await req.json();
        const {fileKey,fileName} = body
        console.log(fileKey, fileName);
        return NextResponse.json({
            message: "File upload request received",
            fileKey,
            fileName,
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error in POST /api/create-app:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        
    }
}