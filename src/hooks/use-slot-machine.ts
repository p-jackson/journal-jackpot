import { useState, useEffect, useCallback } from 'react';
import {
  savePrompt,
  getTodaysPrompt,
  canSpinToday,
  setLastSpinDate,
} from '../storage/prompt-storage';
import { REELS } from '../data/reels';
import type { Prompt, Reel } from '../types';

// Enable infinite spins in dev mode (but not tests)
const DEBUG_ALLOW_INFINITE_SPINS = __DEV__ && process.env.NODE_ENV !== 'test';

interface UseSlotMachineReturn {
  reels: Reel[];
  loading: boolean;
  spinning: boolean;
  canSpin: boolean;
  todaysPrompt: Prompt | null;
  nextSpinAt: string | null;
  spin: () => Promise<void>;
}

function getRandomWord(reel: Reel): string {
  const idx = Math.floor(Math.random() * reel.words.length);
  return reel.words[idx].text;
}

function getNextMidnight(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

export function useSlotMachine(): UseSlotMachineReturn {
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(false);
  const [todaysPrompt, setTodaysPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    async function loadState() {
      const [canSpinResult, existingPrompt] = await Promise.all([
        canSpinToday(),
        getTodaysPrompt(),
      ]);

      setCanSpin(canSpinResult);
      setTodaysPrompt(existingPrompt);
      setLoading(false);
    }

    loadState();
  }, []);

  const spin = useCallback(async () => {
    if ((!canSpin && !DEBUG_ALLOW_INFINITE_SPINS) || spinning) return;

    setSpinning(true);

    try {
      const words: [string, string, string] = [
        getRandomWord(REELS[0]),
        getRandomWord(REELS[1]),
        getRandomWord(REELS[2]),
      ];

      const prompt: Prompt = {
        words,
        createdAt: new Date().toISOString(),
      };

      await savePrompt({ text: words.join(' '), createdAt: prompt.createdAt });
      await setLastSpinDate(new Date());

      setTodaysPrompt(prompt);
      setCanSpin(false);
    } finally {
      setSpinning(false);
    }
  }, [canSpin, spinning]);

  const nextSpinAt = canSpin ? null : getNextMidnight().toISOString();

  return {
    reels: REELS,
    loading,
    spinning,
    canSpin: canSpin || DEBUG_ALLOW_INFINITE_SPINS,
    todaysPrompt,
    nextSpinAt,
    spin,
  };
}
