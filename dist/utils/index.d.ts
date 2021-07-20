declare const isNil: (x: any) => x is null | undefined;
declare const isFunction: (x: any) => x is Function;
declare const isPromise: (x: any) => x is Promise<any>;
declare const toPromise: <T>(fn: () => T) => Promise<T>;
declare const withDelay: <T>(promise: () => Promise<T>) => {
    delay: (ms: number) => Promise<T>;
};
declare const withTimeout: <T>(promise: () => Promise<T>) => {
    timeout: (ms: number) => Promise<T>;
};
declare const withCancel: <T>(promise: () => Promise<T>) => {
    cancel: () => Promise<never>;
};
export { isNil, isFunction, isPromise, toPromise, withDelay, withTimeout, withCancel, };
//# sourceMappingURL=index.d.ts.map