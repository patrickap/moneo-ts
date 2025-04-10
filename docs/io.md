# IO Monad

The `IO` type represents a computation that produces a value and may have side effects. It can be either synchronous or asynchronous:

- `IO(value)` — Represents a synchronous (blocking) computation that will return a value.
- `IOAsync(value)` — Represents an asynchronous (non-blocking) computation that will return a value, typically used for tasks like network requests or file I/O.

Both types are **lazy** — nothing executes until `.run(env)` is called.

---

## API

### `IO(f)` / `IOAsync(f)`

Creates an `IO` instance. 

```ts
IO(() => 5); // => IO<void, 5>
IOAsync(() => 5); // => IOAsync<void, 5>
```

### `IO.of(value)` / `IOAsync.of(value)`

Wraps a value in a pure or async computation.

```ts
IO.of(5); // => IO<void, 5>
IOAsync.of(5); // => IOAsync<void, 5>
```

---

### `IO.failure(error)` / `IOAsync.failure(error)`

Creates a failing computation.

```ts
IO.failure(new Error('fail')); // throws on run
```

---

### `IO.success(value)` / `IOAsync.success(value)`

Alias for `of(value)`.

---

### `IO.async`

Reference to `IOAsync` for ease of use.

---

## Methods

Most of the following methods are available on both `IO` and `IOAsync`.

---

### `.ap(applicative)`

Applies a wrapped function to a wrapped value.

```ts
const fn = IO.of((x: number) => x + 1);
IO.of(2).ap(fn); // => IO<void, 3>

const asyncFn = IOAsync.of((x: number) => x * 2);
IOAsync.of(3).ap(asyncFn); // => IOAsync<void, 6>
```

---

### `.map(f)`

Transforms the result of the computation.

```ts
IO.of(5).map(x => x * 2); // => IO<void, 10>
IOAsync.of(5).map(async x => x * 2); // => IOAsync<void, Promise<10>>
```

---

### `.forEach(f)`

Runs a side-effecting function and returns the original value.

```ts
IO.of(5).forEach(console.log); // logs 5

IOAsync.of(5).forEach(async x => console.log(x)); // logs 5
```

---

### `.flatMap(f)`

Chains another computation that returns `IO` or `IOAsync`.

```ts
IO.of(5).flatMap(x => IO.of(x + 1)); // => IO<void, 6>
IOAsync.of(5).flatMap(x => IOAsync.of(x + 1)); // => IOAsync<void, 6>
```

---

### `.flatMapL(f, local)`

Maps the value while locally transforming the environment.

```ts
IO.of(1).flatMapL(a => IO.of(a + 1), env => env); // => IO<R, 2>
```

---

### `.memoize()`

Caches the result of the computation per environment.

```ts
const io = IO.of(Math.random()).memoize();
io.run(); // => always same value
```

---

### `.provide(env)`

Injects an environment.

```ts
IO((env: string) => env.length).provide('hello'); // => IO<void, 5>
```

---

### `.provideDefault(env)`

Injects a default environment if not provided.

```ts
IO((env?: string) => env?.length ?? 0).provideDefault('hi'); // => IO<void, 2>
```

---

### `.either()`

Converts result into `Either<Throwable, A>`.

```ts
IO(() => { throw 'error'; }).either(); // => Left('error')
IO.of(5).either(); // => Right(5)
```

---

### `.option()`

Converts result into `Option<A>`.

```ts
IO(() => { throw 'fail'; }).option(); // => None
IO.of(10).option(); // => Some(10)
```

---

### `.recover(f)`

Error handling via fallback handler.

```ts
IO(() => { throw 'err'; }).recover(e => 'default'); // => IO<void, 'default'>
```

---

### `.recoverWith(io)`

Error handling via fallback value.

```ts
IO(() => { throw 'err'; }).recoverWith(IO.of('alt')); // => IO<void, 'alt'>
```

---

### `.retry(amount)`

Retries the computation on failure.

```ts
IO(() => { throw 'fail'; }).retry(3); // => retries 3 times
```

---

### `.delay(ms)` (`IOAsync` only)

Delays execution by milliseconds.

```ts
IOAsync.of(5).delay(1000); // => IOAsync<void, 5> (after 1s)
```

---

### `.timeout(ms)` (`IOAsync` only)

Throws error if not resolved within time.

```ts
IOAsync(() => new Promise(r => setTimeout(() => r(5), 2000)))
  .timeout(1000); // => throws timeout
```

---

### `.cancel()` (`IOAsync` only)

Cancels the computation using a cancellation token.

```ts
IOAsync.of(5).cancel(); // => IOAsync<void, never>
```

---

### `.transform(f)`

Applies a custom transformation to the entire IO/IOAsync structure.

```ts
IO.of(5).transform(io => io.map(x => x * 2)); // => IO<void, 10>
```

---

### `.access(f)`

Extracts a value from the environment.

```ts
IO.access((env: string) => env.length); // => IO<string, number>
```

---

### `.local(f)`

Transforms the environment type.

```ts
IO<string, number>.local(env => env.toUpperCase()); // => IO<S, number>
```

---

### `.async()` (`IO` only)

Converts `IO` to an `IOAsync`.

```ts
IO.of(5).async(); // => IOAsync<void, 5>
```

---

### `.run(env)`

Executes the IO/IOAsync with the provided environment.

```ts
IO.of(5).run(); // => 5
IOAsync.of(5).run(); // => Promise<5>
```

---

### `.inspect()`

Returns a string representation.

```ts
IO.of(5).inspect(); // => "IO(() => 5)"
IOAsync.of(5).inspect(); // => "IOAsync(() => 5)"
```
