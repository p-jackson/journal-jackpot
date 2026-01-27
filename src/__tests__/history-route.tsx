import { screen, waitFor } from "expo-router/testing-library";
import { userEvent } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { renderApp } from "../test-utils";
import type { SavedPrompt } from "../types";

const STORAGE_KEY = "journal-jackpot:prompt-history";

describe("History", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("shows content after loading", async () => {
    const prompts: SavedPrompt[] = [
      { text: "d e f", createdAt: "2024-01-14T10:00:00.000Z" },
      { text: "a b c", createdAt: "2024-01-15T10:00:00.000Z" },
    ];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));

    renderApp({ initialUrl: "/history" });

    // Latest prompt (a b c) skipped; older one shown
    await waitFor(() => {
      expect(screen.getByText("d e f")).toBeTruthy();
    });
  });

  it("shows empty state when no history", async () => {
    renderApp({ initialUrl: "/history" });

    await waitFor(() => {
      expect(screen.getByText(/no prompts yet/i)).toBeTruthy();
    });
  });

  it("navigates from home to history and back", async () => {
    const user = userEvent.setup();
    const prompts: SavedPrompt[] = [
      { text: "older prompt too", createdAt: "2024-01-14T10:00:00.000Z" },
      { text: "test prompt here", createdAt: "2024-01-15T10:00:00.000Z" },
    ];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));

    renderApp({ initialUrl: "/" });

    await waitFor(() => {
      expect(screen.getByText("JOURNAL JACKPOT")).toBeTruthy();
    });

    await waitFor(() => {
      expect(screen.getByText("History")).toBeTruthy();
    });

    await user.press(screen.getByText("History"));

    // Latest skipped; older prompt shown
    await waitFor(() => {
      expect(screen.getByText("older prompt too")).toBeTruthy();
    });
    expect(screen.getByText("Back")).toBeTruthy();

    await user.press(screen.getByText("Back"));

    await waitFor(() => {
      expect(screen.getByText("JOURNAL JACKPOT")).toBeTruthy();
    });
  });
});
