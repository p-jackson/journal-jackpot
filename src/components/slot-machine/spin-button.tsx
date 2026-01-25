import { Pressable, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { useEffect } from "react";

interface SpinButtonProps {
  onPress: () => void;
  disabled: boolean;
  spinning: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SpinButton({ onPress, disabled, spinning }: SpinButtonProps) {
  const scale = useSharedValue(1);
  const pressY = useSharedValue(-3);

  useEffect(() => {
    if (spinning) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 300 }),
          withTiming(1, { duration: 300 }),
        ),
        -1,
        false,
      );
    } else {
      cancelAnimation(scale);
      scale.value = withTiming(1, { duration: 150 });
    }
  }, [spinning, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressY.value }],
  }));

  const isDisabled = disabled || spinning;

  const faceColors: [string, string] = isDisabled
    ? ["#6b7280", "#4b5563"]
    : ["#ef4444", "#dc2626"];

  const baseColor = isDisabled ? "#374151" : "#b8860b";

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      onPressIn={() => {
        if (!isDisabled) pressY.value = withTiming(0, { duration: 60 });
      }}
      onPressOut={() => {
        pressY.value = withTiming(-3, { duration: 100 });
      }}
      style={animatedStyle}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {/* Shadow base — gives 3D depth */}
      <View
        style={{
          backgroundColor: baseColor,
          borderRadius: 9999,
          paddingHorizontal: 4,
          paddingVertical: 4,
        }}
      >
        {/* Button face — shifts up from base */}
        <Animated.View
          style={[{ borderRadius: 9999, overflow: "hidden" }, faceStyle]}
        >
          <LinearGradient
            colors={faceColors}
            style={{
              paddingHorizontal: 48,
              paddingVertical: 16,
              borderRadius: 9999,
              alignItems: "center",
            }}
          >
            {/* Shine highlight */}
            {!isDisabled && (
              <LinearGradient
                colors={["rgba(255,255,255,0.3)", "transparent"]}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "50%",
                  borderTopLeftRadius: 9999,
                  borderTopRightRadius: 9999,
                }}
                pointerEvents="none"
              />
            )}
            <Text
              style={{
                color: "#ffffff",
                fontFamily: "SpaceGrotesk_700Bold",
                fontSize: 18,
                fontWeight: "700",
                textAlign: "center",
                letterSpacing: 2,
              }}
            >
              {spinning ? "SPINNING..." : "SPIN"}
            </Text>
          </LinearGradient>
        </Animated.View>
      </View>
    </AnimatedPressable>
  );
}
