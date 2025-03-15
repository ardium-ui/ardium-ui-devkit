import {
  MonoTypeOperatorFunction,
  Observable,
  debounceTime,
  merge,
  throttleTime,
} from 'rxjs';

/**
 * Custom RxJS operator that throttles incoming values but saves the last one when (emitted when the throttle duration ends). A combination of throttleTime and debounceTime.
 * @param duration the throttle duration
 * @returns an RxJS operator function
 */
export function throttleSaveLast<T>(
  duration: number,
): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    merge(
      source.pipe(throttleTime(duration)),
      source.pipe(debounceTime(duration)),
    ).pipe(throttleTime(0, undefined, { leading: true, trailing: false }));
}

/**
 * Requires that at least one property from the given object is defined.
 *
 * @copyright Copied from [Microsoft Learn](https://learn.microsoft.com/en-us/javascript/api/@azure/keyvault-certificates/requireatleastone).
 */
export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> &
    Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];