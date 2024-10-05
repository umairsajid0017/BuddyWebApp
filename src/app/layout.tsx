import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import React from "react";
import AuthProvider from "@/components/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import QueryClientWrapper from "@/components/client-query/clientQueryWrapper";
import NavBar from "@/components/ui/navbar";
import NavbarWrapper from "@/components/ui/navbar-wrapper";

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
      {/* <AuthProvider> */}
      <NavbarWrapper/>

            {children}

          {/* </AuthProvider> */}
      </QueryClientWrapper>
      </body>
    </html>
  );
}
