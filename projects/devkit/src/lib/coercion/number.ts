/**
 * Type describing the allowed values for a number input
 */
export type NumberInput = string | number | null | undefined;

/**
Coerces a data-bound value (typically a string) to a number.
*/
/**
 * Coerces a data-bound value (typically a string) to a number.
 * @param value the value to be coerced.
 * @returns the value coerced into a number, or undefined if cannot coerce.
 */
export function coerceNumberProperty(value: any): number;
/**
 * Coerces a data-bound value (typically a string) to a number.
 * @param value the value to be coerced.
 * @param fallback a value to be used if `value` cannot be coerced into a number.
 * @returns the value coerced into a number, or `fallback` if cannot coerce.
 */
export function coerceNumberProperty<D>(value: any, fallback: D): number | D;
export function coerceNumberProperty(value: any, fallbackValue = undefined) {
  return _isNumberValue(value) ? Number(value) : fallbackValue;
}

/**
 * Whether the provided value is considered a number.
 */
function _isNumberValue(value: any): boolean {
  return !isNaN(parseFloat(value as any)) && !isNaN(Number(value));
}
