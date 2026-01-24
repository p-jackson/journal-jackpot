# Slot Machine Section

A skeuomorphic slot machine interface where users tap a button to spin. Each reel stops one at a time, building anticipation before a celebratory reveal of the journal prompt.

## Components

- **SlotMachine** - Main container with cabinet, reels, and spin button
- **Reel** - Individual spinning column with blur/slowdown animation
- **SpinButton** - Skeuomorphic button with disabled/spinning states

## Props

```typescript
interface SlotMachineProps {
  reels: Reel[]                    // Three reels with word pools
  state: SlotMachineState          // canSpin, todaysPrompt, nextSpinAt
  onSpin?: () => void              // Called when user taps spin
}
```

## Usage

```tsx
import { SlotMachine } from './components'
import { reels, states } from './sample-data.json'

<SlotMachine
  reels={reels}
  state={states.readyToSpin}
  onSpin={() => handleSpin()}
/>
```

## States

- **Ready to spin**: Button enabled, no prompt shown
- **Spinning**: Button disabled, reels animate
- **Already spun**: Button disabled, today's prompt shown, countdown timer displayed
