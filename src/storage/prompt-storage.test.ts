import AsyncStorage from "@react-native-async-storage/async-storage";
import { savePrompt, getPromptHistory, clearAllData } from "./prompt-storage";
import type { SavedPrompt } from "../types";

const STORAGE_KEY = "journal-jackpot:prompt-history";

describe("promptStorage", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  describe("savePrompt", () => {
    it("saves prompt to history", async () => {
      const prompt: SavedPrompt = {
        text: "word1 word2 word3",
        createdAt: "2024-01-15T10:00:00.000Z",
      };

      await savePrompt(prompt);

      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      expect(JSON.parse(stored!)).toEqual([prompt]);
    });

    it("appends to existing history", async () => {
      const prompt1: SavedPrompt = {
        text: "a b c",
        createdAt: "2024-01-15T10:00:00.000Z",
      };
      const prompt2: SavedPrompt = {
        text: "d e f",
        createdAt: "2024-01-16T10:00:00.000Z",
      };

      await savePrompt(prompt1);
      await savePrompt(prompt2);

      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      expect(JSON.parse(stored!)).toEqual([prompt1, prompt2]);
    });
  });

  describe("getPromptHistory", () => {
    it("returns empty array when no history", async () => {
      const history = await getPromptHistory();
      expect(history).toEqual([]);
    });

    it("returns saved prompts", async () => {
      const prompt: SavedPrompt = {
        text: "x y z",
        createdAt: "2024-01-15T10:00:00.000Z",
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([prompt]));

      const history = await getPromptHistory();
      expect(history).toEqual([prompt]);
    });
  });

  describe("clearAllData", () => {
    it("clears all stored data", async () => {
      const prompt: SavedPrompt = {
        text: "a b c",
        createdAt: "2024-01-15T10:00:00.000Z",
      };
      await savePrompt(prompt);

      await clearAllData();

      const history = await getPromptHistory();
      expect(history).toEqual([]);
    });
  });
});
