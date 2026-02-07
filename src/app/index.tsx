import { useState, useCallback } from "react";
import { View } from "react-native";
import { isSameDay, startOfTomorrow } from "date-fns";
import { Text } from "../components/ui/text";
import { usePromptStorage } from "../prompt-storage-context";
import { getRandomWords } from "../reels-data";
import { SlotMachine } from "../components/slot-machine/slot-machine";
import { SpinButton } from "../components/slot-machine/spin-button";
import { Celebration } from "../components/slot-machine/celebration";
import { CountdownTimer } from "../components/slot-machine/countdown-timer";
import { MachineBody } from "../components/slot-machine/machine-body";
import { MachineTopBanner } from "../components/slot-machine/machine-top-banner";
import { MachineLights } from "../components/slot-machine/machine-lights";

// Enable infinite spins in dev mode (but not tests)
const DEBUG_ALLOW_INFINITE_SPINS = __DEV__ && process.env.NODE_ENV !== "test";

function getTodaysPrompt(history: { text: string; createdAt: Date }[]) {
  const latest = history.at(-1);
  if (!latest || !isSameDay(latest.createdAt, new Date())) {
    return null;
  }

  const parts = latest.text.split(" ");
  if (parts.length !== 3) {
    console.warn(
      `Prompt has ${String(parts.length)} words, expected 3: "${latest.text}"`,
    );
  }
  const words: [string, string, string] = [
    parts[0] ?? "",
    parts[1] ?? "",
    parts[2] ?? "",
  ];
  // Allow respin if data is corrupted
  if (words.some((w) => !w)) {
    return null;
  }
  return { words, createdAt: latest.createdAt };
}

export default function Home() {
  const [history, savePrompt] = usePromptStorage();

  const todaysPrompt = getTodaysPrompt(history);

  const canSpin = !todaysPrompt || DEBUG_ALLOW_INFINITE_SPINS;
  const nextSpinAt = todaysPrompt ? startOfTomorrow() : null;

  const [spinning, setSpinning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [reelWords, setReelWords] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [allReelsStopped, setAllReelsStopped] = useState(true);

  const handleSpinPress = useCallback(() => {
    setReelWords([null, null, null]);
    setAllReelsStopped(false);
    setSpinning(true);

    const words = getRandomWords();

    savePrompt({ text: words.join(" "), createdAt: new Date() });

    // Delay setSpinning(false) so React renders with spinning=true first
    // This allows SlotMachine to latch onto the spinning state
    queueMicrotask(() => {
      setSpinning(false);
    });
  }, [savePrompt]);

  const handleAllReelsStopped = useCallback(() => {
    setAllReelsStopped(true);
    setShowCelebration(true);
  }, []);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
  }, []);

  const displayWords = todaysPrompt?.words ?? reelWords;

  return (
    <View className="flex-1 items-center justify-center px-6 relative">
      <Celebration
        visible={showCelebration}
        onComplete={handleCelebrationComplete}
      />

      <View style={{ position: "relative", alignSelf: "stretch" }}>
        <MachineBody>
          <MachineTopBanner />

          <View style={{ marginBottom: 16 }}>
            <SlotMachine
              spinning={spinning}
              displayWords={displayWords}
              onAllReelsStopped={handleAllReelsStopped}
            />
          </View>

          {/* Bottom panel */}
          <View style={{ alignItems: "center", gap: 12 }}>
            <SpinButton
              onPress={handleSpinPress}
              disabled={!canSpin}
              spinning={spinning || !allReelsStopped}
            />
          </View>
        </MachineBody>

        <MachineLights active />
      </View>

      <View style={{ marginTop: 16, alignItems: "center" }}>
        {!todaysPrompt && allReelsStopped ? (
          <Text variant="muted" className="text-sm text-center">
            Tap SPIN to get today&apos;s prompt
          </Text>
        ) : nextSpinAt && allReelsStopped ? (
          <CountdownTimer targetDate={nextSpinAt} />
        ) : (
          <Text className="text-sm">{"\u00A0"}</Text>
        )}
      </View>
    </View>
  );
}
