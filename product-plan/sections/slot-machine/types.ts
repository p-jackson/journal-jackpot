// =============================================================================
// Data Types
// =============================================================================

export interface Word {
  id: string
  text: string
}

export interface Reel {
  id: string
  position: 1 | 2 | 3
  words: Word[]
}

export interface Prompt {
  id: string
  words: [string, string, string]
  createdAt: string
}

export interface SlotMachineState {
  canSpin: boolean
  todaysPrompt: Prompt | null
  nextSpinAt: string | null
}

// =============================================================================
// Component Props
// =============================================================================

export interface SlotMachineProps {
  /** The three reels with their word pools */
  reels: Reel[]
  /** Current state: can spin, today's prompt, next spin time */
  state: SlotMachineState
  /** Called when user taps the spin button */
  onSpin?: () => void
}
