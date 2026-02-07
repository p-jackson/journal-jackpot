import { createContext, useContext, useState, useCallback } from "react";
import { savePrompt as rawSavePrompt } from "./prompt-storage";
import type { HistoryEntry } from "./types";

interface PromptStorageContextValue {
  history: HistoryEntry[];
  savePrompt: (prompt: HistoryEntry) => void;
}

const PromptStorageContext = createContext<PromptStorageContextValue | null>(
  null,
);

interface Props {
  initialHistory: HistoryEntry[];
  children: React.ReactNode;
}

export function PromptStorageProvider({ initialHistory, children }: Props) {
  const [history, setHistory] = useState(initialHistory);

  const savePrompt = useCallback((prompt: HistoryEntry) => {
    setHistory((prev) => [...prev, prompt]);
    // Fire-and-forget async write
    void rawSavePrompt(prompt);
  }, []);

  return (
    <PromptStorageContext.Provider value={{ history, savePrompt }}>
      {children}
    </PromptStorageContext.Provider>
  );
}

export function usePromptStorage(): [
  HistoryEntry[],
  (prompt: HistoryEntry) => void,
] {
  const ctx = useContext(PromptStorageContext);
  if (!ctx) {
    throw new Error("usePromptStorage requires PromptStorageProvider");
  }
  return [ctx.history, ctx.savePrompt];
}
