import {
  computed,
  effect,
  inject,
  Injector,
  runInInjectionContext,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { isAnyString, isNull } from 'simple-bool';

export interface QueryParamSignalNonNullable<T> extends WritableSignal<T> {
  readonly paramName: string;
  readonly serialized: Signal<string | null>;
}

export interface QueryParamSignal<T>
  extends QueryParamSignalNonNullable<T | null> {
  clear(): void;
}

export interface QueryParamSignalOptions<T> {
  paramName: string;
  serialize?: (value: T | null) => string | null;
  deserialize?: (value: string) => T | null;
  nonNullable?: boolean;
}

function isSerializableSignal<T>(
  options: QueryParamSignalOptions<T>,
): options is QueryParamSignalOptions<T> &
  Required<Pick<QueryParamSignalOptions<T>, 'serialize' | 'deserialize'>> {
  return !!options.serialize && !!options.deserialize;
}

/**
 * Creates a `WritableSignal` that persists its value in a URL query parameter with both serialization and deserialization.
 *
 * @param initialValue - The initial value of the signal if no value is found in the query param.
 * @param options - An object containing the query parameter name, and custom serialization/deserialization functions.
 * @param options.paramName - The name of the query parameter used to store the signal value.
 * @param options.serialize - A function to serialize the value into a string for the query parameter.
 * @param options.deserialize - A function to deserialize the value from a string back to the original type.
 * @param options.nonNullable - If true, returns a non-nullable signal interface.
 * @returns A `WritableSignal<T | null>` that persists its value using the specified query parameter.
 */
export function queryParamSignal<T>(
  initialValue: T,
  options: QueryParamSignalOptions<T> & { nonNullable: true },
): QueryParamSignalNonNullable<T>;
export function queryParamSignal<T>(
  initialValue: T | null,
  optionsOrParam: string | QueryParamSignalOptions<T>,
): QueryParamSignal<T>;
export function queryParamSignal<T>(
  initialValue: T | null,
  optionsOrParam: string | QueryParamSignalOptions<T>,
): QueryParamSignal<T> | QueryParamSignalNonNullable<T> {
  let options: QueryParamSignalOptions<T>;

  if (typeof optionsOrParam === 'string') {
    options = { paramName: optionsOrParam };
  } else {
    options = optionsOrParam;
  }

  if (!!options.serialize !== !!options.deserialize) {
    throw new Error(
      'DKT-FT3010: Both serialize and deserialize must either be both defined or both undefined.',
    );
  }

  const isNonNullable = options.nonNullable === true;
  if (isNonNullable && isNull(initialValue)) {
    throw new Error(
      'DKT-FT3012: Non-nullable query param signals require a non-null initial value.',
    );
  }

  if (
    !isSerializableSignal(options) &&
    !isAnyString(initialValue) &&
    !isNull(initialValue)
  ) {
    throw new Error(
      'DKT-FT3011: Non-string initial values are only allowed for serializable signals. Define serialization options.',
    );
  }

  const internalSignal = signal<T | null>(initialValue);

  if (isNonNullable) {
    const nonNullableSignal = internalSignal as QueryParamSignalNonNullable<T>;
    Object.assign(nonNullableSignal, {
      paramName: options.paramName,
      serialized: computed(() => serializeValue(nonNullableSignal(), options)),
    });

    _assignQueryParamListeners(nonNullableSignal, options);
    return nonNullableSignal;
  }

  const nullableSignal = internalSignal as QueryParamSignal<T>;
  Object.assign(nullableSignal, {
    paramName: options.paramName,
    serialized: computed(() => serializeValue(nullableSignal(), options)),
    clear: () => nullableSignal.set(null),
  });

  _assignQueryParamListeners(nullableSignal, options);
  return nullableSignal;
}

function _assignQueryParamListeners<
  T,
  S extends QueryParamSignal<T> | QueryParamSignalNonNullable<T>,
>(signal: S, options: QueryParamSignalOptions<T>): void {
  const storedValue = loadFromQueryParam(options);
  const router = inject(Router);
  const injector = inject(Injector);

  if (storedValue !== null) {
    signal.set(storedValue);
  } else {
    updateQueryParam(router, options, signal());
  }

  setTimeout(() => {
    updateQueryParam(router, options, signal());
  }, 0);

  runInInjectionContext(injector, () => {
    effect(() => {
      updateQueryParam(router, options, signal());
    });
  });
}

function loadFromQueryParam<T>(options: QueryParamSignalOptions<T>): T | null {
  const urlParams = new URLSearchParams(window.location.search);
  const storedValue = urlParams.get(options.paramName);

  return deserializeValue(storedValue, options);
}

function updateQueryParam<T>(
  router: Router,
  options: QueryParamSignalOptions<T>,
  value: T | null,
): void {
  const serializedValue = serializeValue(value, options);
  const urlTree = router.parseUrl(router.url);
  const queryParams = {
    ...urlTree.queryParams,
    [options.paramName]: serializedValue,
  };

  router.navigate([], {
    queryParams,
    queryParamsHandling: 'merge',
    replaceUrl: true,
  });
}

function serializeValue<T>(
  value: T | null,
  options: QueryParamSignalOptions<T>,
): string | null {
  if (isSerializableSignal(options)) {
    return options.serialize(value);
  }
  return value === null ? null : (value as unknown as string);
}

function deserializeValue<T>(
  value: string | null,
  options: QueryParamSignalOptions<T>,
): T | null {
  if (value !== null && isSerializableSignal(options)) {
    return options.deserialize(value);
  }
  return value as unknown as T | null;
}
