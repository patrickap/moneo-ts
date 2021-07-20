import { Either, Left, Right } from '../either';
import { None, Option, Some } from '../option';
import { Throwable } from '../types';
import { withCancel, withDelay, withTimeout } from '../utils';

// TODO: idea for new methods
// IO(...).provideSome (provide partial env)
// IO.race (first resolved wins)
// IO.all (parallel)
// IO(...).ifFailure (side-effect)
// IO(...).ifSuccess (side-effect)
// IO(...).ifCancel (side-effect)

interface IOAsync<R, A> {
  ap: <B>(applicative: IOAsync<R, (a: A) => B | Promise<B>>) => IOAsync<R, B>;
  map: <B>(f: (a: A) => B | Promise<B>) => IOAsync<R, B>;
  flatMap: <B>(f: (a: A) => IO<R, B> | IOAsync<R, B>) => IOAsync<R, B>;
  memoize: () => IOAsync<R, A>;
  provide: (env: R) => IOAsync<void, A>;
  provideDefault: (env: R) => IOAsync<Partial<R> | void, A>;
  either: () => IOAsync<R, Either<Throwable, A>>;
  option: () => IOAsync<R, Option<A>>;
  recover: <B>(handle: (t: Throwable) => B | Promise<B>) => IOAsync<R, A | B>;
  recoverWith: <B>(io: IO<R, B> | IOAsync<R, B>) => IOAsync<R, A | B>;
  retry: (amount: number) => IOAsync<R, A>;
  delay: (ms: number) => IOAsync<R, A>;
  timeout: (ms: number) => IOAsync<R, A>;
  cancel: () => IOAsync<R, never>;
  transform: <B>(convert: (io: IOAsync<R, A>) => B) => B;
  access: <R2>(f: (env: R) => R2) => IOAsync<R, R2>;
  local: <R2 = R>(f: (env: R2) => R) => IOAsync<R2, A>;
  run: (env: R) => Promise<A>;
  inspect: () => string;
}

interface IO<R, A> {
  ap: <B>(applicative: IO<R, (a: A) => B>) => IO<R, B>;
  map: <B>(f: (a: A) => B) => IO<R, B>;
  flatMap: <B>(f: (a: A) => IO<R, B>) => IO<R, B>;
  memoize: () => IO<R, A>;
  provide: (env: R) => IO<void, A>;
  provideDefault: (env: R) => IO<Partial<R> | void, A>;
  either: () => IO<R, Either<Throwable, A>>;
  option: () => IO<R, Option<A>>;
  recover: <B>(handle: (t: Throwable) => B) => IO<R, A | B>;
  recoverWith: <B>(io: IO<R, B>) => IO<R, A | B>;
  retry: (amount: number) => IO<R, A>;
  transform: <B>(convert: (io: IO<R, A>) => B) => B;
  access: <R2>(f: (env: R) => R2) => IO<R, R2>;
  local: <R2 = R>(f: (env: R2) => R) => IO<R2, A>;
  async: () => IOAsync<R, A>;
  run: (env: R) => A;
  inspect: () => string;
}

