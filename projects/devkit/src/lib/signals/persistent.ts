import { signal, Signal } from '@angular/core';

export interface PersistentSignal {
  (): string;
  call(): string;
  set: (value: string) => void;
  update: (updaterFn: (oldValue: string) => string) => void;
  asReadonly: () => Signal<string>;
  toString: () => string;
  readonly method: PersistentStorageMethod;
}

export const PersistentStorageMethod = {
  Cookies: 'cookies',
  LocalStorage: 'local-storage',
  SessionStorage: 'session-storage',
} as const;
export type PersistentStorageMethod =
  (typeof PersistentStorageMethod)[keyof typeof PersistentStorageMethod];

export function persistentSignal(
  name: string,
  method: PersistentStorageMethod,
): PersistentSignal;
export function persistentSignal(
  name: string,
  method: 'cookies',
  options?: { expires?: Date | string; maxAge?: number; path?: string },
): PersistentSignal;
export function persistentSignal(
  name: string,
  method: PersistentStorageMethod,
  cookieOptions?: { expires?: Date | string; maxAge?: number; path?: string },
): PersistentSignal {
  return new _PersistentSignal(name, method, cookieOptions) as unknown as PersistentSignal;
}

class _PersistentSignal implements Omit<PersistentSignal, '()'> {
  private readonly _signal = signal<string>('');

  constructor(
    private readonly name: string,
    public readonly method: PersistentStorageMethod,
    private readonly cookieOptions?: {
      expires?: Date | string;
      maxAge?: number;
      path?: string;
    },
  ) {
    this._loadFromStorage();
  }

  private _loadFromStorage() {
    let storedValue: string | null = null;

    if (this.method === PersistentStorageMethod.LocalStorage) {
      storedValue = localStorage.getItem(this.name);
    } else if (this.method === PersistentStorageMethod.SessionStorage) {
      storedValue = sessionStorage.getItem(this.name);
    } else if (this.method === PersistentStorageMethod.Cookies) {
      const match = document.cookie.match(
        '(^|;)\\s*' + this.name + '\\s*=\\s*([^;]+)',
      );
      storedValue = match ? decodeURIComponent(match[2]) : null;
    }

    if (storedValue !== null) {
      this._signal.set(storedValue);
    }
  }

  private _updateStorage() {
    const value = this._signal();

    if (this.method === PersistentStorageMethod.LocalStorage) {
      localStorage.setItem(this.name, value);
    } else if (this.method === PersistentStorageMethod.SessionStorage) {
      sessionStorage.setItem(this.name, value);
    } else if (this.method === PersistentStorageMethod.Cookies) {
      let cookieString = `${this.name}=${encodeURIComponent(value)}`;

      if (this.cookieOptions?.expires) {
        const expires =
          this.cookieOptions.expires instanceof Date
            ? this.cookieOptions.expires.toUTCString()
            : this.cookieOptions.expires;
        cookieString += `; expires=${expires}`;
      }

      if (this.cookieOptions?.maxAge) {
        cookieString += `; max-age=${this.cookieOptions.maxAge}`;
      }

      if (this.cookieOptions?.path) {
        cookieString += `; path=${this.cookieOptions.path}`;
      } else {
        cookieString += '; path=/';
      }

      document.cookie = cookieString;
    }
  }

  call = this._signal.call as () => string;
  set(value: string) {
    this._signal.set(value);
    this._updateStorage();
  }
  update(updaterFn: (oldValue: string) => string) {
    this._signal.update(updaterFn);
    this._updateStorage();
  }
  asReadonly() {
    return this._signal.asReadonly();
  }
  toString() {
    return this._signal.toString();
  }
}
