// Unmock expo-router for integration tests
jest.unmock('expo-router');

// Mock Home to avoid reanimated dependencies in navigation tests
jest.mock('./index', () => {
	const { View, Text } = require('react-native');
	return {
		__esModule: true,
		default: () => (
			<View>
				<Text>Home Placeholder</Text>
			</View>
		),
	};
});

import { renderRouter, screen, fireEvent, waitFor } from 'expo-router/testing-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './index';
import History from './history';
import RootLayout from './_layout';
import { STORAGE_KEYS } from '../storage/prompt-storage';
import type { SavedPrompt } from '../types';

describe('Navigation', () => {
	beforeEach(async () => {
		await AsyncStorage.clear();
	});

	it('navigates from home to history and back', async () => {
		// Add a prompt so History link shows
		const prompt: SavedPrompt = {
			text: 'test prompt here',
			createdAt: '2024-01-15T10:00:00.000Z',
		};
		await AsyncStorage.setItem(
			STORAGE_KEYS.PROMPT_HISTORY,
			JSON.stringify([prompt])
		);

		renderRouter(
			{
				index: Home,
				history: History,
				_layout: RootLayout,
			},
			{ initialUrl: '/' }
		);

		// Home screen shows "Journal Jackpot" title
		expect(screen.getByText('Journal Jackpot')).toBeTruthy();

		// Wait for History link to appear (after async storage check)
		await waitFor(() => {
			expect(screen.getByText('History')).toBeTruthy();
		});

		// Tap History link
		fireEvent.press(screen.getByText('History'));

		// Now on history screen, shows prompt
		await waitFor(() => {
			expect(screen.getByText('test · prompt · here')).toBeTruthy();
		});
		expect(screen.getByText('Back')).toBeTruthy();

		// Tap Back
		fireEvent.press(screen.getByText('Back'));

		// Back on home
		await waitFor(() => {
			expect(screen.getByText('Journal Jackpot')).toBeTruthy();
		});
	});

	it('hides History link when no prompts exist', async () => {
		renderRouter(
			{
				index: Home,
				history: History,
				_layout: RootLayout,
			},
			{ initialUrl: '/' }
		);

		// Wait for async storage check to complete
		await waitFor(() => {
			// Should be able to see home, but no History link
			expect(screen.getByText('Journal Jackpot')).toBeTruthy();
		});

		expect(screen.queryByText('History')).toBeNull();
	});
});
