const isNil = (x: any): x is undefined | null => {
  if (x === null || x === undefined) {
    return true;
  } else {
    return false;
  }
};

const withDelay = <T>(promise: () => Promise<T>) => {
  const delay = (ms: number) => {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve(void 0);
        clearTimeout(timeoutId);
      }, ms);
    }).then(() => promise());
  };
  return { delay, promise };
};

const withTimeout = <T>(promise: () => Promise<T>) => {
  const timeout = (ms: number) => {
    let timeoutId: NodeJS.Timeout;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('promise timed out')), ms);
    }) as Promise<T>;

    return Promise.race([promise(), timeoutPromise]).then((result) => {
      clearTimeout(timeoutId);
      return result;
    });
  };

  return { timeout, promise };
};

const withCancel = <T>(promise: () => Promise<T>) => {
  const cancel = () => {
    return Promise.race([
      promise(),
      new Promise((_, reject) => reject(new Error('promise canceled'))),
    ]).then((result) => {
      return result;
    }) as Promise<never>;
  };
  return { cancel, promise };
};

export { isNil, withDelay, withTimeout, withCancel };
