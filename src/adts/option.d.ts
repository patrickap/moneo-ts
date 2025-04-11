import { type Either } from "~/adts/either";
export interface Option<A> {
    ap: <B>(applicative: Option<(a: A) => B>) => Option<B>;
    map: <B>(f: (a: A) => B) => Option<B>;
    forEach: <B = void>(f: (a: A) => B) => Option<A>;
    flatMap: <B>(f: (a: A) => Option<B>) => Option<B>;
    isSome: () => this is Some<A>;
    isNone: () => this is None;
    orElse: <B>(alternative: Option<B>) => Option<A | B>;
    getOrElse: <B>(alternative: B) => A | B;
    getOrNull: () => A | null;
    getOrUndefined: () => A | undefined;
    get: () => A;
    fold: <B>(some: (a: A) => B, none: () => B) => B;
    match: <B, C>(pattern: {
        Some: (a: A) => B;
        None: () => C;
    }) => B | C;
    filter: (predicate: (a: A) => boolean) => Option<A>;
    transform: <B>(convert: (option: Option<A>) => B) => B;
    contains: (value: unknown) => boolean;
    equals: <B>(compare: Option<B>) => boolean;
    either: () => Either<null, A>;
    inspect: () => string;
}
export type Some<A> = Option<A>;
export type None = Option<never>;
export declare const Some: {
    <A>(a: A): Some<A>;
    of: /*elided*/ any;
};
export declare const None: None;
export declare function Option<A>(a: NonNullable<A>): Some<NonNullable<A>>;
export declare function Option<A>(a: undefined | null): None;
export declare function Option<A>(a: A | null): Option<NonNullable<A>>;
export declare function Option<A>(a: A | undefined): Option<NonNullable<A>>;
export declare namespace Option {
    var of: typeof Option;
    var some: {
        <A>(a: A): Some<A>;
        of: /*elided*/ any;
    };
    var none: None;
}
