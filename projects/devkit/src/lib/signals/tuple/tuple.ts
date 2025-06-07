import { computed, Signal, signal, WritableSignal } from '@angular/core';

/**
 * A read-only tuple signal.
 */
export interface TupleSignal<T extends readonly unknown[]> extends Signal<T> {
  /**
   * Returns a signal for whether the tuple is empty (length 0).
   */
  readonly isEmpty: Signal<boolean>;
  /**
   * Computed signal that returns an array of tuple entries [index, value].
   */
  readonly entriesArray: Signal<{ [K in keyof T]: [K, T[K]] }[number][]>;
  /**
   * Returns the value at a given index.
   */
  getAt<I extends keyof T>(index: I): T[I];
}

/**
 * A writable tuple signal.
 */
export interface WritableTupleSignal<T extends readonly unknown[]>
  extends WritableSignal<T>,
    TupleSignal<T> {
  /**
   * Returns a read-only version of the tuple signal.
   */
  asReadonly(): TupleSignal<T>;
  /**
   * Sets the value at a given index.
   */
  setAt<I extends keyof T>(index: I, value: T[I]): void;
  /**
   * Updates the entire tuple with a function.
   */
  update(updateFn: (current: T) => T): void;
  /**
   * Updates the value at a given index with a function.
   */
  updateAt<I extends keyof T>(index: I, updateFn: (value: T[I]) => T[I]): void;
}

/**
 * Creates a tuple signal of a fixed length.
 */
export function tupleSignal<T extends readonly unknown[]>(
  initialValue: T,
): WritableTupleSignal<T> {
  // Clone initialValue for safety.
  const internalSignal = signal<T>([
    ...initialValue,
  ] as unknown as T) as WritableTupleSignal<T>;

  const _set = (internalSignal as unknown as WritableSignal<T>).set;
  const _update = internalSignal.update;
  const _asReadonly = internalSignal.asReadonly;

  internalSignal.set = (tuple: T) => _set([...tuple] as unknown as T);

  internalSignal.update = (updateFn: (current: T) => T) => {
    _update((current) => [...updateFn(current)] as unknown as T);
  };

  // Set by index (returns a new tuple).
  internalSignal.setAt = (index, value) => {
    internalSignal.update((current) => {
      const next = [...current] as unknown as T;
      (next[index as number] as any) = value;
      return next;
    });
  };

  // Update by index.
  internalSignal.updateAt = (index, updateFn) => {
    internalSignal.update((current) => {
      const next = [...current] as unknown as T;
      (next[index as number] as any) = updateFn(next[index as number] as any);
      return next;
    });
  };

  // Read-only API.
  internalSignal.asReadonly = () => {
    const readonlySignal = _asReadonly() as TupleSignal<T>;
    (readonlySignal as any).isEmpty = internalSignal.isEmpty;
    (readonlySignal as any).entriesArray = internalSignal.entriesArray;
    readonlySignal.getAt = internalSignal.getAt;
    return readonlySignal;
  };

  // Computed helpers.
  (internalSignal as any).isEmpty = computed(
    () => internalSignal().length === 0,
  );
  (internalSignal as any).entriesArray = computed(() => {
    const tuple = internalSignal();
    return tuple.map((value, index) => [index, value]) as {
      [K in keyof T]: [K, T[K]];
    }[number][];
  });

  internalSignal.getAt = <I extends keyof T>(index: I) =>
    internalSignal()[index as number] as T[I];

  return internalSignal;
}
