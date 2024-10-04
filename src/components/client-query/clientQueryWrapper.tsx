'use client'

import { QueryClientProvider, QueryClient } from 'react-query'
import React, { type ReactNode, useState } from 'react'
import { ReactQueryDevtools } from "react-query/devtools";

export default function QueryClientWrapper({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />

    </QueryClientProvider>
  )
}