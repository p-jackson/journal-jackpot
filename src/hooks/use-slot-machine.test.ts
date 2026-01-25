import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSlotMachine } from './use-slot-machine';
import { STORAGE_KEYS } from '../storage/prompt-storage';

describe('useSlotMachine', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  describe('initial state', () => {
    it('starts with loading true, then loads', async () => {
      let initialLoading: boolean | undefined;
      const { result } = renderHook(() => {
        const hook = useSlotMachine();
        if (initialLoading === undefined) {
          initialLoading = hook.loading;
        }
        return hook;
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(initialLoading).toBe(true);
    });

    it('loads canSpin true when no previous spin', async () => {
      const { result } = renderHook(() => useSlotMachine());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.canSpin).toBe(true);
      expect(result.current.todaysPrompt).toBeNull();
    });

    it('allows re-spin when stored prompt is corrupted', async () => {
      const today = new Date();
      await AsyncStorage.setItem(
        STORAGE_KEYS.PROMPT_HISTORY,
        JSON.stringify([{ text: '  ', createdAt: today.toISOString() }])
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_SPIN_DATE,
        today.toISOString()
      );

      const { result } = renderHook(() => useSlotMachine());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.todaysPrompt).toBeNull();
      expect(result.current.canSpin).toBe(true);
    });

    it('loads existing prompt if spun today', async () => {
      const today = new Date();
      // Storage uses SavedPrompt format (text string)
      const savedPrompt = {
        text: 'a b c',
        createdAt: today.toISOString(),
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.PROMPT_HISTORY,
        JSON.stringify([savedPrompt])
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_SPIN_DATE,
        today.toISOString()
      );

      const { result } = renderHook(() => useSlotMachine());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.canSpin).toBe(false);
      // Hook converts SavedPrompt to Prompt (with words array)
      expect(result.current.todaysPrompt).toEqual({
        words: ['a', 'b', 'c'],
        createdAt: savedPrompt.createdAt,
      });
    });
  });

  describe('spin', () => {
    it('generates prompt with 3 random words', async () => {
      const { result } = renderHook(() => useSlotMachine());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.spin();
      });

      expect(result.current.todaysPrompt).not.toBeNull();
      expect(result.current.todaysPrompt!.words).toHaveLength(3);
      result.current.todaysPrompt!.words.forEach((word) => {
        expect(word.length).toBeGreaterThan(0);
      });
    });

    it('persists prompt to storage', async () => {
      const { result } = renderHook(() => useSlotMachine());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.spin();
      });

      const stored = await AsyncStorage.getItem(STORAGE_KEYS.PROMPT_HISTORY);
      const history = JSON.parse(stored!);
      expect(history).toHaveLength(1);
      // Storage format is SavedPrompt (text), runtime is Prompt (words)
      expect(history[0].text).toEqual(result.current.todaysPrompt?.words.join(' '));
    });

    it('sets canSpin to false after spinning', async () => {
      const { result } = renderHook(() => useSlotMachine());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.canSpin).toBe(true);

      await act(async () => {
        await result.current.spin();
      });

      expect(result.current.canSpin).toBe(false);
    });

    it('prevents double spin', async () => {
      const { result } = renderHook(() => useSlotMachine());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.spin();
      });

      const firstPrompt = result.current.todaysPrompt;

      await act(async () => {
        await result.current.spin();
      });

      expect(result.current.todaysPrompt).toEqual(firstPrompt);

      const stored = await AsyncStorage.getItem(STORAGE_KEYS.PROMPT_HISTORY);
      const history = JSON.parse(stored!);
      expect(history).toHaveLength(1);
    });

    it('spinning is false before and after spin', async () => {
      const { result } = renderHook(() => useSlotMachine());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.spinning).toBe(false);

      await act(async () => {
        await result.current.spin();
      });

      expect(result.current.spinning).toBe(false);
    });
  });

  describe('nextSpinAt', () => {
    it('returns null when can spin', async () => {
      const { result } = renderHook(() => useSlotMachine());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.nextSpinAt).toBeNull();
    });

    it('returns next midnight after spinning', async () => {
      const { result } = renderHook(() => useSlotMachine());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.spin();
      });

      expect(result.current.nextSpinAt).not.toBeNull();
      const nextSpin = new Date(result.current.nextSpinAt!);
      expect(nextSpin.getHours()).toBe(0);
      expect(nextSpin.getMinutes()).toBe(0);
      expect(nextSpin.getSeconds()).toBe(0);
    });
  });

  describe('reels data', () => {
    it('exposes reels for rendering', async () => {
      const { result } = renderHook(() => useSlotMachine());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.reels).toHaveLength(3);
      result.current.reels.forEach((reel) => {
        expect(reel.words.length).toBeGreaterThan(0);
      });
    });
  });
});
