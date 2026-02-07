import { render, screen, act } from "@testing-library/react-native";
import { CountdownTimer } from "../countdown-timer";

describe("CountdownTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01T12:00:00"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("displays hours and minutes when target is >1hr away", () => {
    render(<CountdownTimer targetDate="2024-01-01T14:30:00" />);

    expect(screen.getByText("2h 30m until next spin")).toBeOnTheScreen();
  });

  it("displays only minutes when target is <1hr away", () => {
    render(<CountdownTimer targetDate="2024-01-01T12:45:00" />);

    expect(screen.getByText("45m until next spin")).toBeOnTheScreen();
  });

  it("displays 0m when target is in the past", () => {
    render(<CountdownTimer targetDate="2024-01-01T11:00:00" />);

    expect(screen.getByText("0m until next spin")).toBeOnTheScreen();
  });

  it("updates time when interval fires", () => {
    render(<CountdownTimer targetDate="2024-01-01T12:45:00" />);

    expect(screen.getByText("45m until next spin")).toBeOnTheScreen();

    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(screen.getByText("44m until next spin")).toBeOnTheScreen();
  });

  it("clears interval when countdown expires", () => {
    render(<CountdownTimer targetDate="2024-01-01T12:01:00" />);

    expect(screen.getByText("1m until next spin")).toBeOnTheScreen();

    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(screen.getByText("0m until next spin")).toBeOnTheScreen();

    // Advance again - should stay at 0m (interval cleared)
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(screen.getByText("0m until next spin")).toBeOnTheScreen();
  });
});
