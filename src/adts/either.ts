import { type InspectOptions, inspect } from "node:util";
import { None, type Option, Some } from "~/adts/option";

export interface Either<L, R> {
	ap: <R2>(applicative: Either<L, (r: R) => R2>) => Either<L, R2>;
	map: <R2>(f: (r: R) => R2) => Either<L, R2>;
	forEach: <R2 = void>(f: (r: R) => R2) => Either<L, R>;
	flatMap: <L2, R2>(f: (r: R) => Either<L2, R2>) => Either<L | L2, R2>;
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
	contains: (value: unknown) => boolean;
	equals: <L2, R2>(compare: Either<L2, R2>) => boolean;
	swap: () => Either<R, L>;
	option: () => Option<R>;
	inspect: (options?: InspectOptions) => string;
}

export type Left<L> = Either<L, never>;

export type Right<R> = Either<never, R>;

export const Left = <L>(l: L): Left<L> => ({
	ap: (_) => Left(l),
	map: (_) => Left(l),
	forEach: (_) => Left(l),
	flatMap: (_) => Left(l),
	isLeft: (): this is Left<L> => true,
	isRight: (): this is Right<never> => false,
	orElse: (alternative) => alternative,
	getOrElse: (alternative) => alternative,
	getOrNull: () => null,
	getOrUndefined: () => void 0,
	get: () => {
		throw Error("could not get value of type left");
	},
	fold: (_, left) => left(l),
	match: ({ Left }) => Left(l),
	filter: (_) => Left(l),
	transform: (convert) => convert(Left(l)),
	contains: (value) => l === value,
	equals: (compare) => compare.isLeft() && compare.contains(l),
	swap: () => Right(l),
	option: () => None,
	inspect: (options) => `Left(${inspect(l, options)})`,
});

Left.of = Left;

export const Right = <R>(r: R): Right<R> => ({
	ap: (applicative) => applicative.map((f) => f(r)),
	map: (f) => Right(f(r)),
	forEach: (f) => {
		f(r);
		return Right(r);
	},
	flatMap: (f) => f(r),
	isLeft: (): this is Left<never> => false,
	isRight: (): this is Right<R> => true,
	orElse: (_) => Right(r),
	getOrElse: (_) => r,
	getOrNull: () => r,
	getOrUndefined: () => r,
	get: () => r,
	fold: (right, _) => right(r),
	match: ({ Right }) => Right(r),
	filter: (predicate) => (predicate(r) ? Right(r) : Left(null)),
	transform: (convert) => convert(Right(r)),
	contains: (value) => r === value,
	equals: (compare) => compare.isRight() && compare.contains(r),
	swap: () => Left(r),
	option: () => Some(r),
	inspect: (options) => `Right(${inspect(r, options)})`,
});

Right.of = Right;

export const Either = {
	left: Left,
	right: Right,
};
