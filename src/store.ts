interface StoreMethods<T> {
  get(): T;
  set(value: T): T;
  update(callback: (value: T) => T): T;
}

export const createStore = <T, U>(
  defaultValue: T,
  callback: (self: StoreMethods<T>) => U,
): StoreMethods<T> & U => {
  let storeValue = defaultValue;

  const get = (): T => {
    return storeValue;
  };
  const set = (value: T): T => {
    storeValue = value;
    return get();
  };
  const update = (callback: (value: T) => T): T => {
    return set(callback(storeValue));
  };

  const defaultMethods: StoreMethods<T> = { get, set, update };

  return {
    ...defaultMethods,
    ...callback(defaultMethods),
  };
};
