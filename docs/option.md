# Option Monad

The `Option` type represents a value that may or may not be present.

- `Some(value)` — Represents an existing value.
- `None` — Represents a missing or undefined value.

---

## API

### `Option(value)` / `Option.of(value)`

Creates an `Option`. Returns `Some(value)` if value is non-null/non-undefined, otherwise returns `None`.

```ts
Option(5);      // => Some(5)
Option(null);   // => None
Option(undefined); // => None
```

---

### `Some(value)` / `Option.some(value)`

Wraps a non-nullable value.

```ts
Some(5); // => Some(5)
```

---

### `None` / `Option.none`

Represents the absence of a value.

```ts
None; // => None
```

---

## Methods

All the following methods are available on `Option`, whether `Some` or `None`.

---

### `.ap(optionFn)`

Applies a wrapped function to a wrapped value.

```ts
const fn = Option((x: number) => x * 3);
Option(5).ap(fn); // => Some(15)
None.ap(fn);      // => None
```

---

### `.map(fn)`

Transforms the value using the provided function.

```ts
Option(5).map(x => x + 1); // => Some(6)
None.map(x => x + 1);      // => None
```

---

### `.forEach(fn)`

Executes a function for side effects if value exists.

```ts
Option(5).forEach(x => console.log(x)); // logs 5
None.forEach(x => console.log(x));      // logs nothing
```

---

### `.flatMap(fn)`

Chains another `Option`-returning function.

```ts
Option(5).flatMap(x => Option(x + 1)); // => Some(6)
None.flatMap(x => Option(x + 1));      // => None
```

---

### `.isSome()`

Checks if the Option is a `Some`.

```ts
Option(5).isSome(); // => true
None.isSome();      // => false
```

---

### `.isNone()`

Checks if the Option is a `None`.

```ts
Option(5).isNone(); // => false
None.isNone();      // => true
```

---

### `.orElse(option)`

Returns self if `Some`, otherwise returns the alternative.

```ts
Option(5).orElse(Option(10)); // => Some(5)
None.orElse(Option(10));      // => Some(10)
```

---

### `.getOrElse(value)`

Unwraps the value or returns a fallback.

```ts
Option(5).getOrElse(99); // => 5
None.getOrElse(99);      // => 99
```

---

### `.getOrNull()`

Returns the value or `null`.

```ts
Option(5).getOrNull(); // => 5
None.getOrNull();      // => null
```

---

### `.getOrUndefined()`

Returns the value or `undefined`.

```ts
Option(5).getOrUndefined(); // => 5
None.getOrUndefined();      // => undefined
```

---

### `.get()`

Unwraps the value. Throws if `None`.

```ts
Option(5).get(); // => 5
None.get();      // => throws Error
```

---

### `.fold(someFn, noneFn)`

Applies one of two functions depending on presence of value.

```ts
Option(5).fold(
  x => x * 2,
  () => 0
); // => 10

None.fold(
  x => x * 2,
  () => 0
); // => 0
```

---

### `.match(pattern)`

Pattern matches `Some` and `None` cases.

```ts
Option(5).match({
  Some: x => `Got ${x}`,
  None: () => 'Nothing'
}); // => "Got 5"

None.match({
  Some: x => `Got ${x}`,
  None: () => 'Nothing'
}); // => "Nothing"
```

---

### `.filter(predicate)`

Keeps the value only if it satisfies the predicate.

```ts
Option(5).filter(x => x > 3); // => Some(5)
Option(5).filter(x => x > 10); // => None
```

---

### `.transform(fn)`

Transforms the entire Option object into something else.

```ts
Option(5).transform(opt => opt.getOrElse(0) + 1); // => 6
None.transform(opt => opt.getOrElse(0) + 1);      // => 1
```

---

### `.contains(value)`

Checks if the value inside matches the given one.

```ts
Option(5).contains(5);  // => true
Option(5).contains(10); // => false
None.contains(5);       // => false
```

---

### `.equals(option)`

Compares two Options for value and type equality.

```ts
Option(5).equals(Option(5)); // => true
Option(5).equals(Option(10)); // => false
Option(5).equals(None);       // => false
None.equals(None);            // => true
```

---

### `.either()`

Converts `Option` to `Either<null, A>`. Returns `Right` if `Some`, otherwise `Left(null)`.

```ts
Option(5).either(); // => Right(5)
None.either();      // => Left(null)
```

---

### `.inspect(options)`

Returns a string description of the Option.

```ts
Option(5).inspect(); // => 'Some(5)'
None.inspect();      // => 'None'
```
