// =============================================================================
// Core Data Types
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

// =============================================================================
// Application State
// =============================================================================

export interface SlotMachineState {
  canSpin: boolean
  todaysPrompt: Prompt | null
  nextSpinAt: string | null
}
