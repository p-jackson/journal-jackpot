# Link Wrapper

Wrap expo-router navigation for consistent styling.

```tsx
import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';

interface LinkProps {
  href: string | 'back';
  label: string;
  icon?: IoniconsName;
}

export function Link({ href, label, icon }: LinkProps) {
  const router = useRouter();

  const handlePress = () => {
    href === 'back' ? router.back() : router.push(href);
  };

  return (
    <Pressable onPress={handlePress} className="...">
      {icon && <Ionicons name={icon} />}
      <Text>{label}</Text>
    </Pressable>
  );
}
```

- Use for all in-app navigation links
- `href="back"` for back navigation
- Consistent press states and icon placement
