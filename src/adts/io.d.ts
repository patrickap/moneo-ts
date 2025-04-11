import { type Either } from "~/adts/either";
import { type Option } from "~/adts/option";
import type { Throwable } from "~/types";
export interface IOAsync<R, A> {
    ap: <B>(applicative: IOAsync<R, (a: A) => B | Promise<B>>) => IOAsync<R, B>;
    map: <B>(f: (a: A) => B | Promise<B>) => IOAsync<R, B>;
    forEach: <B = void>(f: (a: A) => B | Promise<B>) => IOAsync<R, A>;
    flatMap: <B>(f: (a: A) => IOAsync<R, B>) => IOAsync<R, B>;
    flatMapL: <S, B>(f: (a: A) => IOAsync<S, B>, local: (env: R) => S) => IOAsync<R, B>;
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
export interface IO<R, A> {
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
export declare const IOAsync: {
    <R = void, A = unknown>(fa: (env: R) => A | Promise<A>): IOAsync<R, A>;
    of<A>(a: A): IOAsync<void, A>;
    failure(t: Throwable): IOAsync<void, never>;
    success<A>(a: A): IOAsync<void, A>;
};
export declare const IO: {
    <R = void, A = unknown>(fa: (env: R) => A): IO<R, A>;
    of<A>(a: A): IO<void, A>;
    failure(t: Throwable): IO<void, never>;
    success<A>(a: A): IO<void, A>;
    async: {
        <R = void, A = unknown>(fa: (env: R) => A | Promise<A>): IOAsync<R, A>;
        of<A>(a: A): IOAsync<void, A>;
        failure(t: Throwable): IOAsync<void, never>;
        success<A>(a: A): IOAsync<void, A>;
    };
};
