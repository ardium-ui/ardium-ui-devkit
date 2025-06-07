import { computed, Signal, signal, WritableSignal } from '@angular/core';

/**
 * A read-only map signal with non-mutating methods.
 */
export interface MapSignal<K, V> extends Signal<Map<K, V>> {
  /**
   * Computed signal that returns `true` if the map is empty.
   */
  readonly isEmpty: Signal<boolean>;
  /**
   * Computed signal for map size.
   */
  readonly size: Signal<number>;

  /**
   * Gets the value for a key, or undefined.
   */
  get(key: K): V | undefined;

  /**
   * Checks if a key exists in the map.
   */
  has(key: K): boolean;

  /**
   * Computed signal that returns an array of [key, value] entries.
   */
  readonly entriesArray: Signal<[K, V][]>;

  /**
   * Computed signal that returns an array of keys.
   */
  readonly keysArray: Signal<K[]>;

  /**
   * Computed signal that returns an array of values.
   */
  readonly valuesArray: Signal<V[]>;
}

/**
 * A writable map signal with mutating and non-mutating methods.
 */
export interface WritableMapSignal<K, V>
  extends WritableSignal<Map<K, V>>,
    MapSignal<K, V> {
  /**
   * Returns a read-only version of the map signal.
   */
  asReadonly(): MapSignal<K, V>;

  /**
   * Sets a value for the key.
   */
  setKey(key: K, value: V): void;

  /**
   * Deletes a key from the map.
   * Returns true if a value was removed.
   */
  delete(key: K): boolean;

  /**
   * Clears the map.
   */
  clear(): void;

  /**
   * Replaces the map with a new map.
   */
  setMap(value: Map<K, V>): void;
  /**
   * Replaces the map with a new map. Alias of the method `setMap()`.
   */
  set(value: Map<K, V>): void;

  /**
   * Updates the map using an update function.
   */
  update(updateFn: (current: Map<K, V>) => Map<K, V>): void;

  /**
   * Updates the value for a key using the provided update function if the key exists.
   */
  updateAt(key: K, updateFn: (current: V) => V): void;
}

/**
 * Creates a writable, reactive Map signal with full Map-like API and helpers.
 *
 * This factory returns a signal wrapping a JavaScript `Map`, exposing both non-mutating and mutating methods
 * for convenient and fully reactive manipulation of key-value pairs.
 *
 * All mutator methods (`setKey`, `delete`, `clear`, `setMap`, etc.) always replace the Map with a cloned version,
 * ensuring immutability for predictable reactivity.
 *
 * The signal also provides computed signals for common queries (such as `isEmpty`, `size`, `entriesArray`, `keysArray`, `valuesArray`),
 * and offers a type-safe, readonly view via `.asReadonly()`.
 *
 * @template K The type of keys.
 * @template V The type of values.
 * @param {Iterable<[K, V]>} [initialValue=[]] Optional initial map contents, as entries or another Map.
 * @returns {WritableMapSignal<K, V>} A writable Map signal instance with both native and Map-specific helpers.
 *
 * @example
 * const map = mapSignal<string, number>([['a', 1], ['b', 2]]);
 * map.setKey('c', 3);        // Adds key 'c'
 * map.delete('a');           // Removes key 'a'
 * map.update(m => { m.set('d', 4); return m; });
 * map.entriesArray();        // [['b', 2], ['c', 3], ['d', 4]]
 * map.asReadonly();          // Readonly view
 *
 * @remarks
 * - All mutator methods produce a new Map object. Do **not** depend on Map reference identity between writes.
 * - Use `asReadonly()` to get a type-safe, mutation-free interface to this signal.
 * - Non-mutating Map methods (`get`, `has`) are available both on writable and readonly signals.
 * - Computed signals (`isEmpty`, `size`, `entriesArray`, `keysArray`, `valuesArray`) update automatically when the signal changes.
 * - Designed for use in Angular signals, but can be used for any reactivity pattern where mutable Map logic is desired.
 */
export function mapSignal<K, V>(
  initialValue: Iterable<[K, V]> = [],
): WritableMapSignal<K, V> {
  const internalSignal = signal<Map<K, V>>(
    new Map(initialValue),
  ) as unknown as WritableMapSignal<K, V>;

  const _set = (internalSignal as unknown as WritableSignal<Map<K, V>>).set;
  const _update = internalSignal.update;
  const _asReadonly = internalSignal.asReadonly;

  internalSignal.setMap = (value: Map<K, V>) => _set(new Map(value));
  internalSignal.set = (value: Map<K, V>) => _set(new Map(value));

  internalSignal.setKey = (key: K, value: V) => {
    internalSignal.update((map) => {
      const copy = new Map(map);
      copy.set(key, value);
      return copy;
    });
  };

  internalSignal.delete = (key: K): boolean => {
    let deleted = false;
    internalSignal.update((map) => {
      if (!map.has(key)) return map;
      const copy = new Map(map);
      deleted = copy.delete(key);
      return copy;
    });
    return deleted;
  };

  internalSignal.clear = () => {
    internalSignal.setMap(new Map<K, V>());
  };

  internalSignal.get = (key: K): V | undefined => internalSignal().get(key);

  internalSignal.has = (key: K): boolean => internalSignal().has(key);

  internalSignal.update = (updateFn: (current: Map<K, V>) => Map<K, V>) => {
    _update((current) => new Map(updateFn(current)));
  };

  internalSignal.updateAt = (key: K, updateFn: (current: V) => V) => {
    internalSignal.update((map) => {
      if (!map.has(key)) return map;
      const copy = new Map(map);
      copy.set(key, updateFn(copy.get(key)!));
      return copy;
    });
  };

  (internalSignal.entriesArray as any) = computed(() =>
    Array.from(internalSignal().entries()),
  );
  (internalSignal.keysArray as any) = computed(() =>
    Array.from(internalSignal().keys()),
  );
  (internalSignal.valuesArray as any) = computed(() =>
    Array.from(internalSignal().values()),
  );

  (internalSignal.isEmpty as any) = computed(() => internalSignal().size === 0);
  (internalSignal.size as any) = computed(() => internalSignal().size);

  internalSignal.asReadonly = () => {
    const readonlySignal = _asReadonly() as MapSignal<K, V>;
    (readonlySignal.isEmpty as any) = internalSignal.isEmpty;
    (readonlySignal.size as any) = internalSignal.size;
    readonlySignal.get = internalSignal.get;
    readonlySignal.has = internalSignal.has;
    (readonlySignal.entriesArray as any) = internalSignal.entriesArray;
    (readonlySignal.keysArray as any) = internalSignal.keysArray;
    (readonlySignal.valuesArray as any) = internalSignal.valuesArray;
    return readonlySignal;
  };

  return internalSignal;
}
