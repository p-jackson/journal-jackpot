import { View } from 'react-native';

function HeaderRoot({ children }: { children: React.ReactNode }) {
	return (
		<View>
			<View className="px-4 h-14 flex flex-row items-center">
				{children}
			</View>
		</View>
	);
}

function HeaderLeft({ children }: { children: React.ReactNode }) {
	return <View className="flex flex-row flex-1 justify-start">{children}</View>;
}

function HeaderCenter({ children }: { children: React.ReactNode }) {
	return (
		<View className="flex flex-row justify-center flex-[3]">
			{children}
		</View>
	);
}

function HeaderRight({ children }: { children?: React.ReactNode }) {
	return <View className="flex flex-row flex-1 justify-end">{children}</View>;
}

export const Header = Object.assign(HeaderRoot, {
	Left: HeaderLeft,
	Center: HeaderCenter,
	Right: HeaderRight,
});
