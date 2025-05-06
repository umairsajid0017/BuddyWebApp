"use client";
import React, { Suspense } from "react";
import SplashScreen from "@/components/ui/splash-screen";
import { useAuth } from "@/apis/apiCalls";
import DashboardComponent from "@/components/dashboard/dashboard-component";
import LandingPageComponent from "@/components/landing-page/landing-page-component";
import useAuthStore from "@/store/authStore";
const MyApp = () => {
  const { isLoading } = useAuth();
  const { user } = useAuthStore();

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!user) {
    return <LandingPageComponent />;
  }

  return (
    <Suspense fallback={<SplashScreen />}>
      <DashboardComponent />
    </Suspense>
  );
};

export default MyApp;
