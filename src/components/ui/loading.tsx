import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import * as loadingAnimation from '@/components/ui/assets/animations/loading-splash.json';

interface LoadingProps {
  onFinished?: () => void;
  duration?: number;
}

const Loading: React.FC<LoadingProps> = () => {

 const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };


  return (
   <div className='flex items-center justify-center'>

        <Lottie options={defaultOptions} height={24} width={124}  isClickToPauseDisabled={true} />
   </div>
    
  );
};

export default Loading;