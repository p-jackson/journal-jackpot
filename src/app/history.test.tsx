jest.unmock('expo-router');

import { renderRouter, screen, fireEvent, waitFor } from 'expo-router/testing-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './index';
import History from './history';
import RootLayout from './_layout';
import { STORAGE_KEYS } from '../storage/prompt-storage';
import type { SavedPrompt } from '../types';

function renderHistory() {
	return renderRouter(
		{ index: Home, history: History, _layout: RootLayout },
		{ initialUrl: '/history' }
	);
}

describe('History', () => {
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

		renderHistory();

		expect(screen.getByTestId('activity-indicator')).toBeTruthy();

		await waitFor(() => {
			expect(screen.getByText('a · b · c')).toBeTruthy();
		});
	});

	it('shows empty state when no history', async () => {
		renderHistory();

		await waitFor(() => {
			expect(screen.getByText(/no prompts yet/i)).toBeTruthy();
		});
	});

	it('navigates from home to history and back', async () => {
		const prompt: SavedPrompt = {
			text: 'test prompt here',
			createdAt: '2024-01-15T10:00:00.000Z',
		};
		await AsyncStorage.setItem(
			STORAGE_KEYS.PROMPT_HISTORY,
			JSON.stringify([prompt])
		);

		renderRouter(
			{ index: Home, history: History, _layout: RootLayout },
			{ initialUrl: '/' }
		);

		expect(screen.getByText('Journal Jackpot')).toBeTruthy();

		await waitFor(() => {
			expect(screen.getByText('History')).toBeTruthy();
		});

		fireEvent.press(screen.getByText('History'));

		await waitFor(() => {
			expect(screen.getByText('test · prompt · here')).toBeTruthy();
		});
		expect(screen.getByText('Back')).toBeTruthy();

		fireEvent.press(screen.getByText('Back'));

		await waitFor(() => {
			expect(screen.getByText('Journal Jackpot')).toBeTruthy();
		});
	});
});
