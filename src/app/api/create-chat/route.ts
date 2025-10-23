import { hasReachedFreePlanLimit, isSubscriptionActive } from "@/lib/razorpay";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { deleteFromS3 } from "@/lib/s3-server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { fileKey, fileName } = body;
    let err = false;
    try {
        const { userId } = await auth();
        if (!userId) {
            err = true;
            return NextResponse.json(
                {
                    error: "Unauthorized",
                },
                { status: 400 }
            );
        }

        console.log(fileKey, fileName);
        if (!fileKey || !fileName) {
            err = true;
            return NextResponse.json(
                { error: "Missing fileKey or fileName", success: false },
                { status: 400 }
            );
        }

        const hasActiveSub = await isSubscriptionActive()
        if(!hasActiveSub){
            const limitReached = await hasReachedFreePlanLimit()
            if(limitReached){
                return NextResponse.json({
                    error: "User has reached free plan limit"
                },{status: 402})
            }
        }

        await loadS3IntoPinecone(fileKey);

        const chatId = await db
            .insert(chats)
            .values({
                fileKey: fileKey,
                pdfName: fileName,
                pdfUrl: getS3Url(fileKey),
                userId: userId,
            })
            .returning({
                insertedId: chats.id,
            });

        return NextResponse.json(
            {
                message: "Chat created succesfully",
                chatId: chatId[0].insertedId,
                success: true,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in POST /api/create-app:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    } finally {
        if (err) {
            await deleteFromS3(fileKey);
        }
    }
}
