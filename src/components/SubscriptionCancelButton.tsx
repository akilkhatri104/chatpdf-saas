'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import toast from 'react-hot-toast'
import { cancelSubscriptionById } from '@/lib/razorpay'

type Props = {
  subscriptionId: string
}

function SubscriptionCancelButton({ subscriptionId }: Props) {
  const [isLoading,setIsLoading] = useState(false)
  const cancelHandler = async () => {
    setIsLoading(true)
    try {
      const { error } = await cancelSubscriptionById(subscriptionId)
      if (typeof error === 'string') {
        throw new Error(error)
      }


      toast.success("Subscription canceled successfully")
      window.location.reload()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occured while canceling subscription")
    }finally{
      setIsLoading(false)
    }
  }
  return (
    <Button variant={'destructive'} onClick={cancelHandler} disabled={isLoading} >
      {
        isLoading ? "Canceling Subscription" : "Cancel Subscription"
      }
    </Button>
  )
}

export default SubscriptionCancelButton