// Unmock expo-router for integration tests
jest.unmock('expo-router');

import { renderRouter, screen, fireEvent, waitFor } from 'expo-router/testing-library';
import Home from './index';
import History from './history';
import RootLayout from './_layout';

describe('Navigation', () => {
  it('navigates from home to history and back', async () => {
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
    expect(screen.getByText('History')).toBeTruthy();

    // Tap History link
    fireEvent.press(screen.getByText('History'));

    // Now on history screen
    await waitFor(() => {
      expect(screen.getByText(/history coming soon/i)).toBeTruthy();
    });
    expect(screen.getByText('Back')).toBeTruthy();

    // Tap Back
    fireEvent.press(screen.getByText('Back'));

    // Back on home
    await waitFor(() => {
      expect(screen.getByText('Journal Jackpot')).toBeTruthy();
    });
  });
});
