'use client'
import React from 'react'
import {QueryClientProvider,QueryClient} from '@tanstack/react-query'

type Props = {
    children: React.ReactNode
}

const Provider = ({children}: Props) => {
    const queryClient = new QueryClient()
  return ( 
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
  )
}

export default Provider