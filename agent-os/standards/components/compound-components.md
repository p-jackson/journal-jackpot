# Compound Components

Use `Object.assign` for related sub-components that form a structure.

```tsx
function HeaderRoot({ children }) {
  return <View className="...">{children}</View>;
}

function HeaderLeft({ children }) { ... }
function HeaderCenter({ children }) { ... }
function HeaderRight({ children }) { ... }

export const Header = Object.assign(HeaderRoot, {
  Left: HeaderLeft,
  Center: HeaderCenter,
  Right: HeaderRight,
});
```

Usage:
```tsx
<Header>
  <Header.Left>...</Header.Left>
  <Header.Center>...</Header.Center>
  <Header.Right>...</Header.Right>
</Header>
```

- Use when sub-components only make sense together
- Parent defines layout, children fill slots
