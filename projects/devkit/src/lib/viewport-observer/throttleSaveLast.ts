import { MonoTypeOperatorFunction, Observable, debounceTime, merge, throttleTime } from 'rxjs';

/**
 * Custom RxJS operator that throttles incoming values but saves the last one when (emitted when the throttle duration ends). A combination of throttleTime and debounceTime.
 * @param duration the throttle duration
 * @returns an RxJS operator function
 */
export function throttleSaveLast<T>(duration: number): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    merge(source.pipe(throttleTime(duration)), source.pipe(debounceTime(duration))).pipe(throttleTime(0, undefined, { leading: true, trailing: false }));
}
