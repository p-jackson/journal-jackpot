// Extend Jest with React Native Testing Library matchers
require('@testing-library/react-native/build/matchers/extend-expect');

// Mock expo-router
jest.mock('expo-router', () => ({
	useRouter: jest.fn(() => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() })),
	usePathname: jest.fn(() => '/'),
	Link: ({ children }: { children: React.ReactNode }) => children,
	Slot: () => null,
}));

// Mock expo-font
jest.mock('expo-font', () => ({
	useFonts: () => [true, null],
	isLoaded: () => true,
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
	preventAutoHideAsync: jest.fn(),
	hideAsync: jest.fn(),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
	const { View } = require('react-native');
	const React = require('react');

	const createAnimatedComponent = (Component: React.ComponentType) => {
		const AnimatedComponent = React.forwardRef((props: Record<string, unknown>, ref: React.Ref<unknown>) => {
			return React.createElement(Component, { ...props, ref });
		});
		AnimatedComponent.displayName = `Animated(${Component.displayName || Component.name || 'Component'})`;
		return AnimatedComponent;
	};

	const AnimatedView = createAnimatedComponent(View);

	const module = {
		View: AnimatedView,
		createAnimatedComponent,
		useSharedValue: jest.fn((initial) => ({ value: initial })),
		useAnimatedStyle: jest.fn(() => ({})),
		withTiming: jest.fn((toValue) => toValue),
		withSequence: jest.fn((...args) => args[args.length - 1]),
		withDelay: jest.fn((_, animation) => animation),
		withRepeat: jest.fn((animation) => animation),
		cancelAnimation: jest.fn(),
		runOnJS: jest.fn((fn) => fn),
		Easing: {
			out: jest.fn((fn) => fn),
			back: jest.fn(() => (t: number) => t),
			ease: (t: number) => t,
		},
	};

	return {
		__esModule: true,
		...module,
		default: module,
	};
});
