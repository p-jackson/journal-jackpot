import { useState, useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import { Text } from "../components/ui/text";
import { useSlotMachine } from "../hooks/use-slot-machine";
import { SlotMachine } from "../components/slot-machine/slot-machine";
import { SpinButton } from "../components/slot-machine/spin-button";
import { Celebration } from "../components/slot-machine/celebration";
import { CountdownTimer } from "../components/slot-machine/countdown-timer";
import { MachineBody } from "../components/slot-machine/machine-body";
import { MachineTopBanner } from "../components/slot-machine/machine-top-banner";
import { MachineLights } from "../components/slot-machine/machine-lights";

export default function Home() {
  const { reels, loading, spinning, canSpin, todaysPrompt, nextSpinAt, spin } =
    useSlotMachine();

  const [showCelebration, setShowCelebration] = useState(false);
  const [reelWords, setReelWords] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [allReelsStopped, setAllReelsStopped] = useState(true);

  const handleSpin = useCallback(() => {
    if (!canSpin || spinning) return;

    setReelWords([null, null, null]);
    setAllReelsStopped(false);
    spin();
  }, [canSpin, spinning, spin]);

  const handleAllReelsStopped = useCallback(() => {
    setAllReelsStopped(true);
    setShowCelebration(true);
  }, []);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

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
              reels={reels}
              spinning={spinning}
              displayWords={displayWords}
              onAllReelsStopped={handleAllReelsStopped}
            />
          </View>

          {/* Bottom panel */}
          <View style={{ alignItems: "center", gap: 12 }}>
            <SpinButton
              onPress={handleSpin}
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
