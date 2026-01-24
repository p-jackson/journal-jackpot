# Milestone 1: Foundation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

---

## Platform Context

This is an **Expo React Native** mobile app. Key differences from web:

### Component Adaptation

Provided components are web reference implementations. Adapt:

| Web | React Native |
|-----|--------------|
| `<div>` | `<View>` |
| `<button>` | `<Pressable>` |
| `<p>`, `<span>`, `<h1>` | `<Text>` |
| `onClick` | `onPress` |

### Styling

- Tailwind classes work via **NativeWind v5** (already configured in project)
- `hover:` states → use press states or remove
- CSS blur → `expo-blur`
- Gradients → `expo-linear-gradient`

### Icons & Fonts

- `lucide-react` → `@expo/vector-icons`
- Google Fonts → load via `expo-font` (not HTML `<head>`)

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

## Goal

Set up the foundational elements: design tokens, data model types, routing structure, and application shell.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

**Colors:**
- Primary: `violet` — buttons, links, key accents
- Secondary: `amber` — highlights, jackpot moments
- Neutral: `zinc` — backgrounds, text, borders

**Typography:**
- Heading: Space Grotesk
- Body: DM Sans
- Mono: IBM Plex Mono

### 2. Data Model Types

Create TypeScript interfaces for your core entities:

- See `product-plan/data-model/types.ts` for interface definitions
- See `product-plan/data-model/README.md` for entity relationships

**Entities:**
- `Prompt` — id, words (3-tuple), createdAt
- `Word` — id, text
- `Reel` — id, position (1|2|3), words array

### 3. Routing Structure

Routes live in the `app/` directory (expo-router file-based routing):

- `app/index.tsx` → `/` — Slot Machine (home/default)
- `app/history.tsx` → `/history` — Prompt History
- `app/_layout.tsx` → Layout wrapper

### 4. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper
- `Header.tsx` — iOS-style navigation header

**Wire Up Navigation:**

The shell uses iOS-style navigation:
- Home screen: "Journal Jackpot" title on left, "History" link on right
- History screen: "← Back" on left, "History" title centered

Connect the `onNavigate` callback to your routing.

**Notes:**
- No user menu/auth UI — keeping the app minimal
- Mobile-first design with max-width container (480px)
- Dark mode support built-in

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/data-model/` — Type definitions
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Design tokens are configured (colors, fonts)
- [ ] Data model types are defined
- [ ] Routes exist for both sections
- [ ] Shell renders with navigation
- [ ] Navigation links to correct routes
- [ ] Responsive on mobile
- [ ] Dark mode works
