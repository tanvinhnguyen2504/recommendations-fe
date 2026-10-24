# TypeScript Coding Rules

When writing, modifying, or refactoring TypeScript code, follow these rules strictly.

## 1. Always use explicit `return`

Never use implicit returns for arrow functions.

Prefer:

```ts
const getUserName = (user: User): string => {
  return user.name;
};
```

Avoid:

```ts
const getUserName = (user: User): string => user.name;
```

This rule also applies to callbacks:

```ts
const names = users.map((user) => {
  return user.name;
});
```

Avoid:

```ts
const names = users.map((user) => user.name);
```

## 2. Always use a block body for functions

Every function and arrow function must use `{}` for its body.

Prefer:

```ts
const calculateTotal = (items: Item[]): number => {
  const total = items.reduce((sum, item) => {
    return sum + item.price;
  }, 0);

  return total;
};
```

Avoid:

```ts
const calculateTotal = (items: Item[]): number => items.reduce((sum, item) => sum + item.price, 0);
```

## 3. Always format functions across multiple lines

Do not write single-line functions, even when the function body is very short.

Prefer:

```ts
const isValid = (value: string): boolean => {
  return value.length > 0;
};
```

Avoid:

```ts
const isValid = (value: string): boolean => {
  return value.length > 0;
};
```

## 4. Inline callbacks are allowed, but must follow the same rules

Do NOT avoid inline callbacks entirely.

Inline callbacks are acceptable when they improve readability, especially for:

- `map`
- `filter`
- `find`
- `some`
- `every`
- `reduce`
- `forEach`
- Promise callbacks
- React event handlers

However, the callback must always use a block body and explicit `return` when returning a value.

Prefer:

```ts
const activeUsers = users.filter((user) => {
  return user.isActive;
});
```

Avoid:

```ts
const activeUsers = users.filter((user) => user.isActive);
```

## 5. Do not optimize for fewer lines

Do not make code shorter at the expense of consistency or readability.

Prefer:

```ts
const user = users.find((item) => {
  return item.id === userId;
});

if (!user) {
  return null;
}

return {
  id: user.id,
  name: user.name,
};
```

Avoid compressing the logic into fewer lines:

```ts
return users.find((item) => item.id === userId) ?? null;
```

The explicit, vertically formatted version is preferred even when the shorter version is technically valid.

## 6. Apply the rules consistently

These rules apply to all TypeScript code, including:

- Functions
- Arrow functions
- Async functions
- Promise callbacks
- Array callbacks
- React components
- React hooks
- Event handlers
- Utility fu
