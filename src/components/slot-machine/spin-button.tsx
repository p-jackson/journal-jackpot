import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface SpinButtonProps {
  onPress: () => void;
  disabled: boolean;
  spinning: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SpinButton({ onPress, disabled, spinning }: SpinButtonProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (spinning) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 300 }),
          withTiming(1, { duration: 300 })
        ),
        -1,
        false
      );
    } else {
      cancelAnimation(scale);
      scale.value = withTiming(1, { duration: 150 });
    }
  }, [spinning, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isDisabled = disabled || spinning;

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        animatedStyle,
        {
          paddingHorizontal: 48,
          paddingVertical: 16,
          borderRadius: 9999,
          backgroundColor: isDisabled ? '#a1a1aa' : '#7c3aed',
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      <Text className="text-white font-heading text-lg font-bold text-center">
        {spinning ? 'SPINNING...' : 'SPIN'}
      </Text>
    </AnimatedPressable>
  );
}
