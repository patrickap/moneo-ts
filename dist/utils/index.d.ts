declare const isNil: (x: any) => x is null | undefined;
declare const withDelay: <T>(promise: () => Promise<T>) => {
    delay: (ms: number) => Promise<T>;
    promise: () => Promise<T>;
};
declare const withTimeout: <T>(promise: () => Promise<T>) => {
    timeout: (ms: number) => Promise<T>;
    promise: () => Promise<T>;
};
declare const withCancel: <T>(promise: () => Promise<T>) => {
    cancel: () => Promise<never>;
    promise: () => Promise<T>;
};
export { isNil, withDelay, withTimeout, withCancel };
//# sourceMappingURL=index.d.ts.map