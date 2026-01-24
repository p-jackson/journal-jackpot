import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './index';
import { STORAGE_KEYS } from '../storage/prompt-storage';
import type { SavedPrompt } from '../types';

describe('Home', () => {
	beforeEach(async () => {
		await AsyncStorage.clear();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	describe('first spin of the day', () => {
		it('shows enabled spin button for new user', async () => {
			render(<Home />);

			await waitFor(() => {
				expect(screen.queryByTestId('activity-indicator')).toBeNull();
			});

			const button = screen.getByRole('button');
			expect(button).toBeEnabled();
			expect(screen.getByText('SPIN')).toBeTruthy();
		});

		it('shows placeholder text for new user', async () => {
			render(<Home />);

			await waitFor(() => {
				expect(screen.getByText("Tap SPIN to get today's prompt")).toBeTruthy();
			});
		});

		it('generates and displays prompt after spin', async () => {
			render(<Home />);

			await waitFor(() => {
				expect(screen.getByText('SPIN')).toBeTruthy();
			});

			await act(async () => {
				fireEvent.press(screen.getByRole('button'));
				jest.advanceTimersByTime(3000);
			});

			await waitFor(() => {
				expect(screen.getByText("Today's prompt")).toBeTruthy();
			});
		});

		it('disables button after spin', async () => {
			render(<Home />);

			await waitFor(() => {
				expect(screen.getByText('SPIN')).toBeTruthy();
			});

			await act(async () => {
				fireEvent.press(screen.getByRole('button'));
				jest.advanceTimersByTime(3000);
			});

			await waitFor(() => {
				const button = screen.getByRole('button');
				expect(button.props.accessibilityState?.disabled).toBe(true);
			});
		});

		it('shows countdown timer after spin', async () => {
			render(<Home />);

			await waitFor(() => {
				expect(screen.getByText('SPIN')).toBeTruthy();
			});

			await act(async () => {
				fireEvent.press(screen.getByRole('button'));
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

			render(<Home />);

			await waitFor(() => {
				expect(screen.getByText('“favourite childhood sandwich”')).toBeTruthy();
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

			render(<Home />);

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

			render(<Home />);

			await waitFor(() => {
				expect(screen.getByText(/until next spin/)).toBeTruthy();
			});
		});
	});

	describe('rapid tap prevention', () => {
		it('prevents multiple spins', async () => {
			render(<Home />);

			await waitFor(() => {
				expect(screen.getByText('SPIN')).toBeTruthy();
			});

			const button = screen.getByRole('button');

			// First spin
			await act(async () => {
				fireEvent.press(button);
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
});
