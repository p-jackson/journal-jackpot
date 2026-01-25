import { View, Text } from "react-native";

function DotLight({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: color,
        marginHorizontal: 3,
      }}
    />
  );
}

export function MachineTopBanner() {
  return (
    <View
      style={{
        backgroundColor: "#0f0f23",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <DotLight color="#d4af37" />
        <DotLight color="#f5e6a3" />
        <DotLight color="#d4af37" />
        <Text
          style={{
            color: "#d4af37",
            fontSize: 20,
            fontWeight: "800",
            letterSpacing: 4,
            marginHorizontal: 12,
            fontFamily: "SpaceGrotesk_700Bold",
          }}
        >
          JOURNAL JACKPOT
        </Text>
        <DotLight color="#d4af37" />
        <DotLight color="#f5e6a3" />
        <DotLight color="#d4af37" />
      </View>
    </View>
  );
}
