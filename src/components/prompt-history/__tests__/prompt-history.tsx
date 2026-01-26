import { render, screen } from "@testing-library/react-native";
import { PromptHistory } from "../PromptHistory";
import type { SavedPrompt } from "../../../types";

describe("PromptHistory", () => {
  describe("empty state", () => {
    it("renders empty message when no prompts", () => {
      render(<PromptHistory prompts={[]} />);
      expect(screen.getByText(/no prompts yet/i)).toBeTruthy();
    });
  });

  describe("with prompts", () => {
    const mockPrompts: SavedPrompt[] = [
      { text: "a b c", createdAt: "2024-01-17T10:00:00.000Z" },
      { text: "d e f", createdAt: "2024-01-16T10:00:00.000Z" },
      { text: "g h i", createdAt: "2024-01-15T10:00:00.000Z" },
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

    function getDateString(daysAgo: number): string {
      const date = new Date();
      date.setHours(10, 0, 0, 0);
      date.setDate(date.getDate() - daysAgo);
      return date.toISOString();
    }

    // Each date test needs 2 prompts: a newest (skipped) + the one under test
    function makePrompts(createdAt: string): SavedPrompt[] {
      return [
        { text: "x y z", createdAt: getDateString(0) }, // newest, skipped
        { text: "a b c", createdAt },
      ];
    }

    it('formats today as "Today"', () => {
      const prompts = makePrompts(getDateString(0));
      render(<PromptHistory prompts={prompts} />);
      expect(screen.getByText("Today")).toBeTruthy();
    });

    it('formats yesterday as "Yesterday"', () => {
      const prompts = makePrompts(getDateString(1));
      render(<PromptHistory prompts={prompts} />);
      expect(screen.getByText("Yesterday")).toBeTruthy();
    });

    it('formats 3 days ago as "3 days ago"', () => {
      const prompts = makePrompts(getDateString(3));
      render(<PromptHistory prompts={prompts} />);
      expect(screen.getByText("3 days ago")).toBeTruthy();
    });

    it("formats older dates as weekday + day", () => {
      const createdAt = getDateString(9);
      const prompts = makePrompts(createdAt);
      render(<PromptHistory prompts={prompts} />);
      const date = new Date(createdAt);
      const expected = `${date.toLocaleDateString("en-US", { weekday: "short" })} ${String(date.getDate())}`;
      expect(screen.getByText(expected)).toBeTruthy();
    });
  });
});
