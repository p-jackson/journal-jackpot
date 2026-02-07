import { screen, waitFor } from "expo-router/testing-library";
import { userEvent } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, subDays } from "date-fns";
import { renderApp } from "../test-utils";

const STORAGE_KEY = "journal-jackpot:prompt-history";

describe("History", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("shows content after loading", async () => {
    const prompts = [
      { text: "g h i", createdAt: "2024-01-13T10:00:00.000Z" },
      { text: "d e f", createdAt: "2024-01-14T10:00:00.000Z" },
      { text: "a b c", createdAt: "2024-01-15T10:00:00.000Z" },
    ];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));

    renderApp({ initialUrl: "/history" });

    // Latest prompt (a b c) skipped; older ones shown
    await waitFor(() => {
      expect(screen.getByText("d e f")).toBeTruthy();
      expect(screen.getByText("g h i")).toBeTruthy();
    });
  });

  it("navigates from home to history and back", async () => {
    const user = userEvent.setup();
    const prompts = [
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

  describe("date formatting", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      const now = new Date();
      now.setHours(12, 0, 0, 0);
      jest.setSystemTime(now);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    // Storage order: oldest first. Route reverses then skips newest.
    function makePrompts(createdAt: Date) {
      return [
        { text: "a b c", createdAt: createdAt.toISOString() },
        { text: "x y z", createdAt: new Date().toISOString() },
      ];
    }

    it('formats today as "Today"', async () => {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(makePrompts(new Date())),
      );
      renderApp({ initialUrl: "/history" });

      await waitFor(() => {
        expect(screen.getByText("Today")).toBeTruthy();
      });
    });

    it('formats yesterday as "Yesterday"', async () => {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(makePrompts(subDays(new Date(), 1))),
      );
      renderApp({ initialUrl: "/history" });

      await waitFor(() => {
        expect(screen.getByText("Yesterday")).toBeTruthy();
      });
    });

    it('formats 3 days ago as "3 days ago"', async () => {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(makePrompts(subDays(new Date(), 3))),
      );
      renderApp({ initialUrl: "/history" });

      await waitFor(() => {
        expect(screen.getByText("3 days ago")).toBeTruthy();
      });
    });

    it("formats older dates as weekday + day", async () => {
      const createdAt = subDays(new Date(), 9);
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(makePrompts(createdAt)),
      );
      renderApp({ initialUrl: "/history" });

      await waitFor(() => {
        expect(screen.getByText(format(createdAt, "EEE d"))).toBeTruthy();
      });
    });
  });
});
