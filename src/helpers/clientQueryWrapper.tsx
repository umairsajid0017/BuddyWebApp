'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import React, { type ReactNode, useState } from 'react'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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