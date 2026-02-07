import { View, type ViewProps } from "react-native";
import { cx } from "class-variance-authority";

interface CenterProps extends Omit<ViewProps, "className"> {
  className?: string;
  children: React.ReactNode;
}

export function Center({ className, children, ...props }: CenterProps) {
  return (
    <View
      className={cx("items-center justify-center p-6", className)}
      {...props}
    >
      {children}
    </View>
  );
}
