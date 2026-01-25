import { useState, useEffect } from 'react';
import { getPromptsForHistory } from '../storage/prompt-storage';
import type { SavedPrompt } from '../types';

interface UsePromptHistoryReturn {
	prompts: SavedPrompt[];
	loading: boolean;
	journeyStartDate: string | null;
}

export function usePromptHistory(): UsePromptHistoryReturn {
	const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getPromptsForHistory().then((p) => {
			setPrompts(p);
			setLoading(false);
		});
	}, []);

	const journeyStartDate =
		prompts.length > 0 ? prompts[prompts.length - 1].createdAt : null;

	return { prompts, loading, journeyStartDate };
}
