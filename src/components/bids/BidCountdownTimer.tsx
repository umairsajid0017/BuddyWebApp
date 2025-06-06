import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BidCountdownTimerProps {
  expirationTimeInSeconds: number;
  onExpire?: () => void;
}

export const BidCountdownTimer: React.FC<BidCountdownTimerProps> = ({
  expirationTimeInSeconds,
  onExpire,
}) => {
  const [timeLeft, setTimeLeft] = useState(expirationTimeInSeconds);

  useEffect(() => {
    // Set initial time when expirationTimeInSeconds changes
    setTimeLeft(expirationTimeInSeconds);
  }, [expirationTimeInSeconds]);

  useEffect(() => {
    // If the bid has already expired, call onExpire immediately
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          onExpire?.();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) {
      return "Expired";
    }

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    
    if (days > 0) {
      parts.push(`${days}d`);
    }
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }
    
    // Show seconds only if less than 1 hour remaining or if it's the only unit
    if (seconds < 3600 || parts.length === 0) {
      parts.push(`${remainingSeconds}s`);
    }

    return parts.slice(0, 2).join(" "); // Show only the two most significant units
  };

  const getVariant = () => {
    if (timeLeft <= 0) {
      return "destructive";
    }
    if (timeLeft <= 1800) { // Less than 30 minutes - critical
      return "destructive";
    }
    if (timeLeft <= 3600) { // Less than 1 hour - warning
      return "secondary";
    }
    if (timeLeft <= 86400) { // Less than 1 day - caution
      return "outline";
    }
    return "default"; // More than 1 day - normal
  };

  const badgeClasses = `flex items-center gap-1 ${
    timeLeft <= 1800 && timeLeft > 0 ? "animate-pulse" : ""
  }`;

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getVariant() as any} className={badgeClasses}>
        <Clock className="h-3 w-3" />
        {formatTime(timeLeft)}
      </Badge>
    </div>
  );
}; 