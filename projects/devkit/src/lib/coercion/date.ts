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

export function coerceDateProperty<T>(v: any, fallback: T): Date | T {
  if (typeof v == 'string') {
    if (v.toLowerCase() === 'now') {
      return new Date();
    }
  }
  v = new Date(v);
  if (isNaN(v.valueOf())) {
    return fallback;
  }
  return v;
}

export function coerceDateOnlyProperty<T>(
  v: any,
  fallback: T,
  asUTC: boolean = false,
): Date | T {
  if (typeof v == 'string') {
    if (v.toLowerCase() === 'now' || v.toLowerCase() === 'today') {
      const now = new Date();
      now.setMinutes(now.getMinutes() + now.getTimezoneOffset());
      return asUTC
        ? getUTCDate(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
            now.getMilliseconds(),
          )
        : now;
    }
    v = new Date(v);
    if (isNaN(v.valueOf())) {
      return fallback;
    }
    return v;
  }
  const dateV = new Date(v);
  if (isNaN(dateV.valueOf())) {
    return fallback;
  }
  if (dateV.toISOString().substring(10) === 'T00:00:00.000Z') {
    if (asUTC) {
      return dateV;
    }
    return new Date(
      dateV.getUTCFullYear(),
      dateV.getUTCMonth(),
      dateV.getUTCDate(),
      0,
      0,
      0,
      0,
    );
  }
  // hack to detect if the date was created with a time component
  if (dateV.getMilliseconds() !== 0 || dateV.getSeconds() !== 0 || dateV.getMinutes() % 15 !== 0) {
    // date has a time component, we treat it as if it was created using Date.now() and thus convert it to a date only value and convert to UTC if needed
    if (asUTC) {
      return getUTCDate(
        dateV.getFullYear(),
        dateV.getMonth(),
        dateV.getDate(),
      );
    }
    return new Date(dateV.getFullYear(), dateV.getMonth(), dateV.getDate(), 0, 0, 0, 0);
  }
  // we are now quite confident that there is no time component
  if (asUTC) {
    return getUTCDate(
      dateV.getFullYear(),
      dateV.getMonth(),
      dateV.getDate(),
    );
  }
  return dateV;
}
