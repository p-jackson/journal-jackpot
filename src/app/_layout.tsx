import { useEffect, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { Text } from "../components/ui/text";
import type { ErrorBoundaryProps } from "expo-router";
import { Slot, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Header } from "../components/ui/header";
import { Link } from "../components/ui/link";
import { DevResetButton } from "../components/ui/dev-reset-button";
import {
  PromptStorageProvider,
  usePromptStorage,
} from "../prompt-storage-context";
import { clearAllData, getPromptHistory } from "../prompt-storage";
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
} from "@expo-google-fonts/ibm-plex-mono";
import * as SplashScreen from "expo-splash-screen";
import type { HistoryEntry } from "../types";
import "../../global.css";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark justify-center items-center px-6">
      <SafeAreaView>
        <Text variant="page-title" className="mb-4 text-center">
          Something went wrong
        </Text>
        <Text className="mb-6 text-center font-mono">{error.message}</Text>
        <Pressable
          onPress={() => void retry()}
          className="bg-primary px-6 py-3 rounded-lg active:opacity-80"
        >
          <Text className="text-white font-semibold text-center">Refresh</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

void SplashScreen.preventAutoHideAsync();

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
  const [history, setHistory] = useState<HistoryEntry[] | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [asyncError, setAsyncError] = useState<Error | null>(null);

  useEffect(() => {
    getPromptHistory().then(setHistory).catch(setAsyncError);
  }, [resetKey]);

  useEffect(() => {
    if ((fontsLoaded || fontError) && history !== null) {
      SplashScreen.hideAsync().catch(setAsyncError);
    }
  }, [fontsLoaded, fontError, history]);

  // Rethrow async errors so ErrorBoundary catches them
  if (asyncError) {
    throw asyncError;
  }
  if (fontError) {
    throw fontError;
  }

  // Wait for fonts AND history
  if (!fontsLoaded || history === null) {
    return null;
  }

  const handleReset = () => {
    Alert.alert("Reset", "Clear all data?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          clearAllData()
            .then(() => {
              setHistory(null);
              setResetKey((k) => k + 1);
            })
            .catch(setAsyncError);
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

interface AppShellProps {
  onReset: () => void;
}

function AppShell({ onReset }: AppShellProps): React.ReactElement {
  const pathname = usePathname();
  const [history] = usePromptStorage();

  const isHome = pathname === "/";
  const hasHistory = history.length >= 2;

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <SafeAreaView style={{ flex: 1 }}>
        <Header>
          <Header.Left>
            {!isHome && <Link href="back" label="Back" icon="chevron-back" />}
            {isHome && __DEV__ && <DevResetButton onPress={onReset} />}
          </Header.Left>
          <Header.Center>
            {!isHome && <Text variant="page-title">History</Text>}
          </Header.Center>
          <Header.Right>
            {isHome && hasHistory && (
              <Link href="/history" label="History" icon="time-outline" />
            )}
          </Header.Right>
        </Header>
        <View className="flex-1 w-full">
          <Slot />
        </View>
      </SafeAreaView>
    </View>
  );
}
