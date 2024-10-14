import {
  effect,
  inject,
  Injector,
  runInInjectionContext,
  signal,
  WritableSignal
} from '@angular/core';

export interface PersistentSignal extends WritableSignal<string> {
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
 * Creates a `WritableSignal` that persists its value using the specified storage method.
 *
 * The `persistentSignal` function returns a `WritableSignal<string>` whose value is synchronized with
 * one of the persistent storage mechanisms: `localStorage`, `sessionStorage`, or cookies. This allows
 * the signal's value to be retained across page reloads or sessions, depending on the chosen method.
 *
 * @param initialValue - The initial value of the signal if no stored value is found.
 * @param options - Configuration options for persisting the signal's value.
 * @returns A `WritableSignal<string>` that persists its value using the specified storage method.
 */
export function persistentSignal(
  initialValue: string,
  options: {
    name: string;
    method: PersistentStorageMethod;
    expires?: Date | string;
    maxAge?: number;
    path?: string;
  },
): PersistentSignal {
  const internalSignal = signal<string>(initialValue) as PersistentSignal;

  Object.assign(internalSignal, { method: options.method });

  // Load value from storage
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

function loadFromStorage(options: {
  name: string;
  method: PersistentStorageMethod;
}): string | null {
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

  return storedValue;
}

function updateStorage(
  options: {
    name: string;
    method: PersistentStorageMethod;
    expires?: Date | string;
    maxAge?: number;
    path?: string;
  },
  value: string,
): void {
  if (options.method === PersistentStorageMethod.LocalStorage) {
    localStorage.setItem(options.name, value);
  } else if (options.method === PersistentStorageMethod.SessionStorage) {
    sessionStorage.setItem(options.name, value);
  } else if (options.method === PersistentStorageMethod.Cookies) {
    let cookieString = `${options.name}=${encodeURIComponent(value)}`;

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
