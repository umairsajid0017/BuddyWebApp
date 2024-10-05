'use client'
import React, {  Suspense, useState } from "react";
import SplashScreen from '@/components/ui/splash-screen';
import Login from "@/app/(auth)/login/page";
import { ReactQueryDevtools } from "react-query/devtools";
import { DashboardComponent } from "@/components/component/dashboard-component";
import { useAuth } from "@/store/authStore";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useRouter } from "next/navigation";

const MyApp = () => {

const { user, isLoading, isInitialized } = useAuth();
const router = useRouter();


  return (

    // <ProtectedRoute>
         <DashboardComponent />
      // </ProtectedRoute>

  );
};

export default MyApp;