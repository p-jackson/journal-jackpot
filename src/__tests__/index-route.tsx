import { Alert } from "react-native";
import { screen, waitFor, act } from "expo-router/testing-library";
import { userEvent } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { renderApp } from "../test-utils";
import type { SavedPrompt } from "../types";

const STORAGE_KEY = "journal-jackpot:prompt-history";

describe("Home", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
  });

  describe("first spin of the day", () => {
    it("shows enabled spin button for new user", async () => {
      renderApp({ initialUrl: "/" });

      await waitFor(() => {
        expect(screen.getByText("SPIN")).toBeTruthy();
      });

      const button = screen.getByRole("button");
      expect(button).toBeEnabled();
    });

    it("shows placeholder text for new user", async () => {
      renderApp({ initialUrl: "/" });

      await waitFor(() => {
        expect(screen.getByText("Tap SPIN to get today's prompt")).toBeTruthy();
      });
    });

    it("generates and displays prompt after spin", async () => {
      const user = userEvent.setup();
      jest.useFakeTimers();
      renderApp({ initialUrl: "/" });

      await waitFor(() => {
        expect(screen.getByText("SPIN")).toBeTruthy();
      });

      await user.press(screen.getByRole("button"));
      await act(() => jest.advanceTimersByTimeAsync(3000));

      await waitFor(() => {
        expect(screen.getByText(/until next spin/)).toBeTruthy();
      });
      jest.useRealTimers();
    });

    it("disables button after spin", async () => {
      const user = userEvent.setup();
      jest.useFakeTimers();
      renderApp({ initialUrl: "/" });

      await waitFor(() => {
        expect(screen.getByText("SPIN")).toBeTruthy();
      });

      await user.press(screen.getByRole("button"));
      await act(() => jest.advanceTimersByTimeAsync(3000));

      await waitFor(() => {
        const button = screen.getByRole("button");
        expect(button.props.accessibilityState?.disabled).toBe(true);
      });
      jest.useRealTimers();
    });

    it("shows countdown timer after spin", async () => {
      const user = userEvent.setup();
      jest.useFakeTimers();
      renderApp({ initialUrl: "/" });

      await waitFor(() => {
        expect(screen.getByText("SPIN")).toBeTruthy();
      });

      await user.press(screen.getByRole("button"));
      await act(() => jest.advanceTimersByTimeAsync(3000));

      await waitFor(() => {
        expect(screen.getByText(/until next spin/)).toBeTruthy();
      });
      jest.useRealTimers();
    });
  });

  describe("already spun today", () => {
    it("shows todays prompt on load", async () => {
      const today = new Date();
      const prompt: SavedPrompt = {
        text: "favourite childhood sandwich",
        createdAt: today.toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([prompt]));

      renderApp({ initialUrl: "/" });

      await waitFor(() => {
        expect(screen.getByText("favourite")).toBeTruthy();
        expect(screen.getByText("childhood")).toBeTruthy();
        expect(screen.getByText("sandwich")).toBeTruthy();
      });
    });

    it("shows disabled button", async () => {
      const today = new Date();
      const prompt: SavedPrompt = {
        text: "first morning adventure",
        createdAt: today.toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([prompt]));

      renderApp({ initialUrl: "/" });

      await waitFor(() => {
        const button = screen.getByRole("button");
        expect(button.props.accessibilityState?.disabled).toBe(true);
      });
    });

    it("shows countdown timer", async () => {
      const today = new Date();
      const prompt: SavedPrompt = {
        text: "last summer meal",
        createdAt: today.toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([prompt]));

      renderApp({ initialUrl: "/" });

      await waitFor(() => {
        expect(screen.getByText(/until next spin/)).toBeTruthy();
      });
    });
  });

  describe("corrupted prompt recovery", () => {
    it("allows re-spin when stored prompt has empty words", async () => {
      const user = userEvent.setup();
      jest.useFakeTimers();
      const today = new Date();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([{ text: "  ", createdAt: today.toISOString() }]),
      );

      renderApp({ initialUrl: "/" });

      await waitFor(() => {
        expect(screen.getByText("Tap SPIN to get today's prompt")).toBeTruthy();
      });

      const button = screen.getByRole("button");
      expect(button).toBeEnabled();

      await user.press(button);
      await act(() => jest.advanceTimersByTimeAsync(3000));

      await waitFor(() => {
        expect(screen.getByText(/until next spin/)).toBeTruthy();
      });
      jest.useRealTimers();
    });
  });

  describe("rapid tap prevention", () => {
    it("prevents multiple spins", async () => {
      const user = userEvent.setup();
      jest.useFakeTimers();
      renderApp({ initialUrl: "/" });

      await waitFor(() => {
        expect(screen.getByText("SPIN")).toBeTruthy();
      });

      const button = screen.getByRole("button");

      // First spin
      await user.press(button);
      await act(() => jest.advanceTimersByTimeAsync(3000));

      // Button should now be disabled after spin completes
      await waitFor(() => {
        const btn = screen.getByRole("button");
        expect(btn.props.accessibilityState?.disabled).toBe(true);
      });

      // Attempting more presses should not add more prompts
      await user.press(button);
      await user.press(button);
      await act(() => jest.advanceTimersByTimeAsync(1010));

      // Should only have one prompt saved
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const history = JSON.parse(stored!);
      expect(history).toHaveLength(1);
      jest.useRealTimers();
    });
  });

  describe("navigation", () => {
    it("hides History link when no prompts exist", async () => {
      renderApp({ initialUrl: "/" });

      await waitFor(() => {
        expect(screen.getByText("JOURNAL JACKPOT")).toBeTruthy();
      });

      expect(screen.queryByText("History")).toBeNull();
    });

    it("hides History link after first spin (only 1 prompt)", async () => {
      const user = userEvent.setup();
      jest.useFakeTimers();
      renderApp({ initialUrl: "/" });

      await waitFor(() => {
        expect(screen.getByText("SPIN")).toBeTruthy();
      });

      expect(screen.queryByText("History")).toBeNull();

      await user.press(screen.getByRole("button"));
      await act(() => jest.advanceTimersByTimeAsync(3000));

      // Still no history link — need 2+ prompts
      expect(screen.queryByText("History")).toBeNull();
      jest.useRealTimers();
    });
  });

  describe("reset", () => {
    it("shows reset button on home screen", async () => {
      renderApp({ initialUrl: "/" });

      await waitFor(() => {
        expect(screen.getByText("Reset")).toBeTruthy();
      });
    });

    it("clears data and refreshes UI on reset", async () => {
      const prompts: SavedPrompt[] = [
        { text: "older prompt too", createdAt: "2024-01-14T10:00:00.000Z" },
        { text: "test prompt here", createdAt: "2024-01-15T10:00:00.000Z" },
      ];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));

      // Auto-confirm the alert
      jest
        .spyOn(Alert, "alert")
        .mockImplementation((_title, _message, buttons) => {
          const destructive = buttons?.find((b) => b.style === "destructive");
          destructive?.onPress?.();
        });

      renderApp({ initialUrl: "/" });

      const user = userEvent.setup();

      // History link visible before reset
      await waitFor(() => {
        expect(screen.getByText("History")).toBeTruthy();
      });

      await user.press(screen.getByText("Reset"));

      // After reset, History link should disappear
      await waitFor(() => {
        expect(screen.queryByText("History")).toBeNull();
      });

      // Storage should be empty
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      expect(stored).toBeNull();
    });
  });
});
