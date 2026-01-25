import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Ionicons } from "@expo/vector-icons";

interface CelebrationProps {
  visible: boolean;
  onComplete?: () => void;
}

interface SparkleProps {
  delay: number;
  x: number;
  y: number;
  size: number;
}

function Sparkle({ delay, x, y, size }: SparkleProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.2, { duration: 300, easing: Easing.out(Easing.back(2)) }),
        withTiming(0, { duration: 400 }),
      ),
    );
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(300, withTiming(0, { duration: 200 })),
      ),
    );
    rotation.value = withDelay(
      delay,
      withTiming(180, { duration: 700, easing: Easing.out(Easing.ease) }),
    );
  }, [delay, scale, opacity, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${String(rotation.value)}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: x,
          top: y,
        },
        animatedStyle,
      ]}
    >
      <Ionicons name="sparkles" size={size} color="#f59e0b" />
    </Animated.View>
  );
}

export function Celebration({ visible, onComplete }: CelebrationProps) {
  const containerOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      containerOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(
          2500,
          withTiming(0, { duration: 300 }, (finished) => {
            "worklet";
            if (finished && onComplete) {
              scheduleOnRN(onComplete);
            }
          }),
        ),
      );
    } else {
      containerOpacity.value = 0;
    }
  }, [visible, containerOpacity, onComplete]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  if (!visible) return null;

  // Generate sparkle positions
  const sparkles: SparkleProps[] = [
    { delay: 0, x: 20, y: 30, size: 24 },
    { delay: 100, x: 80, y: 10, size: 20 },
    { delay: 200, x: 150, y: 40, size: 28 },
    { delay: 150, x: 220, y: 20, size: 22 },
    { delay: 300, x: 280, y: 50, size: 26 },
    { delay: 50, x: 50, y: 80, size: 18 },
    { delay: 250, x: 130, y: 90, size: 24 },
    { delay: 180, x: 200, y: 70, size: 20 },
    { delay: 350, x: 260, y: 85, size: 22 },
  ];

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, containerStyle]}
      pointerEvents="none"
    >
      <View className="flex-1 relative">
        {sparkles.map((sparkle, index) => (
          <Sparkle key={index} {...sparkle} />
        ))}
      </View>
    </Animated.View>
  );
}
