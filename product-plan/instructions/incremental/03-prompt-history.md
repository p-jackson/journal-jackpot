# Milestone 3: Prompt History

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) and Milestone 2 (Slot Machine) complete

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

Implement the Prompt History feature — a simple list of all past prompts.

## Overview

A simple, chronological list of all past prompts. Each entry shows the date and the three-word prompt. Newest prompts appear at the top.

**Key Functionality:**
- View all past prompts in a scrollable list
- See relative dates (Today, Yesterday, 3 days ago, etc.)
- Newest prompts at top
- View-only — no actions on individual items

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/prompt-history/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/prompt-history/components/`:

- `PromptHistory.tsx` — List of past prompts with empty state

### Data Layer

The component expects this data shape:

```typescript
interface PromptHistoryProps {
  prompts: Prompt[]  // Sorted newest first
}

interface Prompt {
  id: string
  words: [string, string, string]
  createdAt: string  // ISO date string
}
```

You'll need to:
- Fetch all prompts from the database
- Sort by createdAt descending (newest first)
- Pass to component

### Callbacks

None — this is a view-only section.

### Empty States

The component includes an empty state for first-time users:
- Shows "📝 No prompts yet" heading
- Message: "Spin the slot machine to get your first journal prompt!"

Make sure to pass an empty array `[]` when no prompts exist rather than not rendering the component.

## Files to Reference

- `product-plan/sections/prompt-history/README.md` — Feature overview and design intent
- `product-plan/sections/prompt-history/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/prompt-history/components/` — React components
- `product-plan/sections/prompt-history/types.ts` — TypeScript interfaces
- `product-plan/sections/prompt-history/sample-data.json` — Test data

## Expected User Flows

### Flow 1: View Prompt History

1. User taps "History" link in header
2. User navigates to history screen
3. User sees list of past prompts with dates
4. **Outcome:** All prompts displayed, newest at top, with relative dates

### Flow 2: Empty History (New User)

1. New user taps "History" before ever spinning
2. User sees empty state message
3. **Outcome:** Helpful message encouraging them to spin first

### Flow 3: Navigate Back

1. User is on history screen
2. User taps "← Back" button
3. **Outcome:** Returns to slot machine screen

## Done When

- [ ] Tests written for key user flows
- [ ] All tests pass
- [ ] History screen displays list of prompts
- [ ] Prompts sorted newest first
- [ ] Dates show as relative (Today, Yesterday, etc.)
- [ ] Empty state displays for new users
- [ ] Navigation back to slot machine works
- [ ] Matches the visual design (clean, minimal list)
- [ ] Responsive on mobile
