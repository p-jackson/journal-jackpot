# NativeWind Styling

## Component-Based Styling

Styling lives in reusable UI components, not view/screen code.

```tsx
// Good — screen uses styled components
function HomeScreen() {
  return (
    <Card>
      <Heading>Welcome</Heading>
      <Button variant="primary">Start</Button>
    </Card>
  );
}

// Bad — utility classes in screen code
function HomeScreen() {
  return (
    <View className="bg-surface rounded-lg p-4">
      <Text className="text-xl font-bold">Welcome</Text>
    </View>
  );
}
```

## No Hardcoded Values

Never use Tailwind's default values. Define everything as theme variables or custom utilities.

```css
/* global.css */
@theme {
  --color-primary: ...;
  --color-surface: ...;
  --spacing-card: ...;
  --radius-card: ...;
}
```

```tsx
// Good — custom theme tokens
<View className="bg-surface rounded-card p-card">

// Bad — Tailwind defaults
<View className="bg-gray-100 rounded-lg p-4">
```

## Positioning

Parents position children. Use padding, not margin.

```tsx
// Good
<Card className="p-card">
  <Button />
</Card>

// Bad
<Card>
  <Button className="m-4" />
</Card>
```

## Style Props

- `className` in UI components for static styles
- `style` prop only for dynamic values (animations, computed)
