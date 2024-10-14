import {
  effect,
  inject,
  Injector,
  runInInjectionContext,
  signal,
  WritableSignal,
} from '@angular/core';

export interface PersistentSignal<T> extends WritableSignal<T> {
  readonly method: PersistentStorageMethod;
}

export const PersistentStorageMethod = {
  Cookies: 'cookies',
  LocalStorage: 'local-storage',
  SessionStorage: 'session-storage',
} as const;
export type PersistentStorageMethod =
  (typeof PersistentStorageMethod)[keyof typeof PersistentStorageMethod];

/**
 * Basic options for persisting the signal value.
 */
export interface PersistentSignalOptions {
  name: string;
  method: PersistentStorageMethod;
  expires?: Date | string;
  maxAge?: number;
  path?: string;
}

/**
 * Options for persisting the signal value with custom serialization and deserialization.
 */
export interface PersistentSignalOptionsWithSerialization<T>
  extends PersistentSignalOptions {
  serialize: (value: T) => string;
  deserialize: (value: string) => T;
}

/**
 * Creates a `WritableSignal` that persists its value using the specified storage method.
 *
 * @param initialValue - The initial value of the signal if no stored value is found.
 * @param options - Configuration options for persisting the signal's value.
 * @returns A `WritableSignal<T>` that persists its value using the specified storage method.
 */
export function persistentSignal<T extends string>(
  initialValue: T,
  options: PersistentSignalOptions,
): PersistentSignal<T>;

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
  options: PersistentSignalOptionsWithSerialization<T>,
): PersistentSignal<T>;

export function persistentSignal<T>(
  initialValue: T,
  options:
    | PersistentSignalOptions
    | PersistentSignalOptionsWithSerialization<T>,
): PersistentSignal<T> {
  const internalSignal = signal<T>(initialValue) as PersistentSignal<T>;
  Object.assign(internalSignal, { method: options.method });

  const storedValue = loadFromStorage(options);
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

function loadFromStorage<T>(
  options:
    | PersistentSignalOptions
    | PersistentSignalOptionsWithSerialization<T>,
): T | null {
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

  if (storedValue && 'deserialize' in options) {
    return options.deserialize(storedValue);
  }
  return storedValue as T | null;
}

function updateStorage<T>(
  options:
    | PersistentSignalOptions
    | PersistentSignalOptionsWithSerialization<T>,
  value: T,
): void {
  let valueToStore = value as unknown as string;
  if ('serialize' in options) {
    valueToStore = options.serialize(value);
  }

  if (options.method === PersistentStorageMethod.LocalStorage) {
    localStorage.setItem(options.name, valueToStore);
  } else if (options.method === PersistentStorageMethod.SessionStorage) {
    sessionStorage.setItem(options.name, valueToStore);
  } else if (options.method === PersistentStorageMethod.Cookies) {
    let cookieString = `${options.name}=${encodeURIComponent(valueToStore)}`;

    if (options.expires) {
      const expires =
        options.expires instanceof Date
          ? options.expires.toUTCString()
          : options.expires;
      cookieString += `; expires=${expires}`;
    }

    if (options.maxAge) {
      cookieString += `; max-age=${options.maxAge}`;
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    } else {
      cookieString += '; path=/';
    }

    document.cookie = cookieString;
  }
}
