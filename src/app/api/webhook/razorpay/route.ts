import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { Subscriptions } from "razorpay/dist/types/subscriptions";

const subscriptionEvents = [
    'subscription.authenticated',
    'subscription.activated',
    'subscription.charged',
    'subscription.completed',
    'subscription.updated',
    'subscription.pending',
    'subscription.halted',
    'subscription.cancelled',
    'subscription.paused',
    'subscription.resumed'
]

export async function POST(req:NextRequest) {
    try {
        const body = await req.text()
        const signature = req.headers.get('x-razorpay-signature')
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET!

        if(!body || !signature || !secret)
            return NextResponse.json({},{status:400})

        if(!Razorpay.validateWebhookSignature(body,signature,secret)){
            return NextResponse.json({},{status: 400})
        }

        const event = await JSON.parse(body)
        if(!event.payload)
            return NextResponse.json({},{status:400})
        
        if(subscriptionEvents.includes(event.event)){
            const sub: Subscriptions.RazorpaySubscription = event?.payload?.subscription?.entity
            await db.update(userSubscriptions).set({
                subscriptionStatus: sub.status,
                currentStart: new Date(sub?.current_start as number * 1000),
                currentEnd: new Date(sub.current_end as number * 1000),
                chargeAt: new Date(sub.start_at as number * 1000),
                paymentsLocked: false
            }).where(eq(userSubscriptions.razorpaySubscriptionId,sub.id))
        }
        
        return NextResponse.json({received: true})
    } catch (error) {
        console.error(error)
        return NextResponse.json({},{status: 500})
    }
}