# moneo-ts

A small, simple, but powerful library for functional programming written in TypeScript. It was designed to be extremely lightweight, easy to learn and use.

This library includes a set of powerful tools to write predictable, immutable, and safe code that is easy to reason about. This is especially useful when dealing with complex data structures, async code, or error handling.

## Contents

- [Option](src/option) monad
- [Either](src/either) monad
- [IO](src/io) / [Async IO](src/io) monad

## Installation

To use `moneo-ts`, install the package via npm.

```shell
npm install moneo-ts

# or install a specific version
npm install moneo-ts@x.x.x
```

## Examples

**Option**

```typescript
import { Option, Some, None } from 'moneo-ts';

Option(0); // -> Some<number>
Option(''); // -> Some<string>
Option({}); // -> Some<{}>
Option(null); // -> None
Option(undefined); // -> None
```

**Either**

```typescript
import { Either, Right, Left } from 'moneo-ts';

Right(0); // -> Right<number>
Right(''); // -> Right<string>
Right({}); // -> Right<{}>
Right(null); // -> Right<null>
Right(undefined); // -> Right<undefined>

Left(0); // -> Left<number>
Left(''); // -> Left<string>
Left({}); // -> Left<{}>
Left(null); // -> Left<null>
Left(undefined); // -> Left<undefined>
```

**IO**

```typescript
import { IO, IOAsync } from 'moneo-ts';

// Examples
IO(() => 1); // -> IO<void, number>
IO((env: { a: 1 }) => env.a + 1); // -> IO<{ a: number }, number>
IOAsync(async () => 1); // -> IOAsync<void, number>
IOAsync(async (env: { a: 1 }) => env.a + 1); // -> IOAsync<{ a: number }, number>
```
