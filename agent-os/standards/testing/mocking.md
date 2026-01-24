# Test Mocking

Minimal mocks — only mock what breaks tests.

## Global mocks (jest.setup.ts)
Only for Expo infrastructure that doesn't affect test logic:
- `expo-font` — fonts always loaded
- `expo-splash-screen` — no-op
- `@expo/vector-icons` — renders empty View

## Per-test mocks
Use `jest.unmock()` when real implementation needed (e.g., navigation tests).

```tsx
// Integration test needs real router
jest.unmock('expo-router');
```

- Prefer real implementations over mocks
- Don't mock business logic
