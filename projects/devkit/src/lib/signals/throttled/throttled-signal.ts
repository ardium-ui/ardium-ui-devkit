import { signal, WritableSignal } from '@angular/core';

/**
 * A ThrottledSignal interface that extends WritableSignal<T> and includes throttling behavior.
 */
export interface ThrottledSignal<T> extends WritableSignal<T> {
  readonly throttleTime: number;
}

/**
 * Creates a `WritableSignal` that limits how often its value can be updated, using the throttle time specified.
 *
 * @param initialValue - The initial value of the signal.
 * @param throttleTime - The minimum delay in milliseconds between signal updates.
 * @returns A `WritableSignal<T>` that throttles value updates based on the specified throttle time.
 */
export function throttledSignal<T>(
  initialValue: T,
  throttleTime: number,
): ThrottledSignal<T> {
  const internalSignal = signal<T>(initialValue) as ThrottledSignal<T>;
  Object.assign(internalSignal, { throttleTime });

  let lastUpdate = 0;
  let queuedValue: T | undefined = undefined;
  let timeoutId: any = null;

  const originalSet = internalSignal.set;

  const setThrottledValue = (value: T) => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdate;

    // If the new value is different and enough time has passed, set it immediately
    if (timeSinceLastUpdate >= throttleTime && internalSignal() !== value) {
      lastUpdate = now;
      originalSet(value);

      queuedValue = undefined;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    } else {
      if (queuedValue === undefined) {
        queuedValue = value;
        timeoutId = setTimeout(() => {
          if (queuedValue !== null) {
            originalSet(queuedValue as T);
            lastUpdate = Date.now();
            queuedValue = undefined;
            timeoutId = null;
          }
        }, throttleTime - timeSinceLastUpdate);
      } else {
        queuedValue = value;
      }
    }
  };

  internalSignal.set = (value: T) => {
    setThrottledValue(value);
  };
  internalSignal.update = (fn: (v: T) => T) => {
    setThrottledValue(fn(internalSignal()));
  };

  return internalSignal;
}
