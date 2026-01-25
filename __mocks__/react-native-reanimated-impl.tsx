import React from "react";
import { View } from "react-native";
import type { ComponentType } from "react";

type AnimationCallback = (finished: boolean) => void;

export const createAnimatedComponent = <P extends object>(
  Component: ComponentType<P>,
) => {
  const AnimatedComponent = React.forwardRef<unknown, P>((props, ref) => {
    return React.createElement(Component, { ...props, ref });
  });
  const name = Component.displayName ?? Component.name;
  AnimatedComponent.displayName = `Animated(${name})`;
  return AnimatedComponent;
};

export const AnimatedView = createAnimatedComponent(View);
export { AnimatedView as View };

export const useSharedValue = jest.fn((initial: unknown) => ({
  value: initial,
}));
export const useAnimatedStyle = jest.fn(() => ({}));
export const withTiming = jest.fn(
  (toValue: number, _config?: unknown, callback?: AnimationCallback) => {
    if (callback) callback(true);
    return toValue;
  },
);
export const withSequence = jest.fn(
  (...args: number[]) => args[args.length - 1],
);
export const withDelay = jest.fn((_: number, animation: number) => animation);
export const withRepeat = jest.fn((animation: number) => animation);
export const cancelAnimation = jest.fn();
export const runOnJS = jest.fn(
  <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
);
export const Easing = {
  out: jest.fn((fn: (t: number) => number) => fn),
  back: jest.fn(() => (t: number) => t),
  ease: (t: number) => t,
};

const mock = {
  View: AnimatedView,
  createAnimatedComponent,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  cancelAnimation,
  runOnJS,
  Easing,
};

export default mock;
