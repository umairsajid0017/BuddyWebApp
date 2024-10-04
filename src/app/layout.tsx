import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import React from "react";
import AuthProvider from "@/components/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import QueryClientWrapper from "@/components/client-query/clientQueryWrapper";

export const metadata: Metadata = {
  title: "Buddy Customer",
  description: "Buddy website for customers",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
      <QueryClientWrapper>
      <AuthProvider>
            {children}
          </AuthProvider>
      </QueryClientWrapper>
      </body>
    </html>
  );
}
