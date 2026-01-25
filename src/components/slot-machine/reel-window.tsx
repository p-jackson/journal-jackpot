import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface ReelWindowProps {
  children: React.ReactNode;
}

export function ReelWindow({ children }: ReelWindowProps) {
  return (
    /* Outer inset ring — dark */
    <View
      style={{
        backgroundColor: "#18181b",
        borderRadius: 16,
        padding: 4,
      }}
    >
      {/* Mid ring — slightly lighter */}
      <View
        style={{
          backgroundColor: "#3f3f46",
          borderRadius: 12,
          padding: 3,
        }}
      >
        {/* Inner cream background */}
        <View
          style={{
            backgroundColor: "#fefce8",
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {children}

          {/* Glass overlay */}
          <LinearGradient
            colors={["rgba(255,255,255,0.18)", "transparent"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
            pointerEvents="none"
          />
        </View>
      </View>
    </View>
  );
}

export function ReelSeparator() {
  return (
    <View
      style={{
        width: 1,
        backgroundColor: "#d4d4d8",
        alignSelf: "stretch",
      }}
    />
  );
}
