import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { Text } from '../components/ui/text';
import { Slot, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Header } from '../components/ui/header';
import { Link } from '../components/ui/link';
import { DevResetButton } from '../components/ui/dev-reset-button';
import { HistoryProvider, useHistoryContext } from '../contexts/history-context';
import { clearAllData } from '../storage/prompt-storage';
import {
	SpaceGrotesk_400Regular,
	SpaceGrotesk_500Medium,
	SpaceGrotesk_600SemiBold,
	SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import {
	DMSans_400Regular,
	DMSans_500Medium,
	DMSans_600SemiBold,
	DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
	IBMPlexMono_400Regular,
	IBMPlexMono_500Medium,
	IBMPlexMono_600SemiBold,
} from '@expo-google-fonts/ibm-plex-mono';
import * as SplashScreen from 'expo-splash-screen';
import '../../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontsLoaded, fontError] = useFonts({
		SpaceGrotesk_400Regular,
		SpaceGrotesk_500Medium,
		SpaceGrotesk_600SemiBold,
		SpaceGrotesk_700Bold,
		DMSans_400Regular,
		DMSans_500Medium,
		DMSans_600SemiBold,
		DMSans_700Bold,
		IBMPlexMono_400Regular,
		IBMPlexMono_500Medium,
		IBMPlexMono_600SemiBold,
	});
	const [resetKey, setResetKey] = useState(0);

	useEffect(() => {
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	if (!fontsLoaded && !fontError) {
		return null;
	}

	const handleReset = () => {
		Alert.alert('Reset', 'Clear all data?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Reset',
				style: 'destructive',
				onPress: async () => {
					await clearAllData();
					setResetKey((k) => k + 1);
				},
			},
		]);
	};

	return (
		<HistoryProvider key={resetKey}>
			<AppShell onReset={handleReset} />
		</HistoryProvider>
	);
}

function AppShell({ onReset }: { onReset: () => void }) {
	const pathname = usePathname();
	const { hasHistory } = useHistoryContext();

	const isHome = pathname === '/';
	const pageTitle = isHome ? 'Journal Jackpot' : 'History';

	return (
		<View className="flex-1 bg-surface dark:bg-surface-dark">
		<SafeAreaView style={{ flex: 1 }}>
			{!isHome && (
				<Header>
					<Header.Left>
						<Link href="back" label="Back" icon="chevron-back" />
					</Header.Left>
					<Header.Center>
						<Text variant="page-title">{pageTitle}</Text>
					</Header.Center>
					<Header.Right />
				</Header>
			)}
			{isHome && __DEV__ && (
				<View className="flex-row justify-between px-4 pt-1">
					<DevResetButton onPress={onReset} />
					{hasHistory && (
						<Link href="/history" label="History" icon="time-outline" />
					)}
				</View>
			)}
			{isHome && !__DEV__ && hasHistory && (
				<View className="flex-row justify-end px-4 pt-1">
					<Link href="/history" label="History" icon="time-outline" />
				</View>
			)}
			<View className="flex-1 w-full">
				<Slot />
			</View>
		</SafeAreaView>
		</View>
	);
}
