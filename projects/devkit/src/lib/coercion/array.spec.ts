import { coerceArrayProperty } from './array';

describe('coerceArrayProperty', () => {
  it('should split a string', () => {
    expect(coerceArrayProperty('x,y,,z,1')).toEqual(['x', 'y', 'z', '1']);
  });
  it('should map values to string in an array', () => {
    expect(coerceArrayProperty(['x', 1, true, null, undefined, ['arr', 'ay'], { data: false }])).toEqual([
      'x',
      '1',
      'true',
      'null',
      'undefined',
      'arr,ay',
      '[object Object]',
    ]);
  });
  it('should work with a custom separator', () => {
    expect(coerceArrayProperty('1::2::3::4', '::')).toEqual(['1', '2', '3', '4']);
  });
  it('should trim values and remove empty values', () => {
    expect(coerceArrayProperty(',  x,  ,, ', ',')).toEqual(['x']);
  });
  it('should map non-string values to string', () => {
    expect(coerceArrayProperty(0)).toEqual(['0']);
  });
  it('should return an empty array for null', () => {
    expect(coerceArrayProperty(null)).toEqual([]);
  });
  it('should return an empty array for undefined', () => {
    expect(coerceArrayProperty(undefined)).toEqual([]);
  });
  it('should return an empty array for empty string', () => {
    expect(coerceArrayProperty('')).toEqual([]);
  });
});
