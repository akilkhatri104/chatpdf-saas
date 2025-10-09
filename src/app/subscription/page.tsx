'use client'
import { getSubscriptionById, getSubscriptionIDForLoggedInUser, isSubscriptionActive, userHasActiveSubscription } from '@/lib/razorpay'
import { SubscribeButton } from '@/components/SubscribeButton'
import React, { useEffect, useState } from 'react'
import { DrizzleUserSubscription, } from '@/lib/db/schema'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import SubscriptionCancelButton from '@/components/SubscriptionCancelButton'

function SubscriptionPage() {
    const [subscription, setSubscription] = useState<DrizzleUserSubscription | null>(null)
    const [hasActiveSubscription, setHasActiveSubscription] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    useEffect(() => {
        setIsLoading(true)

        const getSubscription = async () => {
            setHasActiveSubscription(await isSubscriptionActive())
            const { subscriptionId } = await getSubscriptionIDForLoggedInUser()
            if (!subscriptionId || subscriptionId === undefined)
                router.push('/')

            const subscription: DrizzleUserSubscription | null = await getSubscriptionById(subscriptionId as string)
            setSubscription(subscription)
            setIsLoading(false)
        }

        getSubscription()
    }, [router])

    return (
        <div className='w-screen min-h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white flex justify-center items-center'>
            <div className='bg-accent-foreground text-secondary rounded-2xl flex flex-col items-center justify-center md:w-1/3 p-5'>
                {isLoading ? (<div className='flex flex-row'>Loading Subscription <Loader2 className='animate-spin ml-2' /></div>) : (
                    <div>
                        {(subscription !== null) ? (
                            <div className=''>
                                <div className='flex flex-row justify-between gap-5'>
                                    <div className='font-semibold'>
                                        Pro Subscription
                                    </div>
                                    <div className={cn('font-semibold mx-auto rounded-2xl px-3', {
                                        'bg-green-300': subscription.subscriptionStatus == 'active',
                                        'bg-red-500': subscription.subscriptionStatus == 'cancelled',
                                        'bg-red-400': subscription.subscriptionStatus == 'expired',
                                        'bg-red-300': subscription.subscriptionStatus == 'halted',
                                        'bg-green-100' : subscription.subscriptionStatus === 'created',
                                        'bg-green-200' : subscription.subscriptionStatus === 'completed'
                                    })}>
                                        {subscription?.subscriptionStatus}
                                    </div>
                                </div>
                                <div className='mb-2'>
                                    {subscription?.currentStart && (
                                        <>Current Start: {subscription?.currentStart?.toLocaleDateString()}
                                        <br />
                                        </>
                                    )} 
                                    {subscription?.currentEnd && (
                                        <>
                                            Current End {subscription?.currentEnd?.toLocaleDateString()
                                            }
                                            <br />
                                        </>
                                    )} 
                                    {subscription?.chargeAt && (
                                        <>
                                            Charge Date: {subscription?.chargeAt?.toLocaleDateString()}
                                            <br />
                                        </>
                                    )}
                                </div>
                                <div className='mx-auto'>
                                    {hasActiveSubscription && subscription.subscriptionStatus !== 'cancelled' ? <SubscriptionCancelButton subscriptionId={subscription?.razorpaySubscriptionId as string} /> : <SubscribeButton variant={'secondary'}/>}
                                </div>
                            </div>
                        ) : (
                            <SubscribeButton />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SubscriptionPage