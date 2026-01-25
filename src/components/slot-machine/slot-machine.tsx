import { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { Reel } from "./reel";
import { ReelWindow, ReelSeparator } from "./reel-window";
import type { Reel as ReelType } from "../../types";

interface SlotMachineProps {
  reels: ReelType[];
  spinning: boolean;
  displayWords: (string | null)[];
  onAllReelsStopped?: () => void;
}

const STOP_DELAYS = [1000, 1800, 2600];

export function SlotMachine({
  reels,
  spinning,
  displayWords,
  onAllReelsStopped,
}: SlotMachineProps) {
  const [visualSpinning, setVisualSpinning] = useState(false);
  const stoppedCount = useRef(0);

  // Latch on synchronously during render (avoids extra effect cycle)
  if (spinning && !visualSpinning) {
    stoppedCount.current = 0;
    setVisualSpinning(true);
  }

  const handleReelStopped = useCallback(() => {
    stoppedCount.current += 1;
    if (stoppedCount.current === reels.length) {
      setVisualSpinning(false);
      onAllReelsStopped?.();
    }
  }, [reels.length, onAllReelsStopped]);

  return (
    <ReelWindow>
      {reels.map((reel, index) => (
        <View key={reel.position} style={{ flex: 1, flexDirection: "row" }}>
          {index > 0 && <ReelSeparator />}
          <Reel
            reel={reel}
            spinning={visualSpinning}
            stopDelay={STOP_DELAYS[index]}
            selectedWord={displayWords[index]}
            onStopped={handleReelStopped}
          />
        </View>
      ))}
    </ReelWindow>
  );
}
