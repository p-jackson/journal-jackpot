jest.unmock('expo-router');

import { Alert } from 'react-native';
import { renderRouter, screen, fireEvent, waitFor, act } from 'expo-router/testing-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './index';
import History from './history';
import RootLayout from './_layout';
import { STORAGE_KEYS } from '../storage/prompt-storage';
import type { SavedPrompt } from '../types';

function renderHome() {
	return renderRouter(
		{ index: Home, history: History, _layout: RootLayout },
		{ initialUrl: '/' }
	);
}

describe('Home', () => {
	beforeEach(async () => {
		await AsyncStorage.clear();
		jest.restoreAllMocks();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	describe('first spin of the day', () => {
		it('shows enabled spin button for new user', async () => {
			renderHome();

			await waitFor(() => {
				expect(screen.queryByTestId('activity-indicator')).toBeNull();
			});

			const button = screen.getByRole('button');
			expect(button).toBeEnabled();
			expect(screen.getByText('SPIN')).toBeTruthy();
		});

		it('shows placeholder text for new user', async () => {
			renderHome();

			await waitFor(() => {
				expect(screen.getByText("Tap SPIN to get today's prompt")).toBeTruthy();
			});
		});

		it('generates and displays prompt after spin', async () => {
			renderHome();

			await waitFor(() => {
				expect(screen.getByText('SPIN')).toBeTruthy();
			});

			await act(async () => {
				fireEvent.press(screen.getByRole('button'));
			});
			await act(async () => {
				jest.advanceTimersByTime(3000);
			});

			await waitFor(() => {
				expect(screen.getByText(/until next spin/)).toBeTruthy();
			});
		});

		it('disables button after spin', async () => {
			renderHome();

			await waitFor(() => {
				expect(screen.getByText('SPIN')).toBeTruthy();
			});

			await act(async () => {
				fireEvent.press(screen.getByRole('button'));
			});
			await act(async () => {
				jest.advanceTimersByTime(3000);
			});

			await waitFor(() => {
				const button = screen.getByRole('button');
				expect(button.props.accessibilityState?.disabled).toBe(true);
			});
		});

		it('shows countdown timer after spin', async () => {
			renderHome();

			await waitFor(() => {
				expect(screen.getByText('SPIN')).toBeTruthy();
			});

			await act(async () => {
				fireEvent.press(screen.getByRole('button'));
			});
			await act(async () => {
				jest.advanceTimersByTime(3000);
			});

			await waitFor(() => {
				expect(screen.getByText(/until next spin/)).toBeTruthy();
			});
		});
	});

	describe('already spun today', () => {
		it('shows todays prompt on load', async () => {
			const today = new Date();
			const prompt: SavedPrompt = {
				text: 'favourite childhood sandwich',
				createdAt: today.toISOString(),
			};
			await AsyncStorage.setItem(
				STORAGE_KEYS.PROMPT_HISTORY,
				JSON.stringify([prompt])
			);
			await AsyncStorage.setItem(
				STORAGE_KEYS.LAST_SPIN_DATE,
				today.toISOString()
			);

			renderHome();

			await waitFor(() => {
				expect(screen.getByText('favourite')).toBeTruthy();
				expect(screen.getByText('childhood')).toBeTruthy();
				expect(screen.getByText('sandwich')).toBeTruthy();
			});
		});

		it('shows disabled button', async () => {
			const today = new Date();
			const prompt: SavedPrompt = {
				text: 'first morning adventure',
				createdAt: today.toISOString(),
			};
			await AsyncStorage.setItem(
				STORAGE_KEYS.PROMPT_HISTORY,
				JSON.stringify([prompt])
			);
			await AsyncStorage.setItem(
				STORAGE_KEYS.LAST_SPIN_DATE,
				today.toISOString()
			);

			renderHome();

			await waitFor(() => {
				const button = screen.getByRole('button');
				expect(button.props.accessibilityState?.disabled).toBe(true);
			});
		});

		it('shows countdown timer', async () => {
			const today = new Date();
			const prompt: SavedPrompt = {
				text: 'last summer meal',
				createdAt: today.toISOString(),
			};
			await AsyncStorage.setItem(
				STORAGE_KEYS.PROMPT_HISTORY,
				JSON.stringify([prompt])
			);
			await AsyncStorage.setItem(
				STORAGE_KEYS.LAST_SPIN_DATE,
				today.toISOString()
			);

			renderHome();

			await waitFor(() => {
				expect(screen.getByText(/until next spin/)).toBeTruthy();
			});
		});
	});

	describe('corrupted prompt recovery', () => {
		it('allows re-spin when stored prompt has empty words', async () => {
			const today = new Date();
			await AsyncStorage.setItem(
				STORAGE_KEYS.PROMPT_HISTORY,
				JSON.stringify([{ text: '  ', createdAt: today.toISOString() }])
			);
			await AsyncStorage.setItem(
				STORAGE_KEYS.LAST_SPIN_DATE,
				today.toISOString()
			);

			renderHome();

			await waitFor(() => {
				expect(screen.getByText("Tap SPIN to get today's prompt")).toBeTruthy();
			});

			const button = screen.getByRole('button');
			expect(button).toBeEnabled();

			await act(async () => {
				fireEvent.press(button);
			});
			await act(async () => {
				jest.advanceTimersByTime(3000);
			});

			await waitFor(() => {
				expect(screen.getByText(/until next spin/)).toBeTruthy();
			});
		});
	});

	describe('rapid tap prevention', () => {
		it('prevents multiple spins', async () => {
			renderHome();

			await waitFor(() => {
				expect(screen.getByText('SPIN')).toBeTruthy();
			});

			const button = screen.getByRole('button');

			// First spin
			await act(async () => {
				fireEvent.press(button);
			});
			await act(async () => {
				jest.advanceTimersByTime(3000);
			});

			// Button should now be disabled after spin completes
			await waitFor(() => {
				const btn = screen.getByRole('button');
				expect(btn.props.accessibilityState?.disabled).toBe(true);
			});

			// Attempting more presses should not add more prompts
			await act(async () => {
				fireEvent.press(button);
				fireEvent.press(button);
				jest.advanceTimersByTime(1000);
			});

			// Should only have one prompt saved
			const stored = await AsyncStorage.getItem(STORAGE_KEYS.PROMPT_HISTORY);
			const history = JSON.parse(stored!);
			expect(history).toHaveLength(1);
		});
	});

	describe('navigation', () => {
		it('hides History link when no prompts exist', async () => {
			renderHome();

			await waitFor(() => {
				expect(screen.getByText('JOURNAL JACKPOT')).toBeTruthy();
			});

			expect(screen.queryByText('History')).toBeNull();
		});

		it('hides History link after first spin (only 1 prompt)', async () => {
			renderHome();

			await waitFor(() => {
				expect(screen.getByText('SPIN')).toBeTruthy();
			});

			expect(screen.queryByText('History')).toBeNull();

			await act(async () => {
				fireEvent.press(screen.getByRole('button'));
			});
			await act(async () => {
				jest.advanceTimersByTime(3000);
			});

			// Still no history link — need 2+ prompts
			expect(screen.queryByText('History')).toBeNull();
		});
	});

	describe('reset', () => {
		it('shows reset button on home screen', async () => {
			renderHome();

			await waitFor(() => {
				expect(screen.getByText('Reset')).toBeTruthy();
			});
		});

		it('clears data and refreshes UI on reset', async () => {
			const prompts: SavedPrompt[] = [
				{ text: 'older prompt too', createdAt: '2024-01-14T10:00:00.000Z' },
				{ text: 'test prompt here', createdAt: '2024-01-15T10:00:00.000Z' },
			];
			await AsyncStorage.setItem(
				STORAGE_KEYS.PROMPT_HISTORY,
				JSON.stringify(prompts)
			);

			// Auto-confirm the alert
			jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
				const destructive = buttons?.find((b) => b.style === 'destructive');
				destructive?.onPress?.();
			});

			renderHome();

			// History link visible before reset
			await waitFor(() => {
				expect(screen.getByText('History')).toBeTruthy();
			});

			fireEvent.press(screen.getByText('Reset'));

			// After reset, History link should disappear
			await waitFor(() => {
				expect(screen.queryByText('History')).toBeNull();
			});

			// Storage should be empty
			const stored = await AsyncStorage.getItem(STORAGE_KEYS.PROMPT_HISTORY);
			expect(stored).toBeNull();
		});
	});
});
