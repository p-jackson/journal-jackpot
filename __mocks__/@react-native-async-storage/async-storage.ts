// Synchronous AsyncStorage mock using immediate thenables
// Executes .then() callbacks synchronously, not as microtasks

const storage: Record<string, string> = {};

// Creates a thenable that executes callbacks immediately (synchronously)
function syncResolve<T>(value: T): Promise<T> {
  return {
    then(onFulfilled?: (v: T) => unknown) {
      const result = onFulfilled ? onFulfilled(value) : value;
      return syncResolve(result);
    },
    catch() {
      return syncResolve(value);
    },
    finally(onFinally?: () => void) {
      onFinally?.();
      return syncResolve(value);
    },
    [Symbol.toStringTag]: "Promise",
  } as Promise<T>;
}

export default {
  setItem: (key: string, value: string) => {
    storage[key] = value;
    return syncResolve(undefined);
  },
  getItem: (key: string) => {
    return syncResolve(storage[key] ?? null);
  },
  removeItem: (key: string) => {
    Reflect.deleteProperty(storage, key);
    return syncResolve(undefined);
  },
  clear: () => {
    Object.keys(storage).forEach((key) => Reflect.deleteProperty(storage, key));
    return syncResolve(undefined);
  },
  getAllKeys: () => {
    return syncResolve(Object.keys(storage));
  },
  multiGet: (keys: string[]) => {
    return syncResolve(keys.map((key) => [key, storage[key] ?? null]));
  },
  multiSet: (pairs: [string, string][]) => {
    pairs.forEach(([key, value]) => {
      storage[key] = value;
    });
    return syncResolve(undefined);
  },
  multiRemove: (keys: string[]) => {
    keys.forEach((key) => Reflect.deleteProperty(storage, key));
    return syncResolve(undefined);
  },
  mergeItem: (key: string, value: string) => {
    const existing = storage[key];
    if (existing) {
      storage[key] = JSON.stringify({
        ...JSON.parse(existing),
        ...JSON.parse(value),
      });
    } else {
      storage[key] = value;
    }
    return syncResolve(undefined);
  },
  multiMerge: (pairs: [string, string][]) => {
    pairs.forEach(([key, value]) => {
      const existing = storage[key];
      if (existing) {
        storage[key] = JSON.stringify({
          ...JSON.parse(existing),
          ...JSON.parse(value),
        });
      } else {
        storage[key] = value;
      }
    });
    return syncResolve(undefined);
  },
};
