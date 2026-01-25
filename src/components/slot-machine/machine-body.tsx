import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface MachineBodyProps {
  children: React.ReactNode;
}

export function MachineBody({ children }: MachineBodyProps) {
  return (
    <View style={{ padding: 4, borderRadius: 28, backgroundColor: "#d4af37" }}>
      <LinearGradient
        colors={["#1a1a2e", "#16213e"]}
        style={{ borderRadius: 24, paddingVertical: 24, paddingHorizontal: 16 }}
      >
        {children}
      </LinearGradient>
    </View>
  );
}
