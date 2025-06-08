import { signal, Signal, WritableSignal } from '@angular/core';

/**
 * A read-only counter signal with computed helpers.
 */
export interface CounterSignal extends Signal<number> {
  /**
   * Returns true if the counter's value was not changed after resetting.
   */
  readonly isReset: Signal<boolean>;
  /**
   * Returns the current counter value (alias for signal()).
   */
  value(): number;
}

/**
 * A writable counter signal with mutation helpers and computed queries.
 */
export interface WritableCounterSignal
  extends WritableSignal<number>,
    CounterSignal {
  /**
   * Returns a read-only version of the counter signal.
   */
  asReadonly(): CounterSignal;
  /**
   * Increments the counter by a specified value (default: 1).
   * @param amount The value to increment by. Default is 1.
   */
  increment(amount?: number): void;
  /**
   * Decrements the counter by a specified value (default: 1).
   * @param amount The value to decrement by. Default is 1.
   */
  decrement(amount?: number): void;
  /**
   * Sets the counter to a specific value.
   * @param value The value to set the counter to.
   */
  set(value: number): void;
  /**
   * Updates the counter using an updater function.
   * @param updater A function that receives the current value and returns the new value.
   */
  update(updater: (current: number) => number): void;
  /**
   * Resets the counter to its base (initial) value.
   *
   * Base value is the initial value by default, and can be changed using {@link setBaseValue}.
   */
  reset(): void;
  /**
   * Sets the base value to be used when resetting the counter.
   */
  setBaseValue(value: number): void;
}

/**
 * Creates a writable, reactive counter signal with convenient helpers and computed queries.
 *
 * @param {number} [initial=0] The initial value of the counter.
 * @returns {WritableCounterSignal} A writable counter signal instance.
 *
 * @example
 * const count = counterSignal(10);
 * count.inc();     // 11
 * count.dec(2);    // 9
 * count.reset();   // 10
 * count.isPositive(); // true
 *
 * @remarks
 * - All mutations (inc, dec, set, reset) are fully reactive and create new signal values.
 * - Use `.asReadonly()` to obtain a safe, mutation-free signal for external use.
 * - Computed helpers (`isZero`, `isPositive`, `isNegative`) always reflect the latest value.
 */
export function counterSignal(initial = 0): WritableCounterSignal {
  const internalSignal = signal<number>(initial) as WritableCounterSignal;

  const isResetSignal = signal<boolean>(true);

  const _set = (internalSignal as unknown as WritableSignal<number>).set;
  const _update = internalSignal.update;
  const _asReadonly = internalSignal.asReadonly;

  let _initial = initial;

  // Native methods
  internalSignal.set = (value: number) => {
    _set(value);
    isResetSignal.set(false);
  };
  internalSignal.update = (updater: (current: number) => number) => {
    _update((current) => updater(current));
    isResetSignal.set(false);
  };

  // Counter methods
  internalSignal.increment = (amount: number = 1) => {
    internalSignal.update((val) => val + amount);
  };

  internalSignal.decrement = (amount: number = 1) => {
    internalSignal.update((val) => val - amount);
  };

  internalSignal.reset = () => {
    _set(_initial);
    isResetSignal.set(true);
  };

  internalSignal.setBaseValue = (value: number) => {
    _initial = value;
  };

  internalSignal.asReadonly = () => {
    const readonly = _asReadonly() as CounterSignal;
    (readonly.isReset as any) = internalSignal.isReset;
    readonly.value = internalSignal.value;
    return readonly;
  };

  internalSignal.value = internalSignal.asReadonly();

  (internalSignal.isReset as any) = isResetSignal.asReadonly();

  return internalSignal;
}
