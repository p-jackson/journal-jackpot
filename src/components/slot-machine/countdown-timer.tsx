import { useState, useEffect } from 'react';
import { Text } from 'react-native';

interface CountdownTimerProps {
  targetDate: string;
}

function formatTimeLeft(ms: number): string {
  if (ms <= 0) return '0m';

  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => {
    return new Date(targetDate).getTime() - Date.now();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = new Date(targetDate).getTime() - Date.now();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <Text className="text-text-muted text-sm text-center">
      {formatTimeLeft(timeLeft)} until next spin
    </Text>
  );
}
