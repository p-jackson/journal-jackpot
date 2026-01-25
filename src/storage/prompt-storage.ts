import AsyncStorage from '@react-native-async-storage/async-storage';
import { isSameDay } from 'date-fns';
import type { Prompt, SavedPrompt } from '../types';

export const STORAGE_KEYS = {
	PROMPT_HISTORY: 'journal-jackpot:prompt-history',
	LAST_SPIN_DATE: 'journal-jackpot:last-spin-date',
} as const;

export async function savePrompt(prompt: SavedPrompt) {
	const history = await getPromptHistory();
	history.push(prompt);
	await AsyncStorage.setItem(
		STORAGE_KEYS.PROMPT_HISTORY,
		JSON.stringify(history)
	);
}

export async function getPromptHistory(): Promise<SavedPrompt[]> {
	const stored = await AsyncStorage.getItem(STORAGE_KEYS.PROMPT_HISTORY);
	if (!stored) return [];
	return JSON.parse(stored);
}

export async function getTodaysPrompt() {
	const history = await getPromptHistory();
	if (history.length === 0) return null;

	const latest = history[history.length - 1];
	const latestDate = new Date(latest.createdAt);
	const today = new Date();

	if (isSameDay(latestDate, today)) {
		const parts = latest.text.split(' ');
		if (parts.length !== 3) {
			console.warn(`Prompt has ${parts.length} words, expected 3: "${latest.text}"`);
		}
		const words: [string, string, string] = [
			parts[0] ?? '',
			parts[1] ?? '',
			parts[2] ?? '',
		];
		return { words, createdAt: latest.createdAt };
	}
	return null;
}

export async function getLastSpinDate() {
	const stored = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SPIN_DATE);
	if (!stored) return null;
	return new Date(stored);
}

export async function setLastSpinDate(date: Date) {
	await AsyncStorage.setItem(STORAGE_KEYS.LAST_SPIN_DATE, date.toISOString());
}

export async function canSpinToday() {
	const lastSpin = await getLastSpinDate();
	if (!lastSpin) return true;

	const today = new Date();
	return !isSameDay(lastSpin, today);
}

export async function getPromptsForHistory(): Promise<Prompt[]> {
	const history = await getPromptHistory();
	return history
		.map((saved) => {
			const parts = saved.text.split(' ');
			const words: [string, string, string] = [
				parts[0] ?? '',
				parts[1] ?? '',
				parts[2] ?? '',
			];
			return {
				words,
				createdAt: saved.createdAt,
			};
		})
		.reverse();
}

export async function hasPromptHistory(): Promise<boolean> {
	const history = await getPromptHistory();
	return history.length > 0;
}

export async function clearAllData() {
	await AsyncStorage.clear();
}
