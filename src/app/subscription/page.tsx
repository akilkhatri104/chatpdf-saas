'use client'
import { getSubscriptionById, getSubscriptionForLoggedInUser, getSubscriptionIDForLoggedInUser, isSubscriptionActive, userHasActiveSubscription } from '@/lib/razorpay'
import { SubscribeButton } from '@/components/SubscribeButton'
import React, { useEffect, useState } from 'react'
import { DrizzleUserSubscription, } from '@/lib/db/schema'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import SubscriptionCancelButton from '@/components/SubscriptionCancelButton'
import { useQuery } from '@tanstack/react-query'

function SubscriptionPage() {
    const { isPending, isError, error, isFetched, data: subscription } = useQuery({
        queryKey: ['subscription'],
        queryFn: getSubscriptionForLoggedInUser,
    })
    const { data: isActive } = useQuery({
        queryKey: ['isSubscriptionActive'],
        queryFn: isSubscriptionActive
    })
    const router = useRouter()
    useEffect(() => {
        if (!isPending && !subscription)
            router.push('/')
    }, [isPending, subscription, router])


    return (
        <div className='w-screen min-h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white flex justify-center items-center'>
            <div className='bg-accent-foreground text-secondary rounded-2xl flex flex-col items-center justify-center md:w-1/3 p-5'>
                {isPending ? (<div className='flex flex-row'>Loading Subscription <Loader2 className='animate-spin ml-2' /></div>) : (
                    <div>
                        {(subscription !== null) ? (
                            <div className=''>
                                <div className='flex flex-row justify-between gap-5'>
                                    <div className='font-semibold'>
                                        Pro Subscription
                                    </div>
                                    <div className={cn('font-semibold mx-auto rounded-2xl px-3', {
                                        'bg-green-400': subscription?.subscriptionStatus == 'active',
                                        'bg-red-500': subscription?.subscriptionStatus == 'cancelled',
                                        'bg-red-400': subscription?.subscriptionStatus == 'expired',
                                        'bg-red-300': subscription?.subscriptionStatus == 'halted',
                                        'bg-green-300': subscription?.subscriptionStatus === 'created',
                                        'bg-green-200': subscription?.subscriptionStatus === 'completed'
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
                                {
                                    !subscription || subscription?.paymentsLocked ? 
                                    <h1 className='text-destructive'>We are processing your subscription</h1> : 
                                    <div className='mx-auto'>
                                        {
                                            subscription.subscriptionStatus === 'active' &&
                                            <SubscriptionCancelButton subscriptionId={subscription?.razorpaySubscriptionId as string} />
                                        }
                                        {
                                            typeof isActive === 'boolean' && !isActive && <SubscribeButton variant={'secondary'} />
                                        }

                                    </div>
                                }
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