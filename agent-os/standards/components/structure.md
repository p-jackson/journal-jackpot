# Component Structure

## Folder Organization

```
components/
  ui/           # Reusable UI primitives (Button, Card, Input, etc.)
  feature-name/ # Feature-specific components (only if needed)
```

- All reusable components go in `components/ui/`
- Feature components only when a feature has multiple related components

## Exports

Use named exports, not default exports.

```tsx
// Good
export function Button() { ... }

// Bad
export default function Button() { ... }
```

## Props

Every component has an explicit Props type.

```tsx
type ButtonProps = {
  variant: 'primary' | 'secondary';
  onPress: () => void;
  children: React.ReactNode;
};

export function Button({ variant, onPress, children }: ButtonProps) {
  ...
}
```
