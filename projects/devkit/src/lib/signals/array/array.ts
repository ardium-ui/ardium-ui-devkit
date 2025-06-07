import { computed, Signal, signal, WritableSignal } from '@angular/core';

/**
 * A read-only array signal with non-mutating methods.
 */
export interface ArraySignal<T> extends Signal<T[]> {
  /**
   * A computed signal that returns `true` if the array is empty.
   */
  readonly isEmpty: Signal<boolean>;
}

/**
 * A writable array signal with mutating and non-mutating methods.
 */
export interface WritableArraySignal<T> extends WritableSignal<T[]> {
  /**
   * A computed signal that returns `true` if the array is empty.
   */
  readonly isEmpty: Signal<boolean>;

  /**
   * Returns a read-only version of the array signal.
   */
  asReadonly(): ArraySignal<T>;

  /**
   * Fills all the elements of the array signal from a start index to an end index with a static value.
   * @param value - The value to fill the array with.
   * @param start - The start index (inclusive). Defaults to 0.
   * @param end - The end index (exclusive). Defaults to array length.
   */
  fill(value: T, start?: number, end?: number): void;

  /**
   * Filters the array based on a predicate function and updates the signal with the filtered result.
   * @param predicate - Function to test each element of the array.
   */
  filter(predicate: (value: T, index: number, array: T[]) => boolean): void;

  /**
   * Applies a mapping function to each element in the array and updates the signal with the result.
   * @param mapFn - Function that produces an element of the new array.
   */
  map(mapFn: (value: T, index: number, array: T[]) => T): void;

  /**
   * Removes the last element from the array and returns it.
   * Updates the signal.
   * @returns The removed element, or undefined if the array was empty.
   */
  pop(): T | undefined;

  /**
   * Appends new elements to the end of the array and returns the new length.
   * Updates the signal.
   * @param items - The elements to add.
   * @returns The new length of the array.
   */
  push(...items: T[]): number;

  /**
   * Reverses the order of the elements in the array and updates the signal.
   */
  reverse(): void;

  /**
   * Replaces the entire array with a new array value.
   * @param value - The new array value.
   */
  set(value: T[]): void;

  /**
   * Replaces the item at the given index with the new item.
   * @param index - The index where the item should be replaced.
   * @param newItem - The new item to be set at the given index.
   */
  setAt(index: number, newItem: T): void;

  /**
   * Removes the first element from the array and returns it.
   * Updates the signal.
   * @returns The removed element, or undefined if the array was empty.
   */
  shift(): T | undefined;

  /**
   * Sorts the elements of the array in place and updates the signal.
   * @param compareFn - Specifies a function that defines the sort order.
   */
  sort(compareFn?: (a: T, b: T) => number): void;

  /**
   * Changes the contents of the array by removing or replacing existing elements and/or adding new elements.
   * Updates the signal.
   * @param start - The index at which to start changing the array.
   * @param deleteCount - The number of elements to remove.
   * @param items - Elements to add to the array.
   * @returns An array containing the deleted elements.
   */
  splice(start: number, deleteCount?: number, ...items: T[]): T[];

  /**
   * Adds one or more elements to the beginning of the array and returns the new length.
   * Updates the signal.
   * @param items - The elements to add.
   * @returns The new length of the array.
   */
  unshift(...items: T[]): number;

  /**
   * Updates the array signal based on a provided update function.
   * @param updateFn - A function that receives the current array and returns the updated array.
   */
  update(updateFn: (value: T[]) => T[]): void;

  /**
   * Updates the item at the given index by applying the update function.
   * @param index - The index where the item should be updated.
   * @param updateFn - The function that will update the current item at the given index.
   */
  updateAt(index: number, updateFn: (current: T) => T): void;
}

/**
 * Creates a writable array signal with array manipulation helpers.
 * @param initialValue - Initial array value.
 * @returns WritableArraySignal<T>
 */
export function arraySignal<T>(initialValue: T[] = []): WritableArraySignal<T> {
  const internalSignal = signal<T[]>([
    ...initialValue,
  ]) as WritableArraySignal<T>;

  const _set = internalSignal.set;
  const _update = internalSignal.update;
  const _asReadonly = internalSignal.asReadonly;

  // Native signal methods
  internalSignal.set = (value: T[]) => _set([...value]);

  internalSignal.update = (updateFn: (value: T[]) => T[]) => {
    _update((current) => [...updateFn(current)]);
  };

  // isEmpty
  (internalSignal as any).isEmpty = computed(
    () => internalSignal().length === 0,
  );

  // setAt & updateAt
  internalSignal.setAt = (index: number, newItem: T) => {
    internalSignal.update((arr) => {
      const newArr = [...arr];
      newArr[index] = newItem;
      return newArr;
    });
  };

  internalSignal.updateAt = (index: number, updateFn: (current: T) => T) => {
    internalSignal.update((arr) => {
      const newArr = [...arr];
      newArr[index] = updateFn(newArr[index]);
      return newArr;
    });
  };

  // Array methods
  internalSignal.fill = (value, start?, end?) => {
    internalSignal.update((arr) => {
      const newArr = [...arr];
      newArr.fill(value, start, end);
      return newArr;
    });
  };

  internalSignal.filter = (predicate) => {
    internalSignal.update((arr) => arr.filter(predicate));
  };

  internalSignal.map = (mapFn) => {
    internalSignal.update((arr) => arr.map(mapFn));
  };

  internalSignal.pop = (): T | undefined => {
    let value: T | undefined;
    internalSignal.update((arr) => {
      const newArr = [...arr];
      value = newArr.pop();
      return newArr;
    });
    return value;
  };

  internalSignal.push = (...items: T[]): number => {
    let length: number;
    internalSignal.update((arr) => {
      const newArr = [...arr, ...items];
      length = newArr.length;
      return newArr;
    });
    return length!;
  };

  internalSignal.reverse = () => {
    internalSignal.update((arr) => {
      const newArr = [...arr];
      newArr.reverse();
      return newArr;
    });
  };

  internalSignal.shift = (): T | undefined => {
    let value: T | undefined;
    internalSignal.update((arr) => {
      const newArr = [...arr];
      value = newArr.shift();
      return newArr;
    });
    return value;
  };

  internalSignal.sort = (compareFn?) => {
    internalSignal.update((arr) => {
      const newArr = [...arr];
      newArr.sort(compareFn);
      return newArr;
    });
  };

  internalSignal.splice = (start, deleteCount?, ...items) => {
    let removed: T[] = [];
    internalSignal.update((arr) => {
      const newArr = [...arr];
      removed = newArr.splice(start, deleteCount ?? arr.length, ...items);
      return newArr;
    });
    return removed!;
  };

  internalSignal.unshift = (...items: T[]): number => {
    let length: number;
    internalSignal.update((arr) => {
      const newArr = [...items, ...arr];
      length = newArr.length;
      return newArr;
    });
    return length!;
  };

  // create a wrapper with only 
  internalSignal.asReadonly = () => {
    const readonlySignal = _asReadonly() as ArraySignal<T>;
    
    (readonlySignal as any).isEmpty = internalSignal.isEmpty;

    return readonlySignal;
  };

  return internalSignal;
}
