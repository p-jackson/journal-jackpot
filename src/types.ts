interface Word {
  id: string;
  text: string;
}

interface Reel {
  id: string;
  position: '1' | '2' | '3';
  words: Word[];
}

interface Prompt {
  id: string;
  words: [string, string, string];
  createdAt: string;
}

interface SlotMachineState {
  canSpin: boolean;
  todaysPrompt: Prompt | null;
  nextSpinAt: string | null;
}

export type { Word, Reel, Prompt, SlotMachineState };
