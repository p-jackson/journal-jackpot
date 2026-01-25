import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

const textVariants = cva("text-text dark:text-text-dark", {
  variants: {
    variant: {
      "page-title": "font-heading font-bold text-lg",
      body: "font-body",
      "heading-lg": "font-heading text-xl",
      "body-sm": "text-text-muted text-sm",
      muted: "text-text-muted",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

interface TextProps
  extends Omit<RNTextProps, "style">, VariantProps<typeof textVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Text({ variant, className, children, ...props }: TextProps) {
  return (
    <RNText className={textVariants({ variant, className })} {...props}>
      {children}
    </RNText>
  );
}
