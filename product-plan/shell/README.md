# Application Shell

## Overview

A minimal, mobile-first shell with iOS-style navigation. The slot machine experience dominates — the shell stays out of the way.

## Navigation Structure

- **Slot Machine screen:** Title "Journal Jackpot" on left, "History" link on right
- **History screen:** "← Back" on left, "History" title centered

## Layout Pattern

Minimal header with iOS-style navigation patterns:
- Back button appears on the left when navigating away from home
- Title indicates current screen
- Single action link on the right when applicable

## Components Provided

| Component | Description |
|-----------|-------------|
| `AppShell` | Main layout wrapper with header and content area |
| `Header` | iOS-style navigation header |

## Props

### AppShell

```typescript
interface AppShellProps {
  children: React.ReactNode
  currentScreen: 'slot-machine' | 'history'
  onNavigate?: (screen: 'slot-machine' | 'history') => void
}
```

### Header

```typescript
interface HeaderProps {
  currentScreen: 'slot-machine' | 'history'
  onNavigate?: (screen: 'slot-machine' | 'history') => void
}
```

## Usage

```tsx
import { AppShell } from './components/AppShell'

function App() {
  const [screen, setScreen] = useState<'slot-machine' | 'history'>('slot-machine')

  return (
    <AppShell currentScreen={screen} onNavigate={setScreen}>
      {screen === 'slot-machine' ? <SlotMachine /> : <PromptHistory />}
    </AppShell>
  )
}
```

## Design Notes

- Mobile-first design
- Max-width container (480px) to maintain app-like feel on desktop
- No sidebar, no bottom tabs — just a simple header
- Dark mode support built-in
- No user menu/auth UI — keeping the app minimal
