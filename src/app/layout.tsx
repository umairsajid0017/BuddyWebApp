import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import React from "react";
import AuthProvider from "@/components/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import QueryClientWrapper from "@/helpers/clientQueryWrapper";
import NavBar from "@/components/ui/navbar";
import NavbarWrapper from "@/components/ui/navbar-wrapper";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/ui/footer";
import FcmProvider from "@/components/FcmProvider";

export const metadata: Metadata = {
  title: "Buddy Customer",
  description: "Buddy website for customers",
  icons: [{ rel: "icon", url: "/assets/logo.png" }],
}; 

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <QueryClientWrapper>
          {/* <AuthProvider> */}
          <FcmProvider>
            <div className="flex min-h-screen flex-col">
              <NavbarWrapper />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            {/* </AuthProvider> */}
          </FcmProvider>
          <Toaster />
        </QueryClientWrapper>
      </body>
    </html>
  );
}
