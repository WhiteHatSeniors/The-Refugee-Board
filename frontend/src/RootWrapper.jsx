import React from 'react'
import Root from './Root'
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()


function RootWrapper() {
    return (
        <QueryClientProvider client={queryClient} >
            <Root />
        </QueryClientProvider>
    )
}

export default RootWrapper