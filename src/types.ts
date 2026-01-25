interface Reel {
	position: '1' | '2' | '3';
	words: string[];
}

interface Prompt {
	words: [string, string, string];
	createdAt: string;
}

interface SavedPrompt {
	text: string;
	createdAt: string;
}

interface SlotMachineState {
	canSpin: boolean;
	todaysPrompt: Prompt | null;
	nextSpinAt: string | null;
}

export type { Reel, Prompt, SavedPrompt, SlotMachineState };
