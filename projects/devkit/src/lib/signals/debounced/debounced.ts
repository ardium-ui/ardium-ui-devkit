import { signal, WritableSignal } from '@angular/core';

/**
 * A DebouncedSignal interface that extends WritableSignal<T> and includes debouncing behavior.
 */
export interface DebouncedSignal<T> extends WritableSignal<T> {
  readonly debounceTime: number;
}

/**
 * Creates a `WritableSignal` that delays updates to its value until there's a pause in updates, based on the debounce time specified.
 *
 * @param initialValue - The initial value of the signal.
 * @param debounceTime - The delay in milliseconds after the last update before applying the signal update.
 * @returns A `WritableSignal<T>` that debounces value updates based on the specified debounce time.
 */
export function debouncedSignal<T>(
  initialValue: T,
  debounceTime: number,
): DebouncedSignal<T> {
  const internalSignal = signal<T>(initialValue) as DebouncedSignal<T>;
  Object.assign(internalSignal, { debounceTime });

  let timeoutId: any = null;

  const originalSet = internalSignal.set;

  const setDebouncedValue = (value: T) => {
    // Clear the previous timeout if a new value is set before the debounce period ends
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout to update the signal after the debounce period
    timeoutId = setTimeout(() => {
      originalSet(value);
      timeoutId = null;
    }, debounceTime);
  };

  // Override the `set` method to include debouncing
  internalSignal.set = (value: T) => {
    setDebouncedValue(value);
  };
  internalSignal.update = (fn: (v: T) => T) => {
    setDebouncedValue(fn(internalSignal()));
  };

  return internalSignal;
}
