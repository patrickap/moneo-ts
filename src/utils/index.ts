export const isNil = (x: unknown): x is undefined | null => {
	if (x === null || x === undefined) {
		return true;
	}

	return false;
};

export const delay = async <T>(fn: () => Promise<T>, ms: number) => {
	return new Promise((resolve) => {
		const timeoutId = setTimeout(() => {
			resolve(void 0);
			clearTimeout(timeoutId);
		}, ms);
	}).then(() => fn());
};

export const timeout = async <T>(fn: () => Promise<T>, ms: number) => {
	let timeoutId: NodeJS.Timeout;

	const timeoutFn = () => {
		return new Promise((_, reject) => {
			timeoutId = setTimeout(() => reject(new Error("promise timed out")), ms);
		}) as Promise<T>;
	};

	return Promise.race([fn(), timeoutFn()]).then((result) => {
		clearTimeout(timeoutId);
		return result;
	});
};

export const cancel = <T>(fn: () => Promise<T>) => {
	const cancelFn = () => {
		return new Promise((_, reject) => reject(new Error("promise canceled")));
	};

	return Promise.race([fn(), cancelFn()]).then((result) => {
		return result;
	}) as Promise<never>;
};

export const memoize = <A extends unknown[] = unknown[], T = unknown>(
	fn: (...args: A) => T,
) => {
	const cache = new Map();
	return (...args: A) => {
		const key = JSON.stringify(args);
		return cache.has(key)
			? cache.get(key)
			: cache.set(key, fn(...args)) && cache.get(key);
	};
};
