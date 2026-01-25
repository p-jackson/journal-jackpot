import React from "react";
import { View } from "react-native";

interface IconProps {
  name: string;
}

export const Ionicons = (props: IconProps) => (
  <View testID={`icon-${props.name}`} />
);
