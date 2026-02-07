# CLAUDE.md

## Commands

```bash
npm start          # dev server (press i for iOS)
npm run ios        # iOS simulator
npm test           # run all tests
npm test -- path   # run single test file
npm run lint:fix   # eslint with autofix
npm run format     # prettier
```

## Architecture

Expo React Native app (iOS only, portrait). New arch enabled.

**Stack:** expo-router, NativeWind v5 + Tailwind v4, AsyncStorage, react-native-reanimated

### Directory Structure

```
src/
  app/              # expo-router routes (_layout.tsx, index.tsx, history.tsx)
  components/       # ui/, slot-machine/, prompt-history/
  prompt-storage-context.tsx  # history state context
  use-slot-machine.ts         # spin logic, daily limits
  prompt-storage.ts           # AsyncStorage abstraction
  reels-data.ts               # reel word data
  types.ts                    # shared types
```

### Styling

NativeWind v5 + Tailwind v4. Theme vars in `global.css`.

- Use `className` with theme tokens (not hardcoded Tailwind defaults)
- Styles live in UI components, not screens
- `style` prop only for dynamic/animated values

### State

- Context: `PromptStorageContext` for history + save
- Storage: AsyncStorage via `src/prompt-storage.ts`
- One spin per day (unlimited in __DEV__)

## Standards

### TypeScript

- Kebab-case filenames (`slot-machine.tsx`, not `SlotMachine.tsx`)
- Named exports only
- `interface` for objects, `type` for unions
- String unions over enums
- Use explicit braces (`{}`) for control flow, even for single-line bodies
- No `any`, and use `unknown` when a type is truly dynamic

### Components

- Explicit Props types
- CVA for variants (`src/components/ui/text.tsx`)
- Compound pattern for complex UI (`Header.Left`, `Header.Center`, `Header.Right`)

### Testing

- App route tests in root `__tests__/` (Expo Router requirement)
- Component/hook tests in colocated `__tests__/` folders
- Integration tests use `expo-router/testing-library` with `renderRouter()`
- Mocks in `__mocks__/` and `jest.setup.ts`
- Do not do snapshot testing, prefer user-centric assertions using `@testing-library/react-native`
