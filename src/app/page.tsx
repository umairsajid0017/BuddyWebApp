'use client'
import React, {  useState } from "react";
import SplashScreen from '@/components/ui/splash-screen';
import Login from "@/app/(auth)/login/page";
import { ReactQueryDevtools } from "react-query/devtools";

const MyApp = () => {
  const [showSplash, setShowSplash] = useState(true);


  return (
    <>
      {showSplash && <SplashScreen duration={100000} onFinished={() => setShowSplash(true)} />}
      {!showSplash && <Login />}
      <ReactQueryDevtools initialIsOpen={false} />
    </>

  );
};

export default MyApp;