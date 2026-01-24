# Journal Jackpot — Product Overview

## Summary

A slot machine-style app that gives you one random journal prompt per day. Pull the lever, watch the reels spin, and discover what to write about today.

**Problems Solved:**
- **Blank page paralysis** — Random prompts remove the "what should I write about?" friction
- **Journaling feels like a chore** — Slot machine mechanic makes it playful and surprising
- **Prompts elsewhere feel stale** — Combinatorial word reels create unexpected, delightful prompts like "favourite childhood sandwich"

## Planned Sections

1. **Slot Machine** — The core spinning reels interface and prompt generation
2. **Prompt History** — View past prompts you've received

## Data Model

**Entities:**
- **Prompt** — A generated journal prompt combining words from each reel, along with when it was received
- **Word** — An individual word that belongs to a specific reel position (1, 2, or 3)
- **Reel** — One of the three spinning columns (Reel 1, Reel 2, Reel 3), each containing its own pool of words

**Relationships:**
- Reel has many Words
- Prompt is composed of one Word from each Reel (3 words total)

## Design System

**Colors:**
- Primary: `violet` — Buttons, links, key accents
- Secondary: `amber` — Tags, highlights, jackpot moments
- Neutral: `zinc` — Backgrounds, text, borders

**Typography:**
- Heading: Space Grotesk
- Body: DM Sans
- Mono: IBM Plex Mono

## Implementation Sequence

Build this product in milestones:

1. **Foundation** — Set up design tokens, data model types, routing, and application shell
2. **Slot Machine** — The core spinning reels interface and prompt generation
3. **Prompt History** — View past prompts you've received

Each milestone has a dedicated instruction document in `product-plan/instructions/`.
