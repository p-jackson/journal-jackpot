import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { Text } from '../components/ui/text';
import { Slot, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Header } from '../components/ui/header';
import { Link } from '../components/ui/link';
import { DevResetButton } from '../components/ui/dev-reset-button';
import {
	PromptStorageProvider,
	usePromptStorage,
} from '../contexts/prompt-storage-context';
import { clearAllData, getPromptHistory } from '../storage/prompt-storage';
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
import type { SavedPrompt } from '../types';
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
	const [history, setHistory] = useState<SavedPrompt[] | null>(null);
	const [resetKey, setResetKey] = useState(0);

	useEffect(() => {
		getPromptHistory().then(setHistory);
	}, [resetKey]);

	useEffect(() => {
		if ((fontsLoaded || fontError) && history !== null) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError, history]);

	// Wait for fonts AND history
	if ((!fontsLoaded && !fontError) || history === null) {
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
					setHistory(null); // Clear state so we reload fresh
					setResetKey((k) => k + 1);
				},
			},
		]);
	};

	return (
		<PromptStorageProvider key={resetKey} initialHistory={history}>
			<AppShell onReset={handleReset} />
		</PromptStorageProvider>
	);
}

function AppShell({ onReset }: { onReset: () => void }) {
	const pathname = usePathname();
	const [history] = usePromptStorage();
	const hasHistory = history.length >= 2;

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
