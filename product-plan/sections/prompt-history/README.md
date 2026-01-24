# Prompt History Section

A simple, chronological list of all past prompts. Each entry shows the date and the three-word prompt. Newest prompts appear at the top.

## Components

- **PromptHistory** - List view with date formatting and empty state

## Props

```typescript
interface PromptHistoryProps {
  prompts: Prompt[]  // Past prompts, sorted newest first
}
```

## Usage

```tsx
import { PromptHistory } from './components'
import { prompts } from './sample-data.json'

<PromptHistory prompts={prompts} />
```

## Date Formatting

- **Today**: "TODAY"
- **Yesterday**: "YESTERDAY"
- **This week**: "X days ago"
- **Older**: "Jan 15" format

## States

- **With prompts**: Shows list with count header and journey footer
- **Empty**: Centered message encouraging first spin
