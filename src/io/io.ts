import { Either, Left, Right } from '../either';
import { None, Option, Some } from '../option';
import { Throwable } from '../types';
import { withCancel, withDelay, withTimeout } from '../utils';

// TODO: idea for new methods
// IO.race (first resolved wins)
// IO.all (parallel)
// IO(...).provideSome (provide partial env)
// IO(...).onFailure (side-effect)
// IO(...).onSuccess (side-effect)
// IO(...).onCancel (side-effect)

interface IOAsync<R, A> {
  ap: <B>(applicative: IOAsync<R, (a: A) => B | Promise<B>>) => IOAsync<R, B>;
  map: <B>(f: (a: A) => B | Promise<B>) => IOAsync<R, B>;
  flatMap: <B>(f: (a: A) => IOAsync<R, B>) => IOAsync<R, B>;
  flatMapL: <S, B>(
    f: (a: A) => IOAsync<S, B>,
    local: (env: R) => S,
  ) => IOAsync<R, B>;
  memoize: () => IOAsync<R, A>;
  provide: (env: R) => IOAsync<void, A>;
  provideDefault: (env: R) => IOAsync<R | void, A>;
  either: () => IOAsync<R, Either<Throwable, A>>;
  option: () => IOAsync<R, Option<A>>;
  recover: <B>(handle: (t: Throwable) => B | Promise<B>) => IOAsync<R, A | B>;
  recoverWith: <B>(io: IOAsync<R, B>) => IOAsync<R, A | B>;
  retry: (amount: number) => IOAsync<R, A>;
  delay: (ms: number) => IOAsync<R, A>;
  timeout: (ms: number) => IOAsync<R, A>;
  cancel: () => IOAsync<R, never>;
  transform: <B>(convert: (io: IOAsync<R, A>) => B) => B;
  access: <B>(f: (env: R) => B | Promise<B>) => IOAsync<R, B>;
  local: <S = R>(f: (env: S) => R) => IOAsync<S, A>;
  run: (env: R) => Promise<A>;
  inspect: () => string;
}

interface IO<R, A> {
  ap: <B>(applicative: IO<R, (a: A) => B>) => IO<R, B>;
  map: <B>(f: (a: A) => B) => IO<R, B>;
  flatMap: <B>(f: (a: A) => IO<R, B>) => IO<R, B>;
  flatMapL: <S, B>(f: (a: A) => IO<S, B>, local: (env: R) => S) => IO<R, B>;
  memoize: () => IO<R, A>;
  provide: (env: R) => IO<void, A>;
  provideDefault: (env: R) => IO<R | void, A>;
  either: () => IO<R, Either<Throwable, A>>;
  option: () => IO<R, Option<A>>;
  recover: <B>(handle: (t: Throwable) => B) => IO<R, A | B>;
  recoverWith: <B>(io: IO<R, B>) => IO<R, A | B>;
  retry: (amount: number) => IO<R, A>;
  transform: <B>(convert: (io: IO<R, A>) => B) => B;
  access: <B>(f: (env: R) => B) => IO<R, B>;
  local: <S = R>(f: (env: S) => R) => IO<S, A>;
  async: () => IOAsync<R, A>;
  run: (env: R) => A;
  inspect: () => string;
}

const IOAsync = <R = void, A = unknown>(
  fa: (env: R) => A | Promise<A>,
): IOAsync<R, A> => {
  let memo: Promise<A>;

  return {
    ap: (applicative) =>
      IOAsync((env) => applicative.map(async (f) => f(await fa(env))).run(env)),
    map: (f) => IOAsync(async (env) => f(await fa(env))),
    flatMap: (f) => IOAsync(async (env) => f(await fa(env)).run(env)),
    flatMapL: (f, local) =>
      IOAsync(async (env) => f(await fa(env)).run(local(env))),
    memoize: () =>
      IOAsync((env) => {
        if (!memo) memo = IOAsync(fa).run(env);
        return memo;
      }),
    provide: (env) => IOAsync(() => fa(env)),
    provideDefault: (env) => IOAsync((newEnv) => fa(newEnv ?? env)),
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
    run: async (env) => {
      try {
        return await fa(env);
      } catch {
        throw Error('uncaught error when running io');
      }
    },
    inspect: () => `IOAsync(${fa})`,
  };
};

IOAsync.of = <A>(a: A) => IOAsync(() => a);
IOAsync.failure = (t: Throwable) =>
  IOAsync(() => {
    throw t;
  });
IOAsync.success = <A>(a: A) => IOAsync(() => a);

const IO = <R = void, A = unknown>(fa: (env: R) => A): IO<R, A> => {
  let memo: A;

  return {
    ap: (applicative) =>
      IO((env) => applicative.map((f) => f(fa(env))).run(env)),
    map: (f) => IO((env) => f(fa(env))),
    flatMap: (f) => IO((env) => f(fa(env)).run(env)),
    flatMapL: (f, local) => IO((env) => f(fa(env)).run(local(env))),
    memoize: () =>
      IO((env) => {
        if (!memo) memo = IO(fa).run(env);
        return memo;
      }),
    provide: (env) => IO(() => fa(env)),
    provideDefault: (env) => IO((newEnv) => fa(newEnv ?? env)),
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
    run: (env) => {
      try {
        return fa(env);
      } catch {
        throw Error('uncaught error when running io');
      }
    },
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
