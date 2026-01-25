import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SavedPrompt } from "../types";

const STORAGE_KEY = "journal-jackpot:prompt-history";

export async function savePrompt(prompt: SavedPrompt) {
  const history = await getPromptHistory();
  history.push(prompt);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export async function getPromptHistory(): Promise<SavedPrompt[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  return JSON.parse(stored) as SavedPrompt[];
}

export async function clearAllData() {
  await AsyncStorage.clear();
}
