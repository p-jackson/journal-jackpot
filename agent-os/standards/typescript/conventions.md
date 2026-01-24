# TypeScript Conventions

## File Naming

All source files use kebab-case.

```
✓ slot-machine.tsx
✓ prompt-storage.ts
✓ use-slot-machine.ts

✗ SlotMachine.tsx
✗ promptStorage.ts
✗ useSlotMachine.ts
```

**Why:** Named exports mean multiple components per file, so file != component name.

**Exceptions:** Framework-required names (`_layout.tsx`, `index.tsx`)

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

## Function Statements vs Expressions

Prefer function statements for named functions. Use expressions for anonymous functions.

```ts
// Good
function add(a: number, b: number) {
  return a + b;
}

// Bad
const add = function (a: number, b: number) {
  return a + b;
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

## Function Return Types

Leave return types implicit unless necessary for clarity.

```ts
// Good
async function add(a: number, b: number) {
  return Promise.resolve(a + b);
}

// Bad
async function add(a: number, b: number): Promise<number> {
  return Promise.resolve(a + b);
}
```

Explicit return types can be useful for tidier type narrowing or when the return type is complex.

```ts
// Good
function parseInput(input: string): 'a' | 'b' {
  if (input === 'a') return 'a';
  return 'b';
}

// Bad
function parseInput(input: string) {
  if (input === 'a') return 'a' as const;
  return 'b' as const;
}
```
