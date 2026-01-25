import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withRepeat,
  cancelAnimation,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useEffect, useState, useCallback } from 'react';
import type { Reel as ReelType } from '../../types';

interface ReelProps {
  reel: ReelType;
  spinning: boolean;
  stopDelay: number;
  selectedWord: string | null;
  onStopped?: () => void;
}

export function Reel({
  reel,
  spinning,
  stopDelay,
  selectedWord,
  onStopped,
}: ReelProps) {
  const [displayWord, setDisplayWord] = useState(
    selectedWord || '—'
  );
  const [cycleIndex, setCycleIndex] = useState(0);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  const handleStopped = useCallback(() => {
    onStopped?.();
  }, [onStopped]);

  useEffect(() => {
    if (spinning) {
      // Start cycling through words rapidly
      const cycleInterval = setInterval(() => {
        setCycleIndex((prev) => (prev + 1) % reel.words.length);
      }, 80);

      // Animate blur effect via opacity cycling
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 40 }),
          withTiming(1, { duration: 40 })
        ),
        -1,
        false
      );

      // Animate vertical movement
      translateY.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 40 }),
          withTiming(8, { duration: 40 }),
          withTiming(0, { duration: 40 })
        ),
        -1,
        false
      );

      // Stop after delay
      const stopTimeout = setTimeout(() => {
        clearInterval(cycleInterval);
        opacity.value = withTiming(1, { duration: 200 });
        translateY.value = withSequence(
          withTiming(0, { duration: 200, easing: Easing.out(Easing.back(1.5)) }),
          withTiming(0, { duration: 50 }, () => {
            runOnJS(handleStopped)();
          })
        );
        if (selectedWord) {
          setDisplayWord(selectedWord);
        }
      }, stopDelay);

      return () => {
        clearInterval(cycleInterval);
        clearTimeout(stopTimeout);
        cancelAnimation(opacity);
        cancelAnimation(translateY);
        opacity.value = 1;
        translateY.value = 0;
      };
    } else if (selectedWord) {
      setDisplayWord(selectedWord);
    } else {
      setDisplayWord('—');
    }
  }, [spinning, stopDelay, selectedWord, reel.words.length, opacity, translateY, handleStopped]);

  useEffect(() => {
    if (spinning) {
      setDisplayWord(reel.words[cycleIndex].text);
    }
  }, [cycleIndex, spinning, reel.words]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View className="items-center justify-center w-28 h-20">
      <View
        className={`w-full h-full rounded-xl border-2 items-center justify-center px-2 ${
          selectedWord && !spinning
            ? 'border-amber-400 bg-amber-50'
            : 'border-border bg-white'
        }`}
      >
        <Animated.View style={animatedStyle}>
          <Text
            className="font-heading text-base text-center text-text"
            numberOfLines={2}
            adjustsFontSizeToFit
          >
            {displayWord}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}
