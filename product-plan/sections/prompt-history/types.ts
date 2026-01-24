// =============================================================================
// Data Types
// =============================================================================

export interface Prompt {
  id: string
  words: [string, string, string]
  createdAt: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface PromptHistoryProps {
  /** List of past prompts, sorted newest first */
  prompts: Prompt[]
}
