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
  let timeoutId: ReturnType<typeof setTimeout>;

  const timeoutFn = () => {
    return new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("promise timed out"));
      }, ms);
    }) as Promise<T>;
  };

  return Promise.race([fn(), timeoutFn()]).finally(() => clearTimeout(timeoutId));
};

export const cancel = <T>(_fn: () => Promise<T>): Promise<never> => {
  return Promise.reject(new Error("promise canceled"));
};

export const memoize = <A extends unknown[] = unknown[], T = unknown>(fn: (...args: A) => T) => {
  const cache = new Map();
  return (...args: A) => {
    const key = JSON.stringify(args);
    return cache.has(key) ? cache.get(key) : cache.set(key, fn(...args)) && cache.get(key);
  };
};
