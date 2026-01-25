import { Pressable, Text as RNText } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DevResetButtonProps {
  onPress: () => void;
}

export function DevResetButton({ onPress }: DevResetButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-1.5 px-2 py-1 rounded-lg active:bg-red-100 dark:active:bg-red-900"
    >
      <Ionicons name="refresh" size={16} color="#ef4444" />
      <RNText className="text-red-500 font-medium">Reset</RNText>
    </Pressable>
  );
}
