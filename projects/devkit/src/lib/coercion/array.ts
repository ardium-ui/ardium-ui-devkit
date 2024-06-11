/**
 * Type describing the allowed values for a number input
 */
export type ArrayInput = string | any[] | null | undefined;

/**
 * Coerces a value to an array of trimmed non-empty strings.
 * Any input that is not an array, `null` or `undefined` will be turned into a string
 * using `String()` and split into an array with the given separator.
 * `null`, `undefined`, and `""` will result in an empty array.
 * This results in the following outcomes:
 * - `null` -> `[]`
 * - `[null]` -> `["null"]`
 * - `["a", "b ", " "]` -> `["a", "b"]`
 * - `[1, [2, 3]]` -> `["1", "2,3"]`
 * - `"a,b , c"` -> `["a", "b", "c"]`
 *
 * Useful for defining CSS classes or table columns.
 * @param value the value to coerce into an array of strings
 * @param separator split-separator if value isn't an array. Defaults to the string `","`.
 */
export function coerceArrayProperty(value: any, separator: string | RegExp = ','): string[] {
  if (Array.isArray(value)) return value.map(v => String(v).trim()).filter(v => v.length);

  if (value == null || value === '') return [];

  return String(value)
    .split(separator)
    .map(v => v.trim())
    .filter(v => v.length);
}
