"use client";

import { useState } from "react";
import { createSubscription, getSubscriptionIDForLoggedInUser, isPaymentLocked, lockPaymentsOnSubscription, syncRazorpayDataToDB } from "@/lib/razorpay";
import toast from "react-hot-toast";
import { Button } from "./ui/button";


export const SubscribeButton = (Props: any) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            const data = await createSubscription()

            if(data.error && typeof data.error === 'string' && !data.customerId && !data.subscriptionId){
                toast.error(data.error)
                return
            }
            const {subscriptionId,customerId} = data
            
            if(!subscriptionId || !customerId){
                toast.error("Error while creating subscription")
                return
            }
            
            if(await isPaymentLocked(subscriptionId)){
                toast.error("Payments for subscriptions are locked. This could be because you have already made the payment!")
                return
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                subscription_id: subscriptionId,
                name: "ChatPDF SaaS",
                description: "Pro Plan Subscription",
                handler: async function () {
                    const {error,subscriptionId} = await getSubscriptionIDForLoggedInUser()
                    if(error || !subscriptionId){
                        toast.error(error || "An error occured")
                        return
                    }

                    await syncRazorpayDataToDB(subscriptionId)
                    await lockPaymentsOnSubscription(subscriptionId)
                    toast.success("Payment was successfull!")
                    window.location.reload()
                },
                notes: {
                    customerId: customerId,
                },
                theme: {
                    color: "#3399cc",
                },
                modal: {
                    ondismiss: function () {
                        setIsLoading(false);
                        toast.error("Payment was not completed.");
                    },
                    
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Subscription failed:", error);
            toast.error("Something went wrong. Please try again.");
        }finally{
            setIsLoading(false)
        }
    };

    return (
        <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className=""
            {...Props}
        >
            {isLoading ? "Processing..." : "Subscribe to Pro Plan"}
        </Button>
    );
};
