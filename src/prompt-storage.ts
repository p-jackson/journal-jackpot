import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseISO } from "date-fns";
import type { HistoryEntry } from "./types";

const STORAGE_KEY = "journal-jackpot:prompt-history";

// Internal type for AsyncStorage - mirrors HistoryEntry but with serialized dates
interface StoredPrompt {
  text: string;
  createdAt: string; // ISO string
}

function serialize(entry: HistoryEntry): StoredPrompt {
  return { ...entry, createdAt: entry.createdAt.toISOString() };
}

function deserialize(stored: StoredPrompt): HistoryEntry {
  return { ...stored, createdAt: parseISO(stored.createdAt) };
}

export async function savePrompt(prompt: HistoryEntry) {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  const history: StoredPrompt[] = stored
    ? (JSON.parse(stored) as StoredPrompt[])
    : [];
  history.push(serialize(prompt));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export async function getPromptHistory(): Promise<HistoryEntry[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [];
  }
  const parsed = JSON.parse(stored) as StoredPrompt[];
  return parsed.map(deserialize);
}

export async function clearAllData() {
  await AsyncStorage.clear();
}
