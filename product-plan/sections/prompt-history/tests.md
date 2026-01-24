# Prompt History Tests

## User Flows

### View History with Prompts
1. User navigates to History from slot machine
2. Header shows "X prompts" count
3. Prompts displayed in cards, newest first
4. Each card shows: relative date (uppercase) and three-word prompt
5. Footer shows when journal journey started
6. User can scroll through full list

### Navigate Back
1. User taps back button in header
2. Returns to slot machine screen
3. State preserved (if already spun, shows today's prompt)

## Empty States

### New User (No History)
1. User navigates to History before ever spinning
2. Centered empty state with icon (📝)
3. Heading: "No prompts yet"
4. Subtext: "Spin the slot machine to get your first journal prompt!"
5. No count header or footer shown

## Date Display

### Today's Prompt
- Shows "TODAY" in violet uppercase

### Yesterday's Prompt
- Shows "YESTERDAY" in violet uppercase

### This Week's Prompts
- Shows "2 DAYS AGO", "3 DAYS AGO", etc.

### Older Prompts
- Shows "Jan 15" format for 7+ days ago
- Hover/title shows full date ("Monday, January 15")

## Edge Cases

### Single Prompt
- Count shows "1 prompt" (singular)
- Footer journey text still appears

### Many Prompts (100+)
- List scrolls smoothly
- No pagination (simple scroll)
- Performance remains acceptable

### Long Prompt Words
- Cards accommodate multi-word items ("most embarrassing")
- Text wraps appropriately on small screens

## Component Behavior

### Card Hover State
- Border subtly darkens on hover
- Provides feedback that cards are interactive zones (even if view-only)

### Connector Lines
- Subtle vertical lines between cards
- Creates visual timeline effect
- No line after last card

## Accessibility

- Proper `<time>` elements with datetime attributes
- Title attributes show full date on hover
- List uses semantic `<article>` elements
- Empty state is clear and actionable
