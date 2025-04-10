import { Either, Left, Right } from "../either";
import { None, Option, Some } from "../option";
import type { Throwable } from "../types";
import { cancel, delay, memoize, timeout } from "../utils";

interface IOAsync<R, A> {
	ap: <B>(applicative: IOAsync<R, (a: A) => B | Promise<B>>) => IOAsync<R, B>;
	map: <B>(f: (a: A) => B | Promise<B>) => IOAsync<R, B>;
	forEach: <B = void>(f: (a: A) => B | Promise<B>) => IOAsync<R, A>;
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
	forEach: <B = void>(f: (a: A) => B) => IO<R, A>;
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
	return {
		ap: (applicative) =>
			IOAsync((env) => applicative.map(async (f) => f(await fa(env))).run(env)),
		map: (f) => IOAsync(async (env) => f(await fa(env))),
		forEach: (f) =>
			IOAsync(async (env) => {
				f(await fa(env));
				return await fa(env);
			}),
		flatMap: (f) => IOAsync(async (env) => f(await fa(env)).run(env)),
		flatMapL: (f, local) =>
			IOAsync(async (env) => f(await fa(env)).run(local(env))),
		memoize: () => IOAsync(memoize((env) => IOAsync(fa).run(env))),
		provide: (env) => IOAsync(() => fa(env)),
		provideDefault: (env) => IOAsync((newEnv) => fa(newEnv ?? env)),
		either: () =>
			IOAsync(async (env) => {
				try {
					return Right(await fa(env));
				} catch (e) {
					return Left(e as Throwable);
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
					return handle(e as Throwable);
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
				return await delay(async () => fa(env), ms);
			}),
		timeout: (ms) =>
			IOAsync(async (env) => {
				return await timeout(async () => fa(env), ms);
			}),
		cancel: () =>
			IOAsync(async (env) => {
				return await cancel(async () => fa(env));
			}),
		transform: (convert) => convert(IOAsync(fa)),
		access: (f) => IOAsync((env) => f(env)),
		local: (f) => IOAsync((env) => IOAsync(fa).run(f(env))),
		run: async (env) => await fa(env),
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
	return {
		ap: (applicative) =>
			IO((env) => applicative.map((f) => f(fa(env))).run(env)),
		map: (f) => IO((env) => f(fa(env))),
		forEach: (f) =>
			IO((env) => {
				f(fa(env));
				return fa(env);
			}),
		flatMap: (f) => IO((env) => f(fa(env)).run(env)),
		flatMapL: (f, local) => IO((env) => f(fa(env)).run(local(env))),
		memoize: () => IO(memo((env) => IO(fa).run(env))),
		provide: (env) => IO(() => fa(env)),
		provideDefault: (env) => IO((newEnv) => fa(newEnv ?? env)),
		either: () =>
			IO((env) => {
				try {
					return Right(fa(env));
				} catch (e) {
					return Left(e as Throwable);
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
					return handle(e as Throwable);
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
