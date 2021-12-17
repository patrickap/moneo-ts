import { Either } from '../either';
interface Option<A> {
    ap: <B>(applicative: Option<(a: A) => B>) => Option<B>;
    map: <B>(f: (a: A) => B) => Option<B>;
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
    contains: (value: any) => boolean;
    equals: <B>(compare: Option<B>) => boolean;
    either: () => Either<null, A>;
    inspect: () => string;
}
declare type Some<A> = Option<A>;
declare type None = Option<never>;
declare const Some: {
    <A>(a: A): Some<A>;
    of: any;
};
declare const None: None;
declare function Option<A>(a: NonNullable<A>): Some<NonNullable<A>>;
declare namespace Option {
    var of: typeof Option;
    var some: {
        <A>(a: A): Some<A>;
        of: any;
    };
    var none: None;
}
declare function Option<A>(a: undefined | null): None;
declare namespace Option {
    var of: typeof Option;
    var some: {
        <A>(a: A): Some<A>;
        of: any;
    };
    var none: None;
}
declare function Option<A>(a: A | null): Option<NonNullable<A>>;
declare namespace Option {
    var of: typeof Option;
    var some: {
        <A>(a: A): Some<A>;
        of: any;
    };
    var none: None;
}
declare function Option<A>(a: A | undefined): Option<NonNullable<A>>;
declare namespace Option {
    var of: typeof Option;
    var some: {
        <A>(a: A): Some<A>;
        of: any;
    };
    var none: None;
}
export { Option, Some, None };
//# sourceMappingURL=option.d.ts.map