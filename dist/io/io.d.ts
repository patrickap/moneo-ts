import { Either } from '../either';
import { Option } from '../option';
import { Throwable } from '../types';
interface IOAsync<R, A> {
    ap: <B>(applicative: IOAsync<R, (a: A) => B | Promise<B>>) => IOAsync<R, B>;
    map: <B>(f: (a: A) => B | Promise<B>) => IOAsync<R, B>;
    flatMap: <S, B>(f: (a: A) => IO<S, B> | IOAsync<S, B>) => IOAsync<R & S, B>;
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
    access: <B>(f: (env: R, a: A) => B | Promise<B>) => IOAsync<R, B>;
    ask: () => IOAsync<R, R>;
    asks: <B>(f: (env: R) => B | Promise<B>) => IOAsync<R, B>;
    local: <R2 = R>(f: (env: R2) => R) => IOAsync<R2, A>;
    run: (env: R) => Promise<A>;
    inspect: () => string;
}
interface IO<R, A> {
    ap: <B>(applicative: IO<R, (a: A) => B>) => IO<R, B>;
    map: <B>(f: (a: A) => B) => IO<R, B>;
    flatMap: <S, B>(f: (a: A) => IO<S, B>) => IO<R & S, B>;
    memoize: () => IO<R, A>;
    provide: (env: R) => IO<void, A>;
    provideDefault: (env: R) => IO<Partial<R> | void, A>;
    either: () => IO<R, Either<Throwable, A>>;
    option: () => IO<R, Option<A>>;
    recover: <B>(handle: (t: Throwable) => B) => IO<R, A | B>;
    recoverWith: <B>(io: IO<R, B>) => IO<R, A | B>;
    retry: (amount: number) => IO<R, A>;
    transform: <B>(convert: (io: IO<R, A>) => B) => B;
    access: <B>(f: (env: R, a: A) => B) => IO<R, B>;
    ask: () => IO<R, R>;
    asks: <B>(f: (env: R) => B) => IO<R, B>;
    local: <R2 = R>(f: (env: R2) => R) => IO<R2, A>;
    async: () => IOAsync<R, A>;
    run: (env: R) => A;
    inspect: () => string;
}
declare const IOAsync: {
    <R extends void | {
        [key: string]: any;
    }, A = unknown>(fa: (env: R) => A | Promise<A>): IOAsync<R, A>;
    of<A_1>(a: A_1): IOAsync<void | {
        [key: string]: any;
    }, A_1>;
    failure(t: Throwable): IOAsync<void | {
        [key: string]: any;
    }, never>;
    success<A_2>(a: A_2): IOAsync<void | {
        [key: string]: any;
    }, A_2>;
};
declare const IO: {
    <R extends void | {
        [key: string]: any;
    }, A = unknown>(fa: (env: R) => A): IO<R, A>;
    of<A_1>(a: A_1): IO<void | {
        [key: string]: any;
    }, A_1>;
    failure(t: Throwable): IO<void | {
        [key: string]: any;
    }, never>;
    success<A_2>(a: A_2): IO<void | {
        [key: string]: any;
    }, A_2>;
    async: {
        <R_1 extends void | {
            [key: string]: any;
        }, A_3 = unknown>(fa: (env: R_1) => A_3 | Promise<A_3>): IOAsync<R_1, A_3>;
        of<A_4>(a: A_4): IOAsync<void | {
            [key: string]: any;
        }, A_4>;
        failure(t: Throwable): IOAsync<void | {
            [key: string]: any;
        }, never>;
        success<A_5>(a: A_5): IOAsync<void | {
            [key: string]: any;
        }, A_5>;
    };
};
export { IO, IOAsync };
//# sourceMappingURL=io.d.ts.map