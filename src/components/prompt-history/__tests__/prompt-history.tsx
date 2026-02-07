import { render, screen } from "@testing-library/react-native";
import { format, subDays } from "date-fns";
import { PromptHistory } from "../PromptHistory";
import type { HistoryEntry } from "../../../types";

describe("PromptHistory", () => {
  describe("empty state", () => {
    it("renders empty message when no prompts", () => {
      render(<PromptHistory prompts={[]} />);
      expect(screen.getByText(/no prompts yet/i)).toBeTruthy();
    });
  });

  describe("with prompts", () => {
    const mockPrompts: HistoryEntry[] = [
      { text: "a b c", createdAt: new Date("2024-01-17T10:00:00.000Z") },
      { text: "d e f", createdAt: new Date("2024-01-16T10:00:00.000Z") },
      { text: "g h i", createdAt: new Date("2024-01-15T10:00:00.000Z") },
    ];

    it("skips latest prompt and renders past prompts", () => {
      render(<PromptHistory prompts={mockPrompts} />);
      expect(screen.queryByText("a b c")).toBeNull();
      expect(screen.getByText("d e f")).toBeTruthy();
      expect(screen.getByText("g h i")).toBeTruthy();
    });

    it("uses space-separated words", () => {
      render(<PromptHistory prompts={mockPrompts} />);
      expect(screen.queryByText(/·/)).toBeNull();
      expect(screen.getByText("d e f")).toBeTruthy();
    });
  });

  describe("date formatting", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      // Set to noon local time
      const now = new Date();
      now.setHours(12, 0, 0, 0);
      jest.setSystemTime(now);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    // Each date test needs 2 prompts: a newest (skipped) + the one under test
    function makePrompts(createdAt: Date): HistoryEntry[] {
      return [
        { text: "x y z", createdAt: new Date() }, // newest, skipped
        { text: "a b c", createdAt },
      ];
    }

    it('formats today as "Today"', () => {
      render(<PromptHistory prompts={makePrompts(new Date())} />);
      expect(screen.getByText("Today")).toBeTruthy();
    });

    it('formats yesterday as "Yesterday"', () => {
      render(<PromptHistory prompts={makePrompts(subDays(new Date(), 1))} />);
      expect(screen.getByText("Yesterday")).toBeTruthy();
    });

    it('formats 3 days ago as "3 days ago"', () => {
      render(<PromptHistory prompts={makePrompts(subDays(new Date(), 3))} />);
      expect(screen.getByText("3 days ago")).toBeTruthy();
    });

    it("formats older dates as weekday + day", () => {
      const createdAt = subDays(new Date(), 9);
      render(<PromptHistory prompts={makePrompts(createdAt)} />);
      expect(screen.getByText(format(createdAt, "EEE d"))).toBeTruthy();
    });
  });
});
