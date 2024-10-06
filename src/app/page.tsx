'use client'
import React, {  Suspense, useEffect, useState } from "react";
import SplashScreen from '@/components/ui/splash-screen';
import Login from "@/app/(auth)/login/page";
import { ReactQueryDevtools } from "react-query/devtools";
import { DashboardComponent } from "@/components/dashboard/dashboard-component";
import { useAuth } from "@/store/authStore";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useRouter } from "next/navigation";

const MyApp = () => {

const { user, isLoading, isInitialized } = useAuth();
const [showSplash, setShowSplash] = useState<boolean>(true);
const router = useRouter();

useEffect(()=> {
  setTimeout(()=> setShowSplash(false), 1000 )
})

  return (

    // <ProtectedRoute>
    <Suspense fallback={<SplashScreen/>}>

         <DashboardComponent />
    </Suspense>
      // </ProtectedRoute>

  );
};

export default MyApp;