import { expect, it } from "vitest";
import { IO } from "~/adts/io";

const g = (n: number) => IO(() => n + 1);
const f = (n: number) => IO(() => n * 2);

// unit(x).flatMap(f) ==== f(x)
it("should satisfy the left identity law", () => {
	const a = IO(() => 10)
		.flatMap(f)
		.run();
	const b = f(10).run();
	expect(a).toBe(b);
});

// m.flatMap(unit) ==== m
it("should satisfy the right identity law", () => {
	const a = IO(() => 10)
		.flatMap(IO.of)
		.run();
	const b = IO(() => 10).run();
	expect(a).toBe(b);
});

// m.flatMap(f).flatMap(g) ==== m.flatMap(x => f(x).flatMap(g))
it("should satisfy the associativity law", () => {
	const a = IO(() => 10)
		.flatMap(g)
		.flatMap(f)
		.run();
	const b = IO(() => 10)
		.flatMap((x) => g(x).flatMap(f))
		.run();
	expect(a).toBe(b);
});
