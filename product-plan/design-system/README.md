# Design System

## Colors

Journal Jackpot uses Tailwind CSS built-in color palettes:

| Role      | Color  | Usage                                    |
|-----------|--------|------------------------------------------|
| Primary   | violet | Buttons, links, active states, accents   |
| Secondary | amber  | Highlights, celebrations, slot machine   |
| Neutral   | zinc   | Text, backgrounds, borders               |

### Color Usage Examples

```html
<!-- Primary actions -->
<button class="bg-violet-600 hover:bg-violet-700 text-white">Spin</button>

<!-- Secondary highlights -->
<div class="bg-amber-400/20 border border-amber-500/30">Celebration</div>

<!-- Neutral backgrounds -->
<div class="bg-zinc-50 dark:bg-zinc-950">Page background</div>

<!-- Text -->
<p class="text-zinc-900 dark:text-zinc-100">Primary text</p>
<p class="text-zinc-500 dark:text-zinc-400">Secondary text</p>
```

## Typography

| Role    | Font           | Usage                          |
|---------|----------------|--------------------------------|
| Heading | Space Grotesk  | Headings, button text, prompts |
| Body    | DM Sans        | Paragraphs, UI text            |
| Mono    | IBM Plex Mono  | Dates, counts, timers          |

### Font Setup

For **Expo/React Native**, load fonts via `expo-font`:

```typescript
import { useFonts } from 'expo-font';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
} from '@expo-google-fonts/ibm-plex-mono';
```

For **web** (HTML `<head>`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Tailwind Configuration

In your CSS (Tailwind v4):

```css
@import "tailwindcss";

@theme {
  --font-heading: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
}
```

### Typography Usage

```html
<h1 class="font-heading font-bold">Journal Jackpot</h1>
<p class="font-body">Get your daily journal prompt</p>
<span class="font-mono text-sm">12h 30m until next spin</span>
```

## Dark Mode

All components support dark mode via Tailwind's `dark:` variant. The app respects system preference by default.

```html
<div class="bg-white dark:bg-zinc-900">
  <p class="text-zinc-900 dark:text-zinc-100">Adapts to system theme</p>
</div>
```
