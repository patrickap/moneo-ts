import { Option } from '../option';
interface Either<L, R> {
    ap: <R2>(applicative: Either<L, (r: R) => R2>) => Either<L, R2>;
    map: <R2>(f: (r: R) => R2) => Either<L, R2>;
    flatMap: <L2, R2>(f: (r: R) => Either<L2, R2>) => Either<L | L2, R | R2>;
    isLeft: () => this is Left<L>;
    isRight: () => this is Right<R>;
    orElse: <L2, R2>(alternative: Either<L2, R2>) => Either<L | L2, R | R2>;
    getOrElse: <R2>(alternative: R2) => R | R2;
    getOrNull: () => R | null;
    getOrUndefined: () => R | undefined;
    get: () => R;
    fold: <LR>(right: (r: R) => LR, left: (l: L) => LR) => LR;
    match: <L2, R2>(pattern: {
        Right: (r: R) => R2;
        Left: (l: L) => L2;
    }) => L2 | R2;
    filter: (predicate: (r: R) => boolean) => Either<L | null, R>;
    transform: <B>(convert: (either: Either<L, R>) => B) => B;
    contains: (value: any) => boolean;
    equals: <L2, R2>(compare: Either<L2, R2>) => boolean;
    swap: () => Either<R, L>;
    option: () => Option<R>;
    inspect: () => string;
}
declare type Left<L> = Either<L, never>;
declare type Right<R> = Either<never, R>;
declare const Left: {
    <L>(l: L): Left<L>;
    of: any;
};
declare const Right: {
    <R>(r: R): Right<R>;
    of: any;
};
declare const Either: {
    left: {
        <L>(l: L): Left<L>;
        of: any;
    };
    right: {
        <R>(r: R): Right<R>;
        of: any;
    };
};
export { Either, Left, Right };
//# sourceMappingURL=either.d.ts.map