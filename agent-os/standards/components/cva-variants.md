# CVA Variants

Use `class-variance-authority` for reusable style presets.

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const textVariants = cva('text-text dark:text-text-dark', {
  variants: {
    variant: {
      'page-title': 'font-heading font-bold text-lg',
      body: 'font-body',
    },
  },
  defaultVariants: { variant: 'body' },
});

interface TextProps extends VariantProps<typeof textVariants> {
  className?: string;
}
```

- Define variants for consistent style presets
- `defaultVariants` optional — use when a sensible default exists
- Allow `className` override for one-off adjustments
