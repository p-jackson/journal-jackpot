import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  cancelAnimation,
} from "react-native-reanimated";
import { useEffect } from "react";

const LIGHT_COLORS = [
  "#fbbf24",
  "#ef4444",
  "#22c55e",
  "#fbbf24",
  "#ef4444",
  "#22c55e",
];

interface MachineLightsProps {
  active: boolean;
}

interface LightDotProps {
  color: string;
  index: number;
  active: boolean;
  style: {
    position: "absolute";
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

function LightDot({ color, index, active, style }: LightDotProps) {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    if (active) {
      opacity.value = withDelay(
        index * 120,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 200 }),
            withTiming(0.2, { duration: 200 }),
          ),
          -1,
          false,
        ),
      );
    } else {
      cancelAnimation(opacity);
      opacity.value = withTiming(0.2, { duration: 300 });
    }
  }, [active, index, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
          ...style,
        },
        animatedStyle,
      ]}
    />
  );
}

// Positions around the perimeter
const LIGHT_POSITIONS: LightDotProps["style"][] = [
  // Top edge
  { position: "absolute", top: -4, left: 40 },
  { position: "absolute", top: -4, left: 100 },
  { position: "absolute", top: -4, right: 100 },
  { position: "absolute", top: -4, right: 40 },
  // Right edge
  { position: "absolute", top: 60, right: -4 },
  { position: "absolute", top: 160, right: -4 },
  { position: "absolute", bottom: 120, right: -4 },
  { position: "absolute", bottom: 40, right: -4 },
  // Bottom edge
  { position: "absolute", bottom: -4, right: 40 },
  { position: "absolute", bottom: -4, right: 100 },
  { position: "absolute", bottom: -4, left: 100 },
  { position: "absolute", bottom: -4, left: 40 },
  // Left edge
  { position: "absolute", bottom: 40, left: -4 },
  { position: "absolute", bottom: 120, left: -4 },
  { position: "absolute", top: 160, left: -4 },
  { position: "absolute", top: 60, left: -4 },
];

export function MachineLights({ active }: MachineLightsProps) {
  return (
    <View
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      pointerEvents="none"
    >
      {LIGHT_POSITIONS.map((pos, i) => (
        <LightDot
          key={i}
          color={LIGHT_COLORS[i % LIGHT_COLORS.length]}
          index={i}
          active={active}
          style={pos}
        />
      ))}
    </View>
  );
}
