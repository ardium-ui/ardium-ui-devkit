import {
    effect,
    inject,
    Injector,
    runInInjectionContext,
    signal,
    WritableSignal,
} from '@angular/core';
import { isAnyString, isNull } from 'simple-bool';

export interface PersistentSignal<T> extends WritableSignal<T> {
  readonly method: PersistentStorageMethod;
  readonly key: string;
  clear(): void;
}

export const PersistentStorageMethod = {
  Cookies: 'cookies',
  LocalStorage: 'local-storage',
  SessionStorage: 'session-storage',
} as const;
export type PersistentStorageMethod =
  (typeof PersistentStorageMethod)[keyof typeof PersistentStorageMethod];

/**
 * Options for persisting the signal value.
 */
export interface PersistentSignalOptions<T> {
  name: string;
  method: PersistentStorageMethod;
  expires?: Date | string;
  maxAge?: number;
  path?: string;
  serialize?: (value: T | null) => string | null;
  deserialize?: (value: string) => T | null;
}

function isSerializableSignal<T>(
  options: PersistentSignalOptions<T>,
): options is Required<PersistentSignalOptions<T>> {
  return !!options.serialize && !!options.deserialize;
}

/**
 * Creates a `WritableSignal` that persists its value using the specified storage method,
 * with custom serialization and deserialization.
 *
 * @param initialValue - The initial value of the signal if no stored value is found.
 * @param options - An object containing the storage method and custom serialization/deserialization functions.
 * @param options.name - The key used to store the signal value.
 * @param options.method - The persistent storage method (localStorage, sessionStorage, or cookies).
 * @param options.serialize - A function to serialize the value into a string for storage.
 * @param options.deserialize - A function to deserialize the stored string value back into the original type.
 * @returns A `WritableSignal<T>` that persists its value using the specified storage method.
 */
export function persistentSignal<T>(
  initialValue: T,
  options: PersistentSignalOptions<T>,
): PersistentSignal<T | null> {
  if (!!options.serialize !== !!options.serialize) {
    throw new Error(
      'DKT-FT3000: Both serialize and deserialize must either be both defined or both undefined.',
    );
  }
  if (
    !isSerializableSignal(options) &&
    !isAnyString(initialValue) &&
    !isNull(initialValue)
  ) {
    throw new Error(
      'DKT-FT3001: Non-string initial values are only allowed for serializable signals. Define serialization options.',
    );
  }

  const internalSignal = signal<T | null>(
    initialValue,
  ) as PersistentSignal<T | null>;
  Object.assign(internalSignal, {
    method: options.method,
    key: options.name,
    clear: () => internalSignal.set(null),
  });

  const storedValue = loadFromStorage<T>(options);
  if (storedValue !== null) {
    internalSignal.set(storedValue);
  } else {
    updateStorage(options, internalSignal());
  }

  const injector = inject(Injector);

  runInInjectionContext(injector, () => {
    effect(() => {
      const value = internalSignal();
      updateStorage(options, value);
    });
  });

  return internalSignal;
}

function loadFromStorage<T>(options: PersistentSignalOptions<T>): T | null {
  let storedValue: string | null = null;

  if (options.method === PersistentStorageMethod.LocalStorage) {
    storedValue = localStorage.getItem(options.name);
  } else if (options.method === PersistentStorageMethod.SessionStorage) {
    storedValue = sessionStorage.getItem(options.name);
  } else if (options.method === PersistentStorageMethod.Cookies) {
    const match = document.cookie.match(
      '(^|;)\\s*' + options.name + '\\s*=\\s*([^;]+)',
    );
    storedValue = match ? decodeURIComponent(match[2]) : null;
  }
  return deserializeValue(storedValue, options);
}

function updateStorage<T>(
  options: PersistentSignalOptions<T>,
  value: T | null,
): void {
  const serializedValue = serializeValue(value, options);

  if (options.method === PersistentStorageMethod.LocalStorage) {
    if (serializedValue === null) localStorage.removeItem(options.name);
    else localStorage.setItem(options.name, serializedValue);
  } else if (options.method === PersistentStorageMethod.SessionStorage) {
    if (serializedValue === null) sessionStorage.removeItem(options.name);
    else sessionStorage.setItem(options.name, serializedValue);
  } else if (options.method === PersistentStorageMethod.Cookies) {
    let cookieString = `${options.name}=${serializedValue !== null ? encodeURIComponent(serializedValue) : ''}`;

    if (serializedValue !== null) {
      cookieString += `; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    } else if (options.expires) {
      const expires =
        options.expires instanceof Date
          ? options.expires.toUTCString()
          : options.expires;
      cookieString += `; expires=${expires}`;
    }

    if (options.maxAge) {
      cookieString += `; max-age=${options.maxAge}`;
    }

    cookieString += `; path=${options.path ?? '/'}`;

    document.cookie = cookieString;
  }
}

function serializeValue<T>(
  value: T | null,
  options: PersistentSignalOptions<T>,
): string | null {
  if (isSerializableSignal(options)) {
    return options.serialize(value);
  }
  return value === null ? null : (value as unknown as string);
}

function deserializeValue<T>(
  value: string | null,
  options: PersistentSignalOptions<T>,
): T | null {
  if (value !== null && isSerializableSignal(options)) {
    return options.deserialize(value);
  }
  return value as unknown as T | null;
}
