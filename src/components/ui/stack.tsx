import { View, type ViewProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

const stackVariants = cva("flex", {
  variants: {
    align: {
      center: "items-center",
    },
    justify: {
      center: "justify-center",
      start: "justify-start",
      end: "justify-end",
    },
    direction: {
      row: "flex-row",
      col: "flex-col",
    },
    gap: {
      0: "gap-0",
      3: "gap-3",
    },
  },
  defaultVariants: {
    gap: 3,
  },
});

interface StackProps
  extends
    Omit<ViewProps, "className">,
    Omit<VariantProps<typeof stackVariants>, "direction"> {
  className?: string;
  children: React.ReactNode;
}

export function VStack({
  align,
  className,
  children,
  justify,
  ...props
}: StackProps) {
  return (
    <View
      className={stackVariants({ align, className, justify, direction: "col" })}
      {...props}
    >
      {children}
    </View>
  );
}

export function HStack({
  align,
  className,
  children,
  justify,
  ...props
}: StackProps) {
  return (
    <View
      className={stackVariants({ align, className, justify, direction: "row" })}
      {...props}
    >
      {children}
    </View>
  );
}
