const { View } = require('react-native');
const React = require('react');

const createAnimatedComponent = (Component) => {
	const AnimatedComponent = React.forwardRef((props, ref) => {
		return React.createElement(Component, { ...props, ref });
	});
	AnimatedComponent.displayName = `Animated(${
		Component.displayName || Component.name || 'Component'
	})`;
	return AnimatedComponent;
};

const AnimatedView = createAnimatedComponent(View);

const mock = {
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
		back: jest.fn(() => (t) => t),
		ease: (t) => t,
	},
};

module.exports = {
	__esModule: true,
	...mock,
	default: mock,
};
