'use server'
import React from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from './ui/button'
import { auth, } from '@clerk/nextjs/server'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { redirect } from 'next/navigation'

async function Plans() {
    const { userId } = await auth()
    const isAuth = !!userId



    return (
        <div className='flex items-center flex-col justify-between m-5'>
            <h1 className='text-2xl font-bold mt-3'>Plans</h1>
            <div className='flex items-center flex-col md:flex-row justify-between gap-4 mt-5 text-center'>
                <Card className='h-full'>
                    <CardHeader>
                        <CardTitle>Free</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul>
                            <li>3 chats per day</li>
                            <li>Lifetime</li>
                        </ul>
                    </CardContent>
                    <CardFooter className={cn('', {
                        'hidden': isAuth
                    })}>
                        <Link href='/sign-in'>
                            <Button className='mx-auto'>Start Now</Button></Link>
                    </CardFooter>
                </Card>
                <Card className=''>
                    <CardHeader>
                        <CardTitle>100₹ / month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul>
                            <li>Unlimited Chats</li>
                            <li>Get access to new features</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Link href={isAuth ? '/subscribe' : '/sign-up?redirect=/subscribe'}>
                            <Button className='mx-auto'>
                                Subscribe Now
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default Plans