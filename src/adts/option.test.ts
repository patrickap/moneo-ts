import { expect, it } from "vitest";
import { Option } from "~/adts/option";

const g = (n: number) => Option(n + 1);
const f = (n: number) => Option(n * 2);

// unit(x).flatMap(f) ==== f(x)
it("should satisfy the left identity law", () => {
	const a = Option(10).flatMap(f).get();
	const b = f(10).get();
	expect(a).toBe(b);
});

// m.flatMap(unit) ==== m
it("should satisfy the right identity law", () => {
	const a = Option(10).flatMap(Option.of).get();
	const b = Option(10).get();
	expect(a).toBe(b);
});

// m.flatMap(f).flatMap(g) ==== m.flatMap(x => f(x).flatMap(g))
it("should satisfy the associativity law", () => {
	const a = Option(10).flatMap(g).flatMap(f).get();
	const b = Option(10)
		.flatMap((x) => g(x).flatMap(f))
		.get();
	expect(a).toBe(b);
});
