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
    selectedWord || '\u2014'
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
      setDisplayWord('\u2014');
    }
  }, [spinning, stopDelay, selectedWord, reel.words.length, opacity, translateY, handleStopped]);

  useEffect(() => {
    if (spinning) {
      setDisplayWord(reel.words[cycleIndex]);
    }
  }, [cycleIndex, spinning, reel.words]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const hasResult = selectedWord && !spinning;

  return (
    <View
      style={[
        {
          flex: 1,
          height: 80,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 6,
        },
        hasResult && {
          backgroundColor: 'rgba(251,191,36,0.12)',
        },
      ]}
    >
      <Animated.View style={animatedStyle}>
        <Text
          style={{
            fontFamily: 'SpaceGrotesk_600SemiBold',
            fontSize: 15,
            textAlign: 'center',
            color: hasResult ? '#92400e' : '#18181b',
          }}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {displayWord}
        </Text>
      </Animated.View>
    </View>
  );
}
