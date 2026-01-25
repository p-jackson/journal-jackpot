import { createContext, useContext } from 'react';
import { useHasPromptHistory } from '../hooks/use-has-prompt-history';

type HistoryContextValue = {
	hasHistory: boolean;
	refreshHistory: () => void;
};

const HistoryContext = createContext<HistoryContextValue>({
	hasHistory: false,
	refreshHistory: () => {},
});

export function HistoryProvider({ children }: { children: React.ReactNode }) {
	const { hasHistory, refresh } = useHasPromptHistory();

	return (
		<HistoryContext.Provider
			value={{ hasHistory, refreshHistory: refresh }}
		>
			{children}
		</HistoryContext.Provider>
	);
}

export function useHistoryContext() {
	return useContext(HistoryContext);
}
