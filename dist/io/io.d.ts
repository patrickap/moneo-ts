import { Either } from '../either';
import { Option } from '../option';
import { Throwable } from '../types';
interface IOAsync<R, A> {
    ap: <B>(applicative: IOAsync<R, (a: A) => B | Promise<B>>) => IOAsync<R, B>;
    map: <B>(f: (a: A) => B | Promise<B>) => IOAsync<R, B>;
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
declare const IOAsync: {
    <R = void, A = unknown>(fa: (env: R) => A | Promise<A>): IOAsync<R, A>;
    of<A_1>(a: A_1): IOAsync<void, A_1>;
    failure(t: Throwable): IOAsync<void, never>;
    success<A_2>(a: A_2): IOAsync<void, A_2>;
};
declare const IO: {
    <R = void, A = unknown>(fa: (env: R) => A): IO<R, A>;
    of<A_1>(a: A_1): IO<void, A_1>;
    failure(t: Throwable): IO<void, never>;
    success<A_2>(a: A_2): IO<void, A_2>;
    async: {
        <R_1 = void, A_3 = unknown>(fa: (env: R_1) => A_3 | Promise<A_3>): IOAsync<R_1, A_3>;
        of<A_4>(a: A_4): IOAsync<void, A_4>;
        failure(t: Throwable): IOAsync<void, never>;
        success<A_5>(a: A_5): IOAsync<void, A_5>;
    };
};
export { IO, IOAsync };
//# sourceMappingURL=io.d.ts.map