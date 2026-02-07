import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Center } from "../components/ui/center";
import { VStack } from "../components/ui/stack";
import { Text } from "../components/ui/text";
import type { ErrorBoundaryProps } from "expo-router";
import { Slot, usePathname, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Header } from "../components/ui/header";
import { TextButton } from "../components/ui/text-button";
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
    <Center className="flex-1 bg-surface dark:bg-surface-dark">
      <SafeAreaView style={{ flex: 1 }}>
        <Center className="flex-1">
          <VStack align="center">
            <Text variant="page-title">Something went wrong</Text>
            <Text className="font-mono">{error.message}</Text>
            <TextButton icon="reload" onPress={() => void retry()}>
              Reload
            </TextButton>
          </VStack>
        </Center>
      </SafeAreaView>
    </Center>
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

  const handleClearState = () => {
    Alert.alert(
      "Clear local state",
      "Are you sure you want to clear all local prompt history? [dev only]",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
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
      ],
    );
  };

  return (
    <PromptStorageProvider key={resetKey} initialHistory={history}>
      <AppShell onClearState={handleClearState} />
    </PromptStorageProvider>
  );
}

interface AppShellProps {
  onClearState: () => void;
}

function AppShell({ onClearState }: AppShellProps): React.ReactElement {
  const pathname = usePathname();
  const router = useRouter();
  const [history] = usePromptStorage();

  const isHome = pathname === "/";
  const isHistory = pathname === "/history";
  const hasHistory = history.length >= 2;

  return (
    <VStack className="flex-1 bg-surface dark:bg-surface-dark">
      <SafeAreaView style={{ flex: 1 }}>
        <Header>
          <Header.Left>
            {isHistory && (
              <TextButton
                icon="chevron-back"
                onPress={() => {
                  router.back();
                }}
              >
                Back
              </TextButton>
            )}
            {isHome && __DEV__ && (
              <TextButton icon="trash" variant="scary" onPress={onClearState}>
                Clear
              </TextButton>
            )}
          </Header.Left>
          <Header.Center>
            {
              isHome && (
                <Text variant="page-title">&nbsp;</Text>
              ) /* Ensure the vertical size stays the same */
            }
            {isHistory && <Text variant="page-title">History</Text>}
          </Header.Center>
          <Header.Right>
            {isHome && hasHistory && (
              <TextButton
                icon="time-outline"
                onPress={() => {
                  router.push("/history");
                }}
              >
                History
              </TextButton>
            )}
          </Header.Right>
        </Header>
        <VStack className="flex-1">
          <Slot />
        </VStack>
      </SafeAreaView>
    </VStack>
  );
}
