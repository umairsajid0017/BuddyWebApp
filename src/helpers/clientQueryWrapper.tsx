'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import React, { type ReactNode, useState, useEffect } from 'react'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { logQueryError } from './errorLogger';

export default function QueryClientWrapper({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  }))

  // Set up global error handler
  useEffect(() => {
    // This helps catch errors that might be swallowed by React Query
    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      logQueryError(event.reason);
    };

    window.addEventListener('unhandledrejection', unhandledRejectionHandler);
    
    return () => {
      window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}