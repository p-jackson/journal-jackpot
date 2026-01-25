# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
  components/
    ui/             # reusable primitives (header, text, link)
    slot-machine/   # feature components (reel, spin-button, etc.)
    prompt-history/ # timeline list
  contexts/         # PromptStorageContext (history state)
  hooks/            # useSlotMachine (spin logic, daily limits)
  storage/          # AsyncStorage abstraction
  data/             # reel word data
  types.ts          # shared types
```

### Styling

NativeWind v5 + Tailwind v4. Theme vars in `global.css`.

- Use `className` with theme tokens (not hardcoded Tailwind defaults)
- Styles live in UI components, not screens
- `style` prop only for dynamic/animated values

### State

- Context: `PromptStorageContext` for history + save
- Storage: AsyncStorage via `src/storage/prompt-storage.ts`
- One spin per day (unlimited in __DEV__)

## Standards

### TypeScript

- Kebab-case filenames (`slot-machine.tsx`, not `SlotMachine.tsx`)
- Named exports only
- `interface` for objects, `type` for unions
- String unions over enums

### Components

- Explicit Props types
- CVA for variants (`src/components/ui/text.tsx`)
- Compound pattern for complex UI (`Header.Left`, `Header.Center`, `Header.Right`)

### Testing

- Colocated: `foo.tsx` → `foo.test.tsx` (no `__tests__/`)
- Integration tests use `expo-router/testing-library` with `renderRouter()`
- Mocks in `__mocks__/` and `jest.setup.ts`
