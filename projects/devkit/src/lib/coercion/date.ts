export function coerceDateProperty<T>(v: any, fallback: T): Date | T {
  if (typeof v == 'string') {
    //try to see if it is an array of numbers separated by a comma
    const vAsArray1 = v.split(',').map((v) => Number(v));
    if (
      vAsArray1.length >= 1 &&
      vAsArray1.length <= 3 &&
      vAsArray1.every((v) => !isNaN(v))
    ) {
      v = new Date(vAsArray1[0], vAsArray1[1] ?? 0, vAsArray1[2] ?? 1);
    } else {
      //try to see if it is an array of numbers separated by some whitespace
      const vAsArray2 = v.split(/\s/).map((v) => Number(v));
      if (
        vAsArray2.length >= 1 &&
        vAsArray2.length <= 3 &&
        vAsArray2.every((v) => !isNaN(v))
      ) {
        v = new Date(vAsArray2[0], vAsArray2[1] ?? 0, vAsArray2[2] ?? 1);
      } else {
        v = new Date(v);
      }
    }
  }
  //is a Date object && does not contain an error
  if (v instanceof Date && !isNaN(v.valueOf())) {
    return v;
  }
  return fallback;
}
