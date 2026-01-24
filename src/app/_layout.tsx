import { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from '../components/ui/Text';
import { Slot, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Header } from '../components/ui/Header';
import { Link } from '../components/ui/Link';
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
	const pathname = usePathname();

	useEffect(() => {
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	if (!fontsLoaded && !fontError) {
		return null;
	}

	const isHome = pathname === '/';
	const pageTitle = isHome ? 'Journal Jackpot' : 'History';

	return (
		<SafeAreaView style={{ flex: 1 }} className="bg-surface dark:bg-surface-dark">
			<Header>
				<Header.Left>
					{!isHome && (
						<Link href="back" label="Back" icon="chevron-back" />
					)}
				</Header.Left>
				<Header.Center>
					<Text variant="page-title">{pageTitle}</Text>
				</Header.Center>
				<Header.Right>
					{isHome && (
						<Link href="/history" label="History" icon="time-outline" />
					)}
				</Header.Right>
			</Header>
			<View className="flex-1 w-full">
				<Slot />
			</View>
		</SafeAreaView>
	);
}
