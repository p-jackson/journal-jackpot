import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSlotMachine } from './use-slot-machine';
import { PromptStorageProvider } from '../contexts/prompt-storage-context';
import type { SavedPrompt } from '../types';

const STORAGE_KEY = 'journal-jackpot:prompt-history';

function wrapper(initialHistory: SavedPrompt[] = []) {
	return function Wrapper({ children }: { children: React.ReactNode }) {
		return (
			<PromptStorageProvider initialHistory={initialHistory}>
				{children}
			</PromptStorageProvider>
		);
	};
}

describe('useSlotMachine', () => {
	beforeEach(async () => {
		await AsyncStorage.clear();
	});

	describe('initial state', () => {
		it('loading is always false (loaded before mount)', () => {
			const { result } = renderHook(() => useSlotMachine(), {
				wrapper: wrapper([]),
			});

			expect(result.current.loading).toBe(false);
		});

		it('canSpin true when no previous spin', () => {
			const { result } = renderHook(() => useSlotMachine(), {
				wrapper: wrapper([]),
			});

			expect(result.current.canSpin).toBe(true);
			expect(result.current.todaysPrompt).toBeNull();
		});

		it('allows re-spin when stored prompt is corrupted', () => {
			const today = new Date();
			const history: SavedPrompt[] = [
				{ text: '  ', createdAt: today.toISOString() },
			];

			const { result } = renderHook(() => useSlotMachine(), {
				wrapper: wrapper(history),
			});

			expect(result.current.todaysPrompt).toBeNull();
			expect(result.current.canSpin).toBe(true);
		});

		it('loads existing prompt if spun today', () => {
			const today = new Date();
			const savedPrompt: SavedPrompt = {
				text: 'a b c',
				createdAt: today.toISOString(),
			};

			const { result } = renderHook(() => useSlotMachine(), {
				wrapper: wrapper([savedPrompt]),
			});

			expect(result.current.canSpin).toBe(false);
			expect(result.current.todaysPrompt).toEqual({
				words: ['a', 'b', 'c'],
				createdAt: savedPrompt.createdAt,
			});
		});
	});

	describe('spin', () => {
		it('generates prompt with 3 random words', async () => {
			const { result } = renderHook(() => useSlotMachine(), {
				wrapper: wrapper([]),
			});

			await act(async () => {
				result.current.spin();
			});

			expect(result.current.todaysPrompt).not.toBeNull();
			expect(result.current.todaysPrompt!.words).toHaveLength(3);
			result.current.todaysPrompt!.words.forEach((word) => {
				expect(word.length).toBeGreaterThan(0);
			});
		});

		it('persists prompt to storage', async () => {
			const { result } = renderHook(() => useSlotMachine(), {
				wrapper: wrapper([]),
			});

			await act(async () => {
				result.current.spin();
			});

			// Wait for async storage write
			await new Promise((r) => setTimeout(r, 10));

			const stored = await AsyncStorage.getItem(STORAGE_KEY);
			const history = JSON.parse(stored!);
			expect(history).toHaveLength(1);
			expect(history[0].text).toEqual(
				result.current.todaysPrompt?.words.join(' ')
			);
		});

		it('sets canSpin to false after spinning', async () => {
			const { result } = renderHook(() => useSlotMachine(), {
				wrapper: wrapper([]),
			});

			expect(result.current.canSpin).toBe(true);

			await act(async () => {
				result.current.spin();
			});

			expect(result.current.canSpin).toBe(false);
		});

		it('prevents double spin', async () => {
			const { result } = renderHook(() => useSlotMachine(), {
				wrapper: wrapper([]),
			});

			await act(async () => {
				result.current.spin();
			});

			const firstPrompt = result.current.todaysPrompt;

			await act(async () => {
				result.current.spin();
			});

			expect(result.current.todaysPrompt).toEqual(firstPrompt);

			// Wait for async storage write
			await new Promise((r) => setTimeout(r, 10));

			const stored = await AsyncStorage.getItem(STORAGE_KEY);
			const history = JSON.parse(stored!);
			expect(history).toHaveLength(1);
		});

		it('spinning is false before and after spin', async () => {
			const { result } = renderHook(() => useSlotMachine(), {
				wrapper: wrapper([]),
			});

			expect(result.current.spinning).toBe(false);

			await act(async () => {
				result.current.spin();
				// Flush microtasks (queueMicrotask resets spinning)
				await Promise.resolve();
			});

			expect(result.current.spinning).toBe(false);
		});
	});

	describe('nextSpinAt', () => {
		it('returns null when can spin', () => {
			const { result } = renderHook(() => useSlotMachine(), {
				wrapper: wrapper([]),
			});

			expect(result.current.nextSpinAt).toBeNull();
		});

		it('returns next midnight after spinning', async () => {
			const { result } = renderHook(() => useSlotMachine(), {
				wrapper: wrapper([]),
			});

			await act(async () => {
				result.current.spin();
			});

			expect(result.current.nextSpinAt).not.toBeNull();
			const nextSpin = new Date(result.current.nextSpinAt!);
			expect(nextSpin.getHours()).toBe(0);
			expect(nextSpin.getMinutes()).toBe(0);
			expect(nextSpin.getSeconds()).toBe(0);
		});
	});

	describe('reels data', () => {
		it('exposes reels for rendering', () => {
			const { result } = renderHook(() => useSlotMachine(), {
				wrapper: wrapper([]),
			});

			expect(result.current.reels).toHaveLength(3);
			result.current.reels.forEach((reel) => {
				expect(reel.words.length).toBeGreaterThan(0);
			});
		});
	});
});
