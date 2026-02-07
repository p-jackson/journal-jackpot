import { Pressable, Text as RNText } from "react-native";
import type { Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { cva, type VariantProps } from "class-variance-authority";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const textButtonVariants = cva("flex flex-row items-center gap-1.5", {
  variants: {
    variant: {
      default: "",
      scary: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const labelVariants = cva("font-medium", {
  variants: {
    variant: {
      default: "text-primary",
      scary: "text-scary",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const iconColors = {
  default: "#7c3aed", // var(--color-primary)
  scary: "#ef4444", // var(--color-scary)
} as const;

interface ButtonProps extends VariantProps<typeof textButtonVariants> {
  href?: Href;
  onPress?: React.ComponentProps<typeof Pressable>["onPress"];
  children: React.ReactNode;
  icon?: IoniconsName;
  className?: string;
}

export function TextButton({
  icon,
  children,
  variant,
  className,
  onPress,
}: ButtonProps) {
  const iconElement = icon && (
    <Ionicons name={icon} size={16} color={iconColors[variant ?? "default"]} />
  );

  return (
    <Pressable
      onPress={onPress}
      className={textButtonVariants({ variant, className })}
    >
      {iconElement}
      <RNText className={labelVariants({ variant })}>{children}</RNText>
    </Pressable>
  );
}
