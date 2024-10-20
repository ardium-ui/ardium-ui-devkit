export function coerceDateProperty<T>(v: any, fallback: T): Date | T {
  if (typeof v == 'string') {
    if (v.toLowerCase() === 'now') {
      return new Date();
    }
  }
  v = new Date(v);
  // check if does not contain an error
  if (!isNaN(v.valueOf())) {
    return v;
  }
  return fallback;
}
