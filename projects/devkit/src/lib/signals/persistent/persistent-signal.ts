import {
  effect,
  inject,
  Injector,
  runInInjectionContext,
  signal,
  WritableSignal,
} from '@angular/core';
import { isAnyString, isNull } from 'simple-bool';

/**
 * A `PersistentSignal` is a specialized type of `WritableSignal` that automatically persists its value using a specified storage method (localStorage, sessionStorage, or cookies). It extends the standard `WritableSignal` interface by including additional properties to define the persistence mechanism and key used for storage. The `PersistentSignal` ensures that any changes to its value are saved to the chosen storage method, and it initializes its value from storage if available when created.
 */
export interface PersistentSignal<T> extends WritableSignal<T> {
  readonly method: PersistentStorageMethod;
  readonly key: string;
}

/**
 * Defines the available persistent storage methods for the `persistentSignal`. Each method corresponds to a different browser storage mechanism:
 * - `PersistentStorageMethod.LocalStorage`: Uses the browser's localStorage to persist the value across sessions.
 * - `PersistentStorageMethod.SessionStorage`: Uses the browser's sessionStorage to persist the value for the duration of the page session.
 * - `PersistentStorageMethod.Cookies`: Uses browser cookies to persist the value, allowing for additional options like expiration and path.
 */
export const PersistentStorageMethod = {
  Cookies: 'cookies',
  LocalStorage: 'local-storage',
  SessionStorage: 'session-storage',
} as const;
/**
 * Defines the available persistent storage methods for the `persistentSignal`. Each method corresponds to a different browser storage mechanism:
 * - `PersistentStorageMethod.LocalStorage`: Uses the browser's localStorage to persist the value across sessions.
 * - `PersistentStorageMethod.SessionStorage`: Uses the browser's sessionStorage to persist the value for the duration of the page session.
 * - `PersistentStorageMethod.Cookies`: Uses browser cookies to persist the value, allowing for additional options like expiration and path.
 */
export type PersistentStorageMethod =
  (typeof PersistentStorageMethod)[keyof typeof PersistentStorageMethod];

/**
 * Options for persisting the signal value.
 */
export interface PersistentSignalOptions<T> {
  /**
   * @deprecated Use `key` instead. The name/key used to store the signal value in the chosen storage method.
   */
  name: string;
  /**
   * The name/key used to store the signal value in the chosen storage method.
   */
  key: string;
  /**
   * The persistent storage method to use for storing the signal value. Options include:
   * - `PersistentStorageMethod.LocalStorage`: Uses the browser's localStorage to persist the value across sessions.
   * - `PersistentStorageMethod.SessionStorage`: Uses the browser's sessionStorage to persist the value for the duration of the page session.
   * - `PersistentStorageMethod.Cookies`: Uses browser cookies to persist the value, allowing for additional options like expiration and path.
   */
  method: PersistentStorageMethod;
  /**
   * Cookie-specific option: Defines the expiration date of the cookie. Can be a `Date` object or a string in UTC format. If not specified, the cookie will be a session cookie and will expire when the browser is closed.
   */
  expires?: Date | string;
  /**
   * Cookie-specific option: Defines the maximum age of the cookie in seconds. If both `expires` and `maxAge` are specified, `maxAge` takes precedence. If not specified, the cookie will be a session cookie and will expire when the browser is closed.
   */
  maxAge?: number;
  /**
   * Cookie-specific option: Defines the path for which the cookie is valid. Defaults to `'/'`, making the cookie accessible across the entire site. If set to a specific path, the cookie will only be sent to the server for requests matching that path.
   */
  path?: string;

  /**
   * Optional serialization function to convert the signal value into a string for storage. This is required if the signal value is not a string or if you want to customize the serialization format. The function should return a string representation of the value, or `null` if the value is `null`.
   * @param value The value to serialize, which can be of type `T` or `null`.
   * @returns A string representation of the value for storage, or `null` if the value is `null`.
   */
  serialize?: (value: T | null) => string | null;
  /**
   * Optional deserialization function to convert the stored string value back into the original type `T`. This is required if a custom `serialize` function is provided, or if the initial value is not a string and serialization options are not defined. The function should return the deserialized value of type `T`, or `null` if the input value is `null`.
   * @param value The string value retrieved from storage that needs to be deserialized back into the original type `T`. This function is required if a custom `serialize` function is provided, or if the initial value is not a string and serialization options are not defined. The function should return the deserialized value of type `T`, or `null` if the input value is `null`.
   * @returns The deserialized value of type `T`, or `null` if the input value is `null`.
   */
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
): PersistentSignal<T> {
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

  const internalSignal = signal<T>(initialValue) as PersistentSignal<T>;
  Object.assign(internalSignal, {
    method: options.method,
    key: options.name,
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
