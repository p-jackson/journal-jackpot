import { useState, useEffect } from 'react';
import { getPromptsForHistory } from '../storage/prompt-storage';
import type { Prompt } from '../types';

interface UsePromptHistoryReturn {
	prompts: Prompt[];
	loading: boolean;
	journeyStartDate: string | null;
}

export function usePromptHistory(): UsePromptHistoryReturn {
	const [prompts, setPrompts] = useState<Prompt[]>([]);
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
