import { useState, useEffect } from 'react';
import { hasPromptHistory } from '../storage/prompt-storage';

export function useHasPromptHistory() {
	const [hasHistory, setHasHistory] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		hasPromptHistory().then((result) => {
			setHasHistory(result);
			setLoading(false);
		});
	}, []);

	return { hasHistory, loading };
}
