# Integration Tests

Use `expo-router/testing-library` with real navigation for user flow tests.

```tsx
jest.unmock('expo-router');
import { renderRouter, screen, fireEvent, waitFor } from 'expo-router/testing-library';

renderRouter(
  { index: Home, history: History, _layout: RootLayout },
  { initialUrl: '/' }
);

fireEvent.press(screen.getByText('History'));
await waitFor(() => expect(screen.getByText('Back')).toBeTruthy());
```

- Test real navigation between screens
- Use `waitFor` for navigation assertions
