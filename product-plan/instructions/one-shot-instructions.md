# Journal Jackpot — Complete Implementation Instructions

---

## Platform Context

This is an **Expo React Native** mobile app with:
- **expo-router** — File-based routing (`app/` directory)
- **NativeWind v5** — Tailwind classes work on RN components
- **React Native new architecture** enabled

### Component Adaptation

Provided components are **web reference implementations**. Adapt for React Native:

| Web | React Native |
|-----|--------------|
| `<div>` | `<View>` |
| `<button>` | `<Pressable>` or `<TouchableOpacity>` |
| `<p>`, `<span>`, `<h1>` | `<Text>` |
| `<header>`, `<main>`, `<article>` | `<View>` |
| `onClick` | `onPress` |

### Styling Notes

- Tailwind classes work via NativeWind v5
- `hover:` states → use press states or remove
- CSS blur → `expo-blur`
- Complex shadows → RN shadow props
- Gradients → `expo-linear-gradient`

### Icons & Fonts

- `lucide-react` → `@expo/vector-icons` or `react-native-vector-icons`
- Google Fonts → load via `expo-font`

### Animations

- CSS animations → React Native Animated API or `react-native-reanimated`

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

## Test-Driven Development

Each section includes a `tests.md` file with test-writing instructions. For best results:

1. Read `product-plan/sections/[section-id]/tests.md` before implementing
2. Write failing tests based on the instructions
3. Implement the feature to make tests pass
4. Refactor while keeping tests green

The test instructions are **framework-agnostic** — they describe WHAT to test, not HOW. Adapt to your testing setup (Jest, Vitest, Playwright, Cypress, RSpec, Minitest, PHPUnit, etc.).

---

## Product Overview

A slot machine-style app that gives you one random journal prompt per day. Pull the lever, watch the reels spin, and discover what to write about today.

**Problems Solved:**
- Blank page paralysis — Random prompts remove the "what should I write about?" friction
- Journaling feels like a chore — Slot machine mechanic makes it playful and surprising
- Prompts elsewhere feel stale — Combinatorial word reels create unexpected, delightful prompts

**Sections:**
1. Slot Machine — The core spinning reels interface
2. Prompt History — View past prompts

**Data Model:**
- Prompt — id, words (3-tuple), createdAt
- Word — id, text
- Reel — id, position (1|2|3), words array

---

# Milestone 1: Foundation

## Goal

Set up the foundational elements: design tokens, data model types, routing structure, and application shell.

## What to Implement

### 1. Design Tokens

**Colors:**
- Primary: `violet` — buttons, links, key accents
- Secondary: `amber` — highlights, jackpot moments
- Neutral: `zinc` — backgrounds, text, borders

**Typography:**
- Heading: Space Grotesk
- Body: DM Sans
- Mono: IBM Plex Mono

See `product-plan/design-system/` for full configuration.

### 2. Data Model Types

See `product-plan/data-model/types.ts` for interface definitions.

### 3. Routing Structure

- `/` — Slot Machine (home/default)
- `/history` — Prompt History

### 4. Application Shell

Copy shell components from `product-plan/shell/components/`:
- `AppShell.tsx` — Main layout wrapper
- `Header.tsx` — iOS-style navigation header

The shell uses iOS-style navigation:
- Home screen: "Journal Jackpot" title on left, "History" link on right
- History screen: "← Back" on left, "History" title centered

## Done When

- [ ] Design tokens configured
- [ ] Data model types defined
- [ ] Routes exist for both sections
- [ ] Shell renders with navigation
- [ ] Dark mode works

---

# Milestone 2: Slot Machine

## Goal

Implement the core spinning reels interface and prompt generation.

## Overview

A skeuomorphic slot machine interface where users tap a button to spin. Each reel stops one at a time, building anticipation before a celebratory reveal of the journal prompt.

**Key Functionality:**
- Tap "SPIN" button to spin the reels
- Watch reels stop one by one (staggered animation)
- See celebration animation on full reveal
- Once per day limit with countdown timer

## Components

Copy from `product-plan/sections/slot-machine/components/`:
- `SlotMachine.tsx` — Main component
- `Reel.tsx` — Spinning reel
- `SpinButton.tsx` — Big spin button

## Data Layer

```typescript
interface SlotMachineProps {
  reels: Reel[]
  state: SlotMachineState
  onSpin?: () => void
}
```

You'll need to:
- Store word pools for each reel
- Track when user last spun
- Generate random prompt by picking one word from each reel
- Store generated prompts

## User Flows

1. **First-Time Spin:** User taps SPIN → reels spin and stop staggered → celebration → prompt displays
2. **Return Same Day:** Button disabled, countdown shows, today's prompt visible
3. **Return Next Day:** Button enabled, can spin again

See `product-plan/sections/slot-machine/tests.md` for detailed test instructions.

## Done When

- [ ] Slot machine renders with skeuomorphic design
- [ ] Spinning animation with staggered stops
- [ ] Celebration effect on reveal
- [ ] Once-per-day limit enforced
- [ ] Countdown timer when unavailable

---

# Milestone 3: Prompt History

## Goal

Implement a simple list of all past prompts.

## Overview

A clean, chronological list of past prompts. Each entry shows the date and prompt text. Newest first.

**Key Functionality:**
- View all past prompts
- See relative dates (Today, Yesterday, etc.)
- View-only (no actions)

## Components

Copy from `product-plan/sections/prompt-history/components/`:
- `PromptHistory.tsx` — List with empty state

## Data Layer

```typescript
interface PromptHistoryProps {
  prompts: Prompt[]  // Sorted newest first
}
```

## User Flows

1. **View History:** Tap "History" → see list of past prompts with dates
2. **Empty History:** New user sees "No prompts yet" message
3. **Navigate Back:** Tap "← Back" → return to slot machine

See `product-plan/sections/prompt-history/tests.md` for detailed test instructions.

## Done When

- [ ] History displays list of prompts
- [ ] Sorted newest first
- [ ] Relative dates displayed
- [ ] Empty state for new users
- [ ] Navigation works
