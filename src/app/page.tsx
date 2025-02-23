"use client";
import React, { Suspense, useEffect, useState } from "react";
import SplashScreen from "@/components/ui/splash-screen";
import Login from "@/app/(auth)/login/page";
import { ReactQueryDevtools } from "react-query/devtools";
import { DashboardComponent } from "@/components/dashboard/dashboard-component";
import { useAuth } from "@/store/authStore";
import { useRouter } from "next/navigation";
import LandingPageComponent from "@/components/landing-page/landing-page-component";

const MyApp = () => {
  const { user, isLoading, isInitialized } = useAuth();
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {});
  if (!user) {
    return <LandingPageComponent />;
  }

  return (
    // <ProtectedRoute>
    <Suspense fallback={<SplashScreen />}>
      <DashboardComponent />
    </Suspense>
    // </ProtectedRoute>
  );
};

export default MyApp;
