"use client";

import {  useState } from "react";
import { createSubscription, getSubscriptionForLoggedInUser, getSubscriptionIDForLoggedInUser, isPaymentLocked, lockPaymentsOnSubscription, syncRazorpayDataToDB } from "@/lib/razorpay";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils";

type Props = {
    variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined,
    className: string
}

export const SubscribeButton = ({variant,className}: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const { data: subscription, isPending } = useQuery({
        queryKey: ['subscription'],
        queryFn: getSubscriptionForLoggedInUser,
        refetchOnWindowFocus: false
    })
    const router = useRouter()
    const pathname = usePathname()
    const handleSubscribe = async () => {
        if (subscription && pathname !== '/subscription') {
            router.push('/subscription')
            return
        }

        setIsLoading(true);
        try {
            const data = await createSubscription()

            if (data.error && typeof data.error === 'string' && !data.customerId && !data.subscriptionId) {
                toast.error(data.error)
                return
            }
            const { subscriptionId, customerId } = data

            if (!subscriptionId || !customerId) {
                toast.error("Error while creating subscription")
                return
            }

            if (await isPaymentLocked(subscriptionId)) {
                toast.error("Payments for subscriptions are locked. This could be because you have already made the payment!")
                return
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                subscription_id: subscriptionId,
                name: "ChatPDF SaaS",
                description: "Pro Plan Subscription",
                handler: async function () {
                    const { error, subscriptionId } = await getSubscriptionIDForLoggedInUser()
                    if (error || !subscriptionId) {
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
        } finally {
            setIsLoading(false)
        }
    };

    return (
        isPending  ? <Skeleton className={cn(`w-[150px] h-[40px] rounded-md  ${className}`,{
            'bg-accent-foreground' : !variant
        })} /> :
            <Button
                onClick={handleSubscribe}
                disabled={isLoading}
                className={`w-[150px] h-[40px] ${className}`}
                variant={variant}
            >   
                {

                    subscription && pathname !== '/subscription' ? ('Manage Subscription') : (isLoading ? "Processing..." : "Subscribe to Pro Plan")
                }

            </Button>
    );
};
