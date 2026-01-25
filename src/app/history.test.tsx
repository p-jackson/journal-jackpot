import { render, screen, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import History from './history';
import { STORAGE_KEYS } from '../storage/prompt-storage';
import type { SavedPrompt } from '../types';

describe('History route', () => {
	beforeEach(async () => {
		await AsyncStorage.clear();
	});

	it('shows loading then content', async () => {
		const prompt: SavedPrompt = {
			text: 'a b c',
			createdAt: '2024-01-15T10:00:00.000Z',
		};
		await AsyncStorage.setItem(
			STORAGE_KEYS.PROMPT_HISTORY,
			JSON.stringify([prompt])
		);

		render(<History />);

		// Initially loading
		expect(screen.getByTestId('activity-indicator')).toBeTruthy();

		// Then content
		await waitFor(() => {
			expect(screen.getByText('a · b · c')).toBeTruthy();
		});
	});

	it('shows empty state when no history', async () => {
		render(<History />);

		await waitFor(() => {
			expect(screen.getByText(/no prompts yet/i)).toBeTruthy();
		});
	});
});
