export declare const isNil: (x: unknown) => x is undefined | null;
export declare const delay: <T>(fn: () => Promise<T>, ms: number) => Promise<T>;
export declare const timeout: <T>(fn: () => Promise<T>, ms: number) => Promise<T>;
export declare const cancel: <T>(fn: () => Promise<T>) => Promise<never>;
export declare const memoize: <A extends unknown[] = unknown[], T = unknown>(fn: (...args: A) => T) => (...args: A) => any;
