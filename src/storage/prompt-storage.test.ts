import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  savePrompt,
  getPromptHistory,
  getPromptsForHistory,
  hasPromptHistory,
  getTodaysPrompt,
  getLastSpinDate,
  setLastSpinDate,
  canSpinToday,
  clearAllData,
  STORAGE_KEYS,
} from './prompt-storage';
import type { SavedPrompt } from '../types';

describe('promptStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  describe('savePrompt', () => {
    it('saves prompt to history', async () => {
      const prompt: SavedPrompt = {
        text: 'word1 word2 word3',
        createdAt: '2024-01-15T10:00:00.000Z',
      };

      await savePrompt(prompt);

      const stored = await AsyncStorage.getItem(STORAGE_KEYS.PROMPT_HISTORY);
      expect(JSON.parse(stored!)).toEqual([prompt]);
    });

    it('appends to existing history', async () => {
      const prompt1: SavedPrompt = {
        text: 'a b c',
        createdAt: '2024-01-15T10:00:00.000Z',
      };
      const prompt2: SavedPrompt = {
        text: 'd e f',
        createdAt: '2024-01-16T10:00:00.000Z',
      };

      await savePrompt(prompt1);
      await savePrompt(prompt2);

      const stored = await AsyncStorage.getItem(STORAGE_KEYS.PROMPT_HISTORY);
      expect(JSON.parse(stored!)).toEqual([prompt1, prompt2]);
    });
  });

  describe('getPromptHistory', () => {
    it('returns empty array when no history', async () => {
      const history = await getPromptHistory();
      expect(history).toEqual([]);
    });

    it('returns saved prompts', async () => {
      const prompt: SavedPrompt = {
        text: 'x y z',
        createdAt: '2024-01-15T10:00:00.000Z',
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.PROMPT_HISTORY,
        JSON.stringify([prompt])
      );

      const history = await getPromptHistory();
      expect(history).toEqual([prompt]);
    });
  });

  describe('getLastSpinDate / setLastSpinDate', () => {
    it('returns null when no spin recorded', async () => {
      const date = await getLastSpinDate();
      expect(date).toBeNull();
    });

    it('saves and retrieves last spin date', async () => {
      const testDate = new Date('2024-01-15T10:00:00.000Z');
      await setLastSpinDate(testDate);

      const retrieved = await getLastSpinDate();
      expect(retrieved?.toISOString()).toBe(testDate.toISOString());
    });
  });

  describe('getTodaysPrompt', () => {
    it('returns null when no prompts exist', async () => {
      const prompt = await getTodaysPrompt();
      expect(prompt).toBeNull();
    });

    it('returns null when last prompt was from different day', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const prompt: SavedPrompt = {
        text: 'a b c',
        createdAt: yesterday.toISOString(),
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.PROMPT_HISTORY,
        JSON.stringify([prompt])
      );

      const result = await getTodaysPrompt();
      expect(result).toBeNull();
    });

    it('returns prompt when created today', async () => {
      const today = new Date();
      const saved: SavedPrompt = {
        text: 'a b c',
        createdAt: today.toISOString(),
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.PROMPT_HISTORY,
        JSON.stringify([saved])
      );

      const result = await getTodaysPrompt();
      expect(result).toEqual({
        words: ['a', 'b', 'c'],
        createdAt: saved.createdAt,
      });
    });
  });

  describe('canSpinToday', () => {
    it('returns true when never spun', async () => {
      const result = await canSpinToday();
      expect(result).toBe(true);
    });

    it('returns false when spun today', async () => {
      await setLastSpinDate(new Date());
      const result = await canSpinToday();
      expect(result).toBe(false);
    });

    it('returns true when last spin was yesterday', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      await setLastSpinDate(yesterday);

      const result = await canSpinToday();
      expect(result).toBe(true);
    });

    it('returns true after local midnight', async () => {
      // Spin at 11:59 PM yesterday
      const lastNight = new Date();
      lastNight.setDate(lastNight.getDate() - 1);
      lastNight.setHours(23, 59, 0, 0);
      await setLastSpinDate(lastNight);

      const result = await canSpinToday();
      expect(result).toBe(true);
    });
  });

  describe('getPromptsForHistory', () => {
    it('returns empty array when no history', async () => {
      const prompts = await getPromptsForHistory();
      expect(prompts).toEqual([]);
    });

    it('returns prompts sorted newest first', async () => {
      const prompt1: SavedPrompt = {
        text: 'a b c',
        createdAt: '2024-01-15T10:00:00.000Z',
      };
      const prompt2: SavedPrompt = {
        text: 'd e f',
        createdAt: '2024-01-16T10:00:00.000Z',
      };
      const prompt3: SavedPrompt = {
        text: 'g h i',
        createdAt: '2024-01-17T10:00:00.000Z',
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.PROMPT_HISTORY,
        JSON.stringify([prompt1, prompt2, prompt3])
      );

      const prompts = await getPromptsForHistory();
      expect(prompts[0].createdAt).toBe('2024-01-17T10:00:00.000Z');
      expect(prompts[1].createdAt).toBe('2024-01-16T10:00:00.000Z');
      expect(prompts[2].createdAt).toBe('2024-01-15T10:00:00.000Z');
    });

    it('converts SavedPrompt to Prompt', async () => {
      const saved: SavedPrompt = {
        text: 'word1 word2 word3',
        createdAt: '2024-01-15T10:00:00.000Z',
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.PROMPT_HISTORY,
        JSON.stringify([saved])
      );

      const prompts = await getPromptsForHistory();
      expect(prompts).toEqual([
        {
          words: ['word1', 'word2', 'word3'],
          createdAt: '2024-01-15T10:00:00.000Z',
        },
      ]);
    });
  });

  describe('clearAllData', () => {
    it('clears all stored data', async () => {
      const prompt: SavedPrompt = {
        text: 'a b c',
        createdAt: '2024-01-15T10:00:00.000Z',
      };
      await savePrompt(prompt);
      await setLastSpinDate(new Date('2024-01-15T10:00:00.000Z'));

      await clearAllData();

      const history = await getPromptHistory();
      expect(history).toEqual([]);
      const lastSpin = await getLastSpinDate();
      expect(lastSpin).toBeNull();
    });
  });

  describe('hasPromptHistory', () => {
    it('returns false when no history', async () => {
      const result = await hasPromptHistory();
      expect(result).toBe(false);
    });

    it('returns true when history exists', async () => {
      const prompt: SavedPrompt = {
        text: 'a b c',
        createdAt: '2024-01-15T10:00:00.000Z',
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.PROMPT_HISTORY,
        JSON.stringify([prompt])
      );

      const result = await hasPromptHistory();
      expect(result).toBe(true);
    });
  });
});
