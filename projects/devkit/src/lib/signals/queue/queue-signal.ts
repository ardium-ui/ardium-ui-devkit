import { computed, Signal, signal, WritableSignal } from '@angular/core';

/**
 * A read-only queue signal, providing non-mutating helpers and computed properties.
 * @template T The type of elements held in the queue.
 */
export interface QueueSignal<T> extends Signal<T[]> {
  /**
   * A signal that returns `true` if the queue is empty.
   */
  readonly isEmpty: Signal<boolean>;
  /**
   * A signal that returns the current number of items in the queue.
   */
  readonly size: Signal<number>;
  /**
   * A signal that returns the front (first) item of the queue, or `undefined` if the queue is empty. Does not remove it.
   */
  readonly front: Signal<T | undefined>;
  /**
   * A signal that returns a shallow copy of the queue as an array.
   */
  readonly asArray: Signal<T[]>;
  /**
   * Returns the front item in the queue, or `undefined` if the queue is empty. Does not remove it.
   * @returns The front item or `undefined`.
   */
  peek(): T | undefined;
}

/**
 * A writable queue signal, providing mutating and non-mutating helpers.
 * @template T The type of elements held in the queue.
 */
export interface WritableQueueSignal<T>
  extends WritableSignal<T[]>,
    QueueSignal<T> {
  /**
   * Returns a read-only version of the queue signal.
   * @returns A read-only {@link QueueSignal} instance.
   */
  asReadonly(): QueueSignal<T>;
  /**
   * Adds one or more items to the end of the queue.
   * @param items - The elements to enqueue.
   */
  enqueue(...items: T[]): void;
  /**
   * Removes and returns the front item of the queue. If the queue is empty, returns `undefined`.
   * @returns The dequeued item, or `undefined` if the queue was empty.
   */
  dequeue(): T | undefined;
  /**
   * Clears all items from the queue.
   */
  clear(): void;
  /**
   * Replaces the queue with a new array of items.
   * @param value - The new array to set as the queue.
   */
  set(value: T[]): void;
  /**
   * Updates the queue using the provided update function.
   * @param updateFn - Function that receives the current queue and returns a new queue.
   */
  update(updateFn: (current: T[]) => T[]): void;
}

/**
 * Creates a writable queue signal, which is a reactive queue data structure.
 *
 * @template T The type of elements held in the queue.
 * @param {T[]} [initialValue=[]] Optional initial items in the queue.
 * @returns {WritableQueueSignal<T>} The writable queue signal instance.
 *
 * @example
 * const queue = queueSignal<number>([1, 2, 3]);
 * queue.enqueue(4);              // new value: [1, 2, 3, 4]
 * const value = queue.dequeue(); // 1    new value: [2, 3, 4]
 * queue.clear();                 // new value: []
 */
export function queueSignal<T>(initialValue: T[] = []): WritableQueueSignal<T> {
  const internalSignal = signal<T[]>([
    ...initialValue,
  ]) as unknown as WritableQueueSignal<T>;

  const _set = (internalSignal as unknown as WritableSignal<T[]>).set;
  const _update = internalSignal.update;
  const _asReadonly = internalSignal.asReadonly;

  // Native methods
  internalSignal.set = (arr: T[]) => _set([...arr]);
  internalSignal.update = (updateFn: (current: T[]) => T[]) => {
    _update((current) => [...updateFn(current)]);
  };

  // Queue methods
  internalSignal.enqueue = (...items: T[]) => {
    internalSignal.update((queue) => [...queue, ...items]);
  };

  internalSignal.dequeue = (): T | undefined => {
    let dequeued: T | undefined = undefined;
    internalSignal.update((queue) => {
      if (queue.length === 0) return queue;
      const copy = [...queue];
      dequeued = copy.shift();
      return copy;
    });
    return dequeued;
  };

  internalSignal.clear = () => {
    internalSignal.set([]);
  };

  (internalSignal.isEmpty as any) = computed(
    () => internalSignal().length === 0,
  );

  (internalSignal.size as any) = computed(() => internalSignal().length);

  (internalSignal.front as any) = computed(() => {
    const queue = internalSignal();
    return queue.length ? queue[0] : undefined;
  });

  (internalSignal.asArray as any) = computed(() => [...internalSignal()]);

  internalSignal.peek = () => {
    const queue = internalSignal();
    return queue.length ? queue[0] : undefined;
  };

  internalSignal.asReadonly = () => {
    const readonlySignal = _asReadonly() as QueueSignal<T>;
    (readonlySignal.isEmpty as any) = internalSignal.isEmpty;
    (readonlySignal.size as any) = internalSignal.size;
    (readonlySignal.front as any) = internalSignal.front;
    (readonlySignal.asArray as any) = internalSignal.asArray;
    readonlySignal.peek = internalSignal.peek;
    return readonlySignal;
  };

  return internalSignal;
}
