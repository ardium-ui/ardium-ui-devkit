import { computed, Signal, signal, WritableSignal } from '@angular/core';

/**
 * A read-only stack signal, providing non-mutating helpers and computed properties.
 * @template T The type of elements held in the stack.
 */
export interface StackSignal<T> extends Signal<T[]> {
  /**
   * A signal that returns `true` if the stack is empty.
   */
  readonly isEmpty: Signal<boolean>;
  /**
   * A signal that returns the current number of items in the stack.
   */
  readonly size: Signal<number>;
  /**
   * A signal that returns the top (last) item of the stack, or `undefined` if the stack is empty. Does not remove it.
   */
  readonly top: Signal<T | undefined>;
  /**
   * A signal that returns a shallow copy of the stack as an array.
   */
  readonly asArray: Signal<T[]>;
  /**
   * Returns the top item in the stack, or `undefined` if the stack is empty. Does not remove it.
   * @returns The top item or `undefined`.
   */
  peek(): T | undefined;
}

/**
 * A writable stack signal, providing mutating and non-mutating helpers.
 * @template T The type of elements held in the stack.
 */
export interface WritableStackSignal<T>
  extends WritableSignal<T[]>,
    StackSignal<T> {
  /**
   * Returns a read-only version of the stack signal.
   * @returns A read-only {@link StackSignal} instance.
   */
  asReadonly(): StackSignal<T>;
  /**
   * Pushes one or more items onto the top of the stack.
   * @param items - The elements to push onto the stack.
   */
  push(...items: T[]): void;
  /**
   * Removes and returns the top item of the stack. If the stack is empty, returns `undefined`.
   * @returns The popped item, or `undefined` if the stack was empty.
   */
  pop(): T | undefined;
  /**
   * Clears all items from the stack.
   */
  clear(): void;
  /**
   * Replaces the stack with a new array of items.
   * @param value - The new array to set as the stack.
   */
  set(value: T[]): void;
  /**
   * Updates the stack using the provided update function.
   * @param updateFn - Function that receives the current stack and returns a new stack.
   */
  update(updateFn: (current: T[]) => T[]): void;
}

/**
 * Creates a writable stack signal, which is a reactive stack data structure.
 *
 * @template T The type of elements held in the stack.
 * @param {T[]} [initialValue=[]] Optional initial items in the stack.
 * @returns {WritableStackSignal<T>} The writable stack signal instance.
 *
 * @example
 * const stack = stackSignal<number>([1, 2, 3]);
 * stack.push(4);
 * const value = stack.pop(); // 4
 * stack.clear();
 */
export function stackSignal<T>(initialValue: T[] = []): WritableStackSignal<T> {
  const internalSignal = signal<T[]>([
    ...initialValue,
  ]) as unknown as WritableStackSignal<T>;

  const _set = (internalSignal as unknown as WritableSignal<T[]>).set;
  const _update = internalSignal.update;
  const _asReadonly = internalSignal.asReadonly;

  // Native methods
  internalSignal.set = (arr: T[]) => _set([...arr]);
  internalSignal.update = (updateFn: (current: T[]) => T[]) => {
    _update((current) => [...updateFn(current)]);
  };

  // Stack methods
  internalSignal.push = (...items: T[]) => {
    internalSignal.update((stack) => [...stack, ...items]);
  };

  internalSignal.pop = (): T | undefined => {
    let popped: T | undefined = undefined;
    internalSignal.update((stack) => {
      if (stack.length === 0) return stack;
      const copy = [...stack];
      popped = copy.pop();
      return copy;
    });
    return popped;
  };

  internalSignal.clear = () => {
    internalSignal.set([]);
  };

  (internalSignal.isEmpty as any) = computed(
    () => internalSignal().length === 0,
  );

  (internalSignal.size as any) = computed(() => internalSignal().length);

  (internalSignal.top as any) = computed(() => {
    const stack = internalSignal();
    return stack.length ? stack[stack.length - 1] : undefined;
  });

  (internalSignal.asArray as any) = computed(() => [...internalSignal()]);

  internalSignal.peek = () => {
    const stack = internalSignal();
    return stack.length ? stack[stack.length - 1] : undefined;
  };

  internalSignal.asReadonly = () => {
    const readonlySignal = _asReadonly() as StackSignal<T>;
    (readonlySignal.isEmpty as any) = internalSignal.isEmpty;
    (readonlySignal.size as any) = internalSignal.size;
    (readonlySignal.top as any) = internalSignal.top;
    (readonlySignal.asArray as any) = internalSignal.asArray;
    readonlySignal.peek = internalSignal.peek;
    return readonlySignal;
  };

  return internalSignal;
}
