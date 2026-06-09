import { isDefined } from 'simple-bool';

export function getUTCDate(): Date;
export function getUTCDate(year: number, monthIndex: number, day: number): Date;
export function getUTCDate(
  year: number,
  monthIndex: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
): Date;
export function getUTCDate(
  year?: number,
  monthIndex?: number,
  day?: number,
  hour: number = 0,
  minute: number = 0,
  second: number = 0,
  millisecond: number = 0,
): Date {
  if (!isDefined(year) && !isDefined(monthIndex) && !isDefined(day)) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + now.getTimezoneOffset());
    return now;
  }
  return new Date(
    Date.UTC(year!, monthIndex, day, hour, minute, second, millisecond),
  );
}

export function coerceDateProperty<T>(
  v: any,
  fallback: T,
  alwaysUTC: boolean = false,
): Date | T {
  if (typeof v == 'string') {
    if (v.toLowerCase() === 'now') {
      if (alwaysUTC) {
        return getUTCDate();
      }
      return new Date();
    }
  }
  v = new Date(v);
  if (alwaysUTC) {
    v = getUTCDate(
      v.getFullYear(),
      v.getMonth(),
      v.getDate(),
      v.getHours(),
      v.getMinutes(),
      v.getSeconds(),
      v.getMilliseconds(),
    );
  }
  // check if does not contain an error
  if (!isNaN(v.valueOf())) {
    return v;
  }
  return fallback;
}
