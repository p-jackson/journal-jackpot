# Milestone 2: Slot Machine

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Implement the Slot Machine feature — the core spinning reels interface and prompt generation.

## Overview

A skeuomorphic slot machine interface where users tap a button to spin. Each reel stops one at a time, building anticipation before a celebratory reveal of the journal prompt.

**Key Functionality:**
- Tap "SPIN" button to spin the reels
- Watch reels stop one by one (staggered animation)
- See celebration animation on full reveal
- View today's generated prompt
- Once per day limit — button disabled with countdown timer after spinning

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/slot-machine/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/slot-machine/components/`:

- `SlotMachine.tsx` — Main slot machine component with cabinet, reels, button
- `Reel.tsx` — Individual spinning reel with word display
- `SpinButton.tsx` — Big spin button with disabled/spinning states

### Data Layer

The components expect these data shapes:

```typescript
interface SlotMachineProps {
  reels: Reel[]           // Three reels with word pools
  state: SlotMachineState // Can spin, today's prompt, next spin time
  onSpin?: () => void     // Called when user taps spin
}

interface SlotMachineState {
  canSpin: boolean
  todaysPrompt: Prompt | null
  nextSpinAt: string | null
}
```

You'll need to:
- Store word pools for each reel (can be seeded/hardcoded initially)
- Track when user last spun (to enforce once-per-day limit)
- Generate random prompt by picking one word from each reel
- Store generated prompts with timestamps

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onSpin` | Called when user taps the SPIN button. Generate a new prompt, save it, and update state to disable further spins until tomorrow. |

### Empty States

The component handles the "ready to spin" state with placeholder text: "Tap SPIN to get today's prompt"

After spinning, the generated prompt displays in the amber-highlighted area.

## Files to Reference

- `product-plan/sections/slot-machine/README.md` — Feature overview and design intent
- `product-plan/sections/slot-machine/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/slot-machine/components/` — React components
- `product-plan/sections/slot-machine/types.ts` — TypeScript interfaces
- `product-plan/sections/slot-machine/sample-data.json` — Word pools and test states

## Expected User Flows

### Flow 1: First-Time Spin

1. User opens the app for the first time
2. User sees slot machine with "Tap SPIN to get today's prompt" message
3. User taps the "SPIN" button
4. Reels spin with blur effect, then stop one by one (staggered ~800ms apart)
5. Celebration animation plays (sparkles, golden glow)
6. **Outcome:** Generated prompt appears (e.g., "favourite childhood sandwich"), button becomes disabled, countdown timer shows

### Flow 2: Return After Spinning Today

1. User returns to app same day after having spun
2. User sees today's prompt displayed
3. SPIN button is disabled (grayed out)
4. Countdown timer shows time until next spin available
5. **Outcome:** User can view their prompt but cannot spin again

### Flow 3: Return Next Day

1. User returns after midnight (new day)
2. User sees slot machine ready to spin (button enabled)
3. Previous day's prompt may still be displayed, or cleared
4. **Outcome:** User can spin again for a new prompt

## Done When

- [ ] Tests written for key user flows
- [ ] All tests pass
- [ ] Slot machine renders with reels and button
- [ ] Spinning animation works with staggered reel stops
- [ ] Celebration effect plays on reveal
- [ ] Prompt is generated and saved
- [ ] Once-per-day limit enforced
- [ ] Countdown timer displays when spin unavailable
- [ ] Matches the visual design (skeuomorphic cabinet)
- [ ] Responsive on mobile
