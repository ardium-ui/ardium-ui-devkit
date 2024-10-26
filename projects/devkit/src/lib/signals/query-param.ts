import {
  effect,
  inject,
  Injector,
  runInInjectionContext,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';

export interface QueryParamSignal<T> extends WritableSignal<T | null> {
  readonly paramName: string;
  clear(): void;
}

interface QueryParamSignalOptions<T> {
  paramName: string;
  serialize?: (value: T | null) => string | null;
  deserialize?: (value: string) => T | null;
}

function isSerializableSignal<T>(
  options: QueryParamSignalOptions<T>,
): options is Required<QueryParamSignalOptions<T>> {
  return 'serialize' in options && 'deserialize' in options;
}

/**
 * Creates a `WritableSignal` that persists its value in a URL query parameter with both serialization and deserialization.
 *
 * @param initialValue - The initial value of the signal if no value is found in the query param.
 * @param options - An object containing the query parameter name, and custom serialization/deserialization functions.
 * @param options.paramName - The name of the query parameter used to store the signal value.
 * @param options.serialize - A function to serialize the value into a string for the query parameter.
 * @param options.deserialize - A function to deserialize the value from a string back to the original type.
 * @returns A `WritableSignal<T | null>` that persists its value using the specified query parameter.
 */
export function queryParamSignal<T>(
  initialValue: T | null,
  optionsOrParam: string | QueryParamSignalOptions<T>,
): QueryParamSignal<T> {
  let options: QueryParamSignalOptions<T>;

  if (typeof optionsOrParam === 'string') {
    options = { paramName: optionsOrParam };
  } else {
    options = optionsOrParam;
  }

  if (
    isSerializableSignal(options) &&
    (!options.serialize || !options.deserialize)
  ) {
    throw new Error(
      'DKT-FT300: Both serialize and deserialize must either be both defined or both undefined.',
    );
  }

  const internalSignal = signal<T | null>(initialValue) as QueryParamSignal<T>;
  Object.assign(internalSignal, {
    paramName: options.paramName,
    clear: () => internalSignal.set(null),
  });

  const router = inject(Router);
  const storedValue = loadFromQueryParam(options);
  if (storedValue !== null) {
    internalSignal.set(storedValue);
  } else {
    updateQueryParam(router, options, internalSignal());
  }

  setTimeout(() => {
    updateQueryParam(router, options, internalSignal());
  }, 0);

  const injector = inject(Injector);

  runInInjectionContext(injector, () => {
    effect(() => {
      updateQueryParam(router, options, internalSignal());
    });
  });

  return internalSignal;
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
