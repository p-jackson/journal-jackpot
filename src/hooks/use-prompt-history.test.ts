import { renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePromptHistory } from './use-prompt-history';
import { STORAGE_KEYS } from '../storage/prompt-storage';
import type { SavedPrompt } from '../types';

describe('usePromptHistory', () => {
	beforeEach(async () => {
		await AsyncStorage.clear();
	});

	it('starts in loading state, then loads', async () => {
		let initialLoading: boolean | undefined;
		const { result } = renderHook(() => {
			const hook = usePromptHistory();
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

	it('returns empty prompts when no history', async () => {
		const { result } = renderHook(() => usePromptHistory());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.prompts).toEqual([]);
		expect(result.current.journeyStartDate).toBeNull();
	});

	it('returns prompts when history exists', async () => {
		const prompt1: SavedPrompt = {
			text: 'a b c',
			createdAt: '2024-01-15T10:00:00.000Z',
		};
		const prompt2: SavedPrompt = {
			text: 'd e f',
			createdAt: '2024-01-16T10:00:00.000Z',
		};
		await AsyncStorage.setItem(
			STORAGE_KEYS.PROMPT_HISTORY,
			JSON.stringify([prompt1, prompt2])
		);

		const { result } = renderHook(() => usePromptHistory());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.prompts).toHaveLength(2);
		// newest first
		expect(result.current.prompts[0].createdAt).toBe(
			'2024-01-16T10:00:00.000Z'
		);
	});

	it('sets journeyStartDate to oldest prompt', async () => {
		const prompt1: SavedPrompt = {
			text: 'a b c',
			createdAt: '2024-01-15T10:00:00.000Z',
		};
		const prompt2: SavedPrompt = {
			text: 'd e f',
			createdAt: '2024-01-16T10:00:00.000Z',
		};
		await AsyncStorage.setItem(
			STORAGE_KEYS.PROMPT_HISTORY,
			JSON.stringify([prompt1, prompt2])
		);

		const { result } = renderHook(() => usePromptHistory());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		// oldest prompt is journey start
		expect(result.current.journeyStartDate).toBe('2024-01-15T10:00:00.000Z');
	});
});
