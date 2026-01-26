import { useState, useCallback, useMemo } from "react";
import { isSameDay } from "date-fns";
import { usePromptStorage } from "./prompt-storage-context";
import { REELS } from "./reels-data";
import type { Prompt, Reel } from "./types";

// Enable infinite spins in dev mode (but not tests)
const DEBUG_ALLOW_INFINITE_SPINS = __DEV__ && process.env.NODE_ENV !== "test";

interface UseSlotMachineReturn {
  reels: Reel[];
  spinning: boolean;
  canSpin: boolean;
  todaysPrompt: Prompt | null;
  nextSpinAt: string | null;
  spin: () => void;
}

function getRandomWord(reel: Reel): string {
  const idx = Math.floor(Math.random() * reel.words.length);
  return reel.words[idx];
}

function getNextMidnight(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

export function useSlotMachine(): UseSlotMachineReturn {
  const [history, savePrompt] = usePromptStorage();
  const [spinning, setSpinning] = useState(false);

  const todaysPrompt = useMemo(() => {
    const latest = history[history.length - 1] as
      | (typeof history)[number]
      | undefined;
    if (!latest || !isSameDay(new Date(latest.createdAt), new Date()))
      return null;

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
    if (words.some((w) => !w)) return null;
    return { words, createdAt: latest.createdAt };
  }, [history]);

  const canSpin = !todaysPrompt || DEBUG_ALLOW_INFINITE_SPINS;

  const spin = useCallback(() => {
    if (!canSpin || spinning) return;

    setSpinning(true);

    const words: [string, string, string] = [
      getRandomWord(REELS[0]),
      getRandomWord(REELS[1]),
      getRandomWord(REELS[2]),
    ];

    const createdAt = new Date().toISOString();
    savePrompt({ text: words.join(" "), createdAt });

    // Delay setSpinning(false) so React renders with spinning=true first
    // This allows SlotMachine to latch onto the spinning state
    queueMicrotask(() => {
      setSpinning(false);
    });
  }, [canSpin, spinning, savePrompt]);

  const nextSpinAt = todaysPrompt ? getNextMidnight().toISOString() : null;

  return {
    reels: REELS,
    spinning,
    canSpin,
    todaysPrompt,
    nextSpinAt,
    spin,
  };
}
