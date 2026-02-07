import AsyncStorage from "@react-native-async-storage/async-storage";
import { savePrompt, getPromptHistory, clearAllData } from "../prompt-storage";
import type { HistoryEntry } from "../types";

const STORAGE_KEY = "journal-jackpot:prompt-history";

describe("promptStorage", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  describe("savePrompt", () => {
    it("saves prompt to history (serialized as ISO string)", async () => {
      const prompt: HistoryEntry = {
        text: "word1 word2 word3",
        createdAt: new Date("2024-01-15T10:00:00Z"),
      };

      await savePrompt(prompt);

      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      expect(JSON.parse(stored!)).toEqual([
        { text: "word1 word2 word3", createdAt: "2024-01-15T10:00:00.000Z" },
      ]);
    });

    it("appends to existing history", async () => {
      const prompt1: HistoryEntry = {
        text: "a b c",
        createdAt: new Date("2024-01-15T10:00:00Z"),
      };
      const prompt2: HistoryEntry = {
        text: "d e f",
        createdAt: new Date("2024-01-16T10:00:00Z"),
      };

      await savePrompt(prompt1);
      await savePrompt(prompt2);

      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      expect(JSON.parse(stored!)).toEqual([
        { text: "a b c", createdAt: "2024-01-15T10:00:00.000Z" },
        { text: "d e f", createdAt: "2024-01-16T10:00:00.000Z" },
      ]);
    });
  });

  describe("getPromptHistory", () => {
    it("returns empty array when no history", async () => {
      const history = await getPromptHistory();
      expect(history).toEqual([]);
    });

    it("returns saved prompts (deserialized as Date)", async () => {
      const storedPrompt = {
        text: "x y z",
        createdAt: "2024-01-15T10:00:00.000Z",
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([storedPrompt]));

      const history = await getPromptHistory();
      expect(history).toEqual([
        { text: "x y z", createdAt: new Date("2024-01-15T10:00:00Z") },
      ]);
    });
  });

  describe("clearAllData", () => {
    it("clears all stored data", async () => {
      const prompt: HistoryEntry = {
        text: "a b c",
        createdAt: new Date("2024-01-15T10:00:00Z"),
      };
      await savePrompt(prompt);

      await clearAllData();

      const history = await getPromptHistory();
      expect(history).toEqual([]);
    });
  });
});
