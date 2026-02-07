export interface Reel {
  position: "1" | "2" | "3";
  words: string[];
}

export interface Prompt {
  words: [string, string, string];
  createdAt: Date;
}

export interface HistoryEntry {
  text: string;
  createdAt: Date;
}

export interface SlotMachineState {
  canSpin: boolean;
  todaysPrompt: Prompt | null;
  nextSpinAt: Date | null;
}
