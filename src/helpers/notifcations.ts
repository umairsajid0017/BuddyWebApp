
import type { Notification } from '../types/notification-types';

/**
 * Helper function to format notification timestamps
 */
export const formatNotificationTimestamp = (timestamp: any): string => {
  try {
    // Handle regular timestamp number
    if (timestamp && typeof timestamp === "number") {
      return new Date(timestamp).toISOString();
    }

    // Handle string timestamp
    if (timestamp && typeof timestamp === "string") {
      return new Date(timestamp).toISOString();
    }

    // Default case
    return new Date().toISOString();
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return new Date().toISOString();
  }
};

/**
 * Helper function to play notification sound (optional)
 */
export const playNotificationSound = () => {
  try {
    // Try to play custom notification sound first
    const audio = new Audio('/notification-sound.mp3');
    audio.play().catch(() => {
      // Fallback to system beep sound using Web Audio API
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (e) {
        console.log('Could not play notification sound:', e);
      }
    });
  } catch (error) {
    console.log('Notification sound not available');
  }
};

/**
 * Helper to show browser notification (for backup when app is not in focus)
 */
export const showBrowserNotification = (title: string, body: string, options?: NotificationOptions) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/assets/logo.png',
      ...options
    });
  }
};