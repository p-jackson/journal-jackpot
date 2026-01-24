# Journal Jackpot — Export Package

A slot machine-style app that gives you one random journal prompt per day.

## Quick Start

### Option 1: One-Shot Implementation

Use `prompts/one-shot-prompt.md` with a coding agent (Claude, Cursor, etc.) to implement everything at once.

### Option 2: Incremental Implementation

1. Start with `prompts/section-prompt.md`
2. Fill in the section name and work through milestones in `instructions/incremental/`

## Package Contents

```
product-plan/
├── README.md                      # This file
├── product-overview.md            # Product description & features
│
├── prompts/                       # Ready-to-use prompts
│   ├── one-shot-prompt.md         # Full implementation prompt
│   └── section-prompt.md          # Section-by-section template
│
├── instructions/                  # Implementation guides
│   ├── one-shot-instructions.md   # All milestones combined
│   └── incremental/               # Step-by-step guides
│       ├── 01-foundation.md       # Design tokens, routing, shell
│       ├── 02-slot-machine.md     # Slot machine section
│       └── 03-prompt-history.md   # History section
│
├── design-system/                 # Design tokens
│   ├── README.md                  # Setup guide
│   ├── colors.json                # violet/amber/zinc
│   ├── typography.json            # Space Grotesk/DM Sans/IBM Plex Mono
│   └── tokens.css                 # CSS with font imports
│
├── data-model/                    # Core types
│   ├── data-model.md              # Entity descriptions
│   └── types.ts                   # TypeScript interfaces
│
├── shell/                         # App shell
│   ├── README.md                  # Shell documentation
│   └── components/                # Header, AppShell
│
└── sections/
    ├── slot-machine/
    │   ├── README.md              # Section overview
    │   ├── tests.md               # Test specs
    │   ├── types.ts               # Prop interfaces
    │   ├── sample-data.json       # Word pools & states
    │   └── components/            # SlotMachine, Reel, SpinButton
    │
    └── prompt-history/
        ├── README.md              # Section overview
        ├── tests.md               # Test specs
        ├── types.ts               # Prop interfaces
        ├── sample-data.json       # Sample prompts
        └── components/            # PromptHistory
```

## Sections

| Section        | Description                                      |
|----------------|--------------------------------------------------|
| Slot Machine   | Skeuomorphic spinning reels, once-per-day limit  |
| Prompt History | Chronological list of past prompts               |

## Platform

This is a **mobile app** built with:
- **Expo** — React Native framework
- **expo-router** — File-based routing in `app/` directory
- **NativeWind v5** — Tailwind CSS for React Native
- **React Native new architecture** enabled

## Tech Assumptions

The prompts will ask your coding agent to clarify:
- Storage (AsyncStorage, database, etc.)
- Authentication needs (if any)

Components provided are **web-based reference implementations** (React + Tailwind CSS v4). They need adaptation for React Native + NativeWind — see instruction files for component mapping guidance.

## Design Tokens

- **Colors**: violet (primary), amber (secondary), zinc (neutral)
- **Fonts**: Space Grotesk (headings), DM Sans (body), IBM Plex Mono (mono)
- **Dark mode**: All components support `dark:` variants

See `design-system/README.md` for setup instructions.
