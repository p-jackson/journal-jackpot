import { useState, useEffect, useCallback } from 'react';
import { hasPromptHistory } from '../storage/prompt-storage';

export function useHasPromptHistory() {
	const [hasHistory, setHasHistory] = useState(false);
	const [loading, setLoading] = useState(true);

	const refresh = useCallback(() => {
		hasPromptHistory().then((result) => {
			setHasHistory(result);
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	return { hasHistory, loading, refresh };
}