const IOAsync = <R extends {[key: string]: any} | void, A = unknown>(
  fa: (env: R) => A | Promise<A>,
): IOAsync<R, A> => {
  let memo: Promise<A>;

  return {
    ap: (applicative) =>
      IOAsync((env) => applicative.flatMap((f) => IOAsync(fa).map(f)).run(env)),
    map: (f) => IOAsync(async (env) => f(await fa(env))),
    flatMap: (f) => IOAsync(async (env) => f(await fa(env)).run(env)),
    memoize: () =>
      IOAsync((env) => {
        if (!memo) memo = IOAsync(fa).run(env);
        return memo;
      }),
    provide: (env) => IOAsync(() => fa(env)),
    provideDefault: (env) => IOAsync((newEnv) => fa({...env, ...newEnv})),
    either: () =>
      IOAsync(async (env) => {
        try {
          return Right(await fa(env));
        } catch (e) {
          return Left(e);
        }
      }),
    option: () =>
      IOAsync(async (env) => {
        try {
          return Some(await fa(env));
        } catch {
          return None;
        }
      }),
    recover: (handle) =>
      IOAsync(async (env) => {
        try {
          return await fa(env);
        } catch (e) {
          return handle(e);
        }
      }),
    recoverWith: (alternative) =>
      IOAsync(async (env) => {
        try {
          return await fa(env);
        } catch {
          return alternative.run(env);
        }
      }),
    retry: (amount) =>
      IOAsync(async (env) => {
        if (amount > 0) {
          try {
            return await fa(env);
          } catch {
            return IOAsync(fa)
              .retry(amount - 1)
              .run(env);
          }
        } else {
          return fa(env);
        }
      }),
    delay: (ms) =>
      IOAsync(async (env) => {
        const { delay } = withDelay(async () => fa(env));
        return await delay(ms);
      }),
    timeout: (ms) =>
      IOAsync(async (env) => {
        const { timeout } = withTimeout(async () => fa(env));
        return await timeout(ms);
      }),
    cancel: () =>
      IOAsync(async (env) => {
        const { cancel } = withCancel(async () => fa(env));
        return await cancel();
      }),
    transform: (convert) => convert(IOAsync(fa)),
    access: (f) => IOAsync((env) => f(env)),
    local: (f) => IOAsync((env) => IOAsync(fa).run(f(env))),
    run: async (env) => fa(env),
    inspect: () => `IOAsync(${fa})`,
  };
};

IOAsync.of = <A>(a: A) => IOAsync(() => a);
IOAsync.failure = (t: Throwable) =>
  IOAsync(() => {
    throw t;
  });
IOAsync.success = <A>(a: A) => IOAsync(() => a);

const IO = <R extends {[key: string]: any} | void, A = unknown>(fa: (env: R) => A): IO<R, A> => {
  let memo: A;

  return {
    ap: (applicative) =>
      IO((env) => applicative.flatMap((f) => IO(fa).map(f)).run(env)),
    map: (f) => IO((env) => f(fa(env))),
    flatMap: (f) => IO((env) => f(fa(env)).run(env)),
    memoize: () =>
      IO((env) => {
        if (!memo) memo = IO(fa).run(env);
        return memo;
      }),
    provide: (env) => IO(() => fa(env)),
    provideDefault: (env) => IO((newEnv) => fa({...env, ...newEnv})),
    either: () =>
      IO((env) => {
        try {
          return Right(fa(env));
        } catch (e) {
          return Left(e);
        }
      }),
    option: () =>
      IO((env) => {
        try {
          return Some(fa(env));
        } catch {
          return None;
        }
      }),
    recover: (handle) =>
      IO((env) => {
        try {
          return fa(env);
        } catch (e) {
          return handle(e);
        }
      }),
    recoverWith: (alternative) =>
      IO((env) => {
        try {
          return fa(env);
        } catch {
          return alternative.run(env);
        }
      }),
    retry: (amount) =>
      IO((env) => {
        if (amount > 0) {
          try {
            return fa(env);
          } catch {
            return IO(fa)
              .retry(amount - 1)
              .run(env);
          }
        } else {
          return fa(env);
        }
      }),
    transform: (convert) => convert(IO(fa)),
    access: (f) => IO((env) => f(env)),
    local: (f) => IO((env) => IO(fa).run(f(env))),
    async: () => IOAsync((env) => IO(fa).run(env)),
    run: (env) => fa(env),
    inspect: () => `IO(${fa})`,
  };
};

IO.of = <A>(a: A) => IO(() => a);
IO.failure = (t: Throwable) =>
  IO(() => {
    throw t;
  });
IO.success = <A>(a: A) => IO(() => a);
IO.async = IOAsync;

export { IO, IOAsync };
