# TypeScript Conventions

## Formatting

Use Prettier. No manual formatting discussions.

## Interface vs Type

Prefer `interface` for object shapes. Use `type` only for unions/intersections.

```ts
// Good
interface UserProps {
  name: string;
  age: number;
}

type Status = 'pending' | 'active' | 'done';

// Bad
type UserProps = {
  name: string;
  age: number;
};
```

## Optionals

Use `?:` for optional properties. Never use `T | undefined`.

```ts
// Good
interface Config {
  timeout?: number;
}

// Bad
interface Config {
  timeout: number | undefined;
}
```

## Unions over Enums

Use string unions, not enums.

```ts
// Good
type Status = 'pending' | 'active' | 'done';

// Bad
enum Status {
  Pending = 'pending',
  Active = 'active',
  Done = 'done',
}
```