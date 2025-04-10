# Either Monad

The `Either` type represents a value that can be one of two possible outcomes.

- `Right(value)` — Represents a successful or valid result (typically used to represent the "success" case).
- `Left(value)` — Represents an error or failure (typically used to represent the "error" case).

---

## API

### `Right(value)` / `Right.of(value)` / `Either.right(value)`

Creates a `Right` instance wrapping a successful value.

```ts
Right(5); // => Right(5)
```

---

### `Left(value)` / `Left.of(value)` / `Either.left(value)`

Creates a `Left` instance wrapping an error or failure value.

```ts
Left('error'); // => Left('error')
```

---

## Methods

All the following methods are available on `Either`, whether `Left` or `Right`.

---

### `.ap(eitherFn)`

Applies a wrapped function to the `Right` value.

```ts
const fn = Right((x: number) => x * 3);
Right(5).ap(fn); // => Right(15)
Left('error').ap(fn); // => Left('error')
```

---

### `.map(fn)`

Transforms the `Right` value with a function. No effect if `Left`.

```ts
Right(5).map(x => x + 1); // => Right(6)
Left('error').map(x => x + 1); // => Left('error')
```

---

### `.forEach(fn)`

Runs a function for side effects if `Right`.

```ts
Right(5).forEach(x => console.log(x)); // logs 5
Left('error').forEach(x => console.log(x)); // does nothing
```

---

### `.flatMap(fn)`

Chains another `Either`-returning function.

```ts
Right(5).flatMap(x => Right(x + 1)); // => Right(6)
Left('error').flatMap(x => Right(x + 1)); // => Left('error')
```

---

### `.isLeft()`

Returns `true` if the value is a `Left`.

```ts
Right(5).isLeft(); // => false
Left('error').isLeft(); // => true
```

---

### `.isRight()`

Returns `true` if the value is a `Right`.

```ts
Right(5).isRight(); // => true
Left('error').isRight(); // => false
```

---

### `.orElse(either)`

Returns self if `Right`, otherwise returns the alternative `Either`.

```ts
Right(5).orElse(Right(10)); // => Right(5)
Left('error').orElse(Right(10)); // => Right(10)
```

---

### `.getOrElse(value)`

Unwraps the `Right` value or returns a fallback.

```ts
Right(5).getOrElse(99); // => 5
Left('error').getOrElse(99); // => 99
```

---

### `.getOrNull()`

Returns value or `null`.

```ts
Right(5).getOrNull(); // => 5
Left('error').getOrNull(); // => null
```

---

### `.getOrUndefined()`

Returns value or `undefined`.

```ts
Right(5).getOrUndefined(); // => 5
Left('error').getOrUndefined(); // => undefined
```

---

### `.get()`

Unwraps the value or throws an error if `Left`.

```ts
Right(5).get(); // => 5
Left('error').get(); // => throws Error
```

---

### `.fold(rightFn, leftFn)`

Folds the value into a single result based on the variant.

```ts
Right(5).fold(
  r => `Right: ${r}`,
  l => `Left: ${l}`
); // => "Right: 5"

Left('fail').fold(
  r => `Right: ${r}`,
  l => `Left: ${l}`
); // => "Left: fail"
```

---

### `.match(pattern)`

Pattern matching for `Right` and `Left`.

```ts
Right(5).match({
  Right: r => `Success: ${r}`,
  Left: l => `Error: ${l}`,
}); // => "Success: 5"

Left('fail').match({
  Right: r => `Success: ${r}`,
  Left: l => `Error: ${l}`,
}); // => "Error: fail"
```

---

### `.filter(predicate)`

Keeps the `Right` value only if it satisfies the predicate. Otherwise becomes `Left(null)`.

```ts
Right(5).filter(x => x > 3);  // => Right(5)
Right(2).filter(x => x > 3);  // => Left(null)
Left('fail').filter(x => x > 3); // => Left('fail')
```

---

### `.transform(fn)`

Transforms the entire `Either` structure.

```ts
Right(5).transform(either => either.getOrElse(0) + 1); // => 6
Left('fail').transform(either => either.getOrElse(0) + 1); // => 1
```

---

### `.contains(value)`

Checks if `Right` contains the specified value.

```ts
Right(5).contains(5); // => true
Right(5).contains(10); // => false
Left('fail').contains(5); // => false
```

---

### `.equals(either)`

Compares two `Either` instances by value and type.

```ts
Right(5).equals(Right(5)); // => true
Right(5).equals(Right(10)); // => false
Left('fail').equals(Left('fail')); // => true
```

---

### `.swap()`

Swaps `Left` to `Right` and vice versa.

```ts
Right(5).swap(); // => Left(5)
Left('fail').swap(); // => Right('fail')
```

---

### `.option()`

Converts a `Right` to `Some`, or `Left` to `None`.

```ts
Right(5).option(); // => Some(5)
Left('fail').option(); // => None
```

---

### `.inspect()`

Returns a string representation.

```ts
Right(5).inspect(); // => "Right(5)"
Left('fail').inspect(); // => "Left(fail)"
```
