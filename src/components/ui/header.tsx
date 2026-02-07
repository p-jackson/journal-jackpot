import { View } from "react-native";
import { HStack } from "./stack";

function HeaderRoot({ children }: { children: React.ReactNode }) {
  return (
    <View>
      <HStack align="center" className="px-6">
        {children}
      </HStack>
    </View>
  );
}

function HeaderLeft({ children }: { children: React.ReactNode }) {
  return (
    <HStack justify="start" className="flex-1">
      {children}
    </HStack>
  );
}

function HeaderCenter({ children }: { children: React.ReactNode }) {
  return (
    <HStack justify="center" className="flex-1">
      {children}
    </HStack>
  );
}

function HeaderRight({ children }: { children?: React.ReactNode }) {
  return (
    <HStack justify="end" className="flex-1">
      {children}
    </HStack>
  );
}

export const Header = Object.assign(HeaderRoot, {
  Left: HeaderLeft,
  Center: HeaderCenter,
  Right: HeaderRight,
});
