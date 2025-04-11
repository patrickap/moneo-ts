import { expect, it } from "vitest";
import { Right } from "~/adts/either";

const g = (n: number) => Right(n + 1);
const f = (n: number) => Right(n * 2);

// unit(x).flatMap(f) ==== f(x)
it("should satisfy the left identity law", () => {
	const a = Right(10).flatMap(f).get();
	const b = f(10).get();
	expect(a).toBe(b);
});

// m.flatMap(unit) ==== m
it("should satisfy the right identity law", () => {
	const a = Right(10).flatMap(Right.of).get();
	const b = Right(10).get();
	expect(a).toBe(b);
});

// m.flatMap(f).flatMap(g) ==== m.flatMap(x => f(x).flatMap(g))
it("should satisfy the associativity law", () => {
	const a = Right(10).flatMap(g).flatMap(f).get();
	const b = Right(10)
		.flatMap((x) => g(x).flatMap(f))
		.get();
	expect(a).toBe(b);
});
