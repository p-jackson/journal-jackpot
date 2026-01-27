import { render, screen } from "@testing-library/react-native";
import { userEvent } from "@testing-library/react-native";
import { DevResetButton } from "../dev-reset-button";

describe("DevResetButton", () => {
  it("renders reset label", () => {
    render(<DevResetButton onPress={jest.fn()} />);
    expect(screen.getByText("Reset")).toBeTruthy();
  });

  it("calls onPress when pressed", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    render(<DevResetButton onPress={onPress} />);
    await user.press(screen.getByText("Reset"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
