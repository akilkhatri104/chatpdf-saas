'use client'
import { cancelAllSubscriptions } from '@/lib/razorpay'
import React  from 'react'

function SubscriptionCleanUp() {
    
    const cleanUp = async() => {
        await cancelAllSubscriptions()
    }
  return (
    <div>
        <form action={cleanUp}>
            <button type='submit'>CleanUp</button>
        </form>
    </div>
  )
}

export default SubscriptionCleanUp