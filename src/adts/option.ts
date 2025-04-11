import { type InspectOptions, inspect } from "node:util";
import { type Either, Left, Right } from "~/adts/either";
import { isNil } from "~/utils";

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
	match: <B, C>(pattern: { Some: (a: A) => B; None: () => C }) => B | C;
	filter: (predicate: (a: A) => boolean) => Option<A>;
	transform: <B>(convert: (option: Option<A>) => B) => B;
	contains: (value: unknown) => boolean;
	equals: <B>(compare: Option<B>) => boolean;
	either: () => Either<null, A>;
	inspect: (options?: InspectOptions) => string;
}

export type Some<A> = Option<A>;

export type None = Option<never>;

export const Some = <A>(a: A): Some<A> => ({
	ap: (applicative) => applicative.map((f) => f(a)),
	map: (f) => Some(f(a)),
	forEach: (f) => {
		f(a);
		return Some(a);
	},
	flatMap: (f) => f(a),
	isSome: (): this is Some<A> => true,
	isNone: (): this is None => false,
	orElse: (_) => Some(a),
	getOrElse: (_) => a,
	getOrNull: () => a,
	getOrUndefined: () => a,
	get: () => a,
	fold: (some, _) => some(a),
	match: ({ Some }) => Some(a),
	filter: (predicate) => (predicate(a) ? Some(a) : None),
	transform: (convert) => convert(Some(a)),
	contains: (value) => a === value,
	equals: (compare) => compare.isSome() && compare.contains(a),
	either: () => Right(a),
	inspect: (options) => `Some(${inspect(a, options)})`,
});

Some.of = Some;

export const None: None = {
	ap: (_) => None,
	map: (_) => None,
	forEach: (_) => None,
	flatMap: (_) => None,
	isSome: (): this is Some<never> => false,
	isNone: (): this is None => true,
	orElse: (alternative) => alternative,
	getOrElse: (alternative) => alternative,
	getOrNull: () => null,
	getOrUndefined: () => void 0,
	get: () => {
		throw Error("could not get value of type none");
	},
	fold: (_, none) => none(),
	match: ({ None }) => None(),
	filter: (_) => None,
	transform: (convert) => convert(None),
	contains: (_) => false,
	equals: (compare) => compare.isNone(),
	either: () => Left(null),
	inspect: () => "None",
};

export function Option<A>(a: NonNullable<A>): Some<NonNullable<A>>;
export function Option<A>(a: undefined | null): None;
export function Option<A>(a: A | null): Option<NonNullable<A>>;
export function Option<A>(a: A | undefined): Option<NonNullable<A>>;
export function Option<A>(a: A | undefined | null): Option<NonNullable<A>> {
	return isNil(a) ? None : !isNil(a) ? Some(a as NonNullable<A>) : Option(a);
}

Option.of = Option;
Option.some = Some;
Option.none = None;
