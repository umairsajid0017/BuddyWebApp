import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import * as loadingAnimation from '@/components/ui/assets/animations/loading-splash.json';
import backgroundSvg from '@/components/ui/assets/background-pattern.svg';

interface SplashScreenProps {
  onFinished: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const backgroundImageUrl = (backgroundSvg as { src: string }).src;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onFinished();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onFinished]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-r from-blue-500 to-purple-600"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="relative pointer-events-none">
        <Lottie options={defaultOptions} height={42} width={42}   isClickToPauseDisabled={true} />
      </div>
    </div>
  );
};

export default SplashScreen;