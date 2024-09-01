import { coerceNumberProperty } from './number';

describe('coerceNumberProperty', () => {
  it('should coerce undefined to undefined or default', () => {
    expect(coerceNumberProperty(undefined)).toBe(undefined);
    expect(coerceNumberProperty(undefined, 111)).toBe(111);
  });
  it('should coerce null to undefined or default', () => {
    expect(coerceNumberProperty(null)).toBe(undefined);
    expect(coerceNumberProperty(null, 111)).toBe(111);
  });
  it('should coerce true to undefined or default', () => {
    expect(coerceNumberProperty(true)).toBe(undefined);
    expect(coerceNumberProperty(true, 111)).toBe(111);
  });
  it('should coerce false to undefined or default', () => {
    expect(coerceNumberProperty(false)).toBe(undefined);
    expect(coerceNumberProperty(false, 111)).toBe(111);
  });
  it('should coerce the empty string to undefined or default', () => {
    expect(coerceNumberProperty('')).toBe(undefined);
    expect(coerceNumberProperty('', 111)).toBe(111);
  });
  it('should coerce the string "1" to 1', () => {
    expect(coerceNumberProperty('1')).toBe(1);
    expect(coerceNumberProperty('1', 111)).toBe(1);
  });
  it('should coerce the string "123.456" to 123.456', () => {
    expect(coerceNumberProperty('123.456')).toBe(123.456);
    expect(coerceNumberProperty('123.456', 111)).toBe(123.456);
  });
  it('should coerce the string "-123.456" to -123.456', () => {
    expect(coerceNumberProperty('-123.456')).toBe(-123.456);
    expect(coerceNumberProperty('-123.456', 111)).toBe(-123.456);
  });
  it('should coerce an arbitrary string to 0 or default', () => {
    expect(coerceNumberProperty('pink')).toBe(undefined);
    expect(coerceNumberProperty('pink', 111)).toBe(111);
  });
  it('should coerce an arbitrary string prefixed with a number to undefined or default', () => {
    expect(coerceNumberProperty('123pink')).toBe(undefined);
    expect(coerceNumberProperty('123pink', 111)).toBe(111);
  });
  it('should coerce the number 1 to 1', () => {
    expect(coerceNumberProperty(1)).toBe(1);
    expect(coerceNumberProperty(1, 111)).toBe(1);
  });
  it('should coerce the number 123.456 to 123.456', () => {
    expect(coerceNumberProperty(123.456)).toBe(123.456);
    expect(coerceNumberProperty(123.456, 111)).toBe(123.456);
  });
  it('should coerce the number -123.456 to -123.456', () => {
    expect(coerceNumberProperty(-123.456)).toBe(-123.456);
    expect(coerceNumberProperty(-123.456, 111)).toBe(-123.456);
  });
  it('should coerce an object to undefined or default', () => {
    expect(coerceNumberProperty({})).toBe(undefined);
    expect(coerceNumberProperty({}, 111)).toBe(111);
  });
  it('should coerce an array to undefined or default', () => {
    expect(coerceNumberProperty([])).toBe(undefined);
    expect(coerceNumberProperty([], 111)).toBe(111);
  });
});
