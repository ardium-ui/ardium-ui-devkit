import { arraySignal, ArraySignal, WritableArraySignal } from './array-signal';

describe('ArraySignal', () => {
  let signal: WritableArraySignal<number>;
  const originalArray = [1, 2, 3];

  beforeEach(() => {
    signal = arraySignal([...originalArray]);
  });

  describe('isEmpty', () => {
    it('should be false for a non-empty array', () => {
      expect(signal.isEmpty()).toBe(false);
    });

    it('should be true after clearing the array', () => {
      signal.set([]);
      expect(signal.isEmpty()).toBe(true);
    });

    it('should update automatically when items are pushed', () => {
      const empty = arraySignal<number>([]);
      expect(empty.isEmpty()).toBe(true);
      empty.push(42);
      expect(empty.isEmpty()).toBe(false);
    });

    it('should update automatically when items are removed', () => {
      const s = arraySignal<number>([10]);
      expect(s.isEmpty()).toBe(false);
      s.pop();
      expect(s.isEmpty()).toBe(true);
    });
  });

  describe('asReadonly', () => {
    let readonly: ArraySignal<number>;

    beforeEach(() => {
      readonly = signal.asReadonly();
    });

    it('should reflect internal updates', () => {
      signal.push(4);
      expect(readonly()).toEqual([1, 2, 3, 4]);
    });

    it('should reflect isEmpty state', () => {
      expect(readonly.isEmpty()).toBe(false);
      
      signal.set([]);

      expect(readonly.isEmpty()).toBe(true);
    });
  });

  describe('fill', () => {
    it('should fill entire array when no start/end provided', () => {
      signal.fill(7);
      expect(signal()).toEqual([7, 7, 7]);
    });

    it('should fill from start only', () => {
      signal.fill(8, 1);
      expect(signal()).toEqual([1, 8, 8]);
    });

    it('should fill an empty array without error', () => {
      const empty = arraySignal<number>([]);
      empty.fill(5);
      expect(empty()).toEqual([]);
    });
  });

  describe('filter', () => {
    it('should filter to empty array if all values fail predicate', () => {
      signal.filter(() => false);
      expect(signal()).toEqual([]);
    });

    it('should preserve order after filtering', () => {
      signal.filter((v) => v !== 2);
      expect(signal()).toEqual([1, 3]);
    });
  });

  describe('map', () => {
    it('should map to same length array', () => {
      signal.map((v) => v + 1);
      expect(signal()).toEqual([2, 3, 4]);
    });

    it('should map to constant', () => {
      signal.map(() => 0);
      expect(signal()).toEqual([0, 0, 0]);
    });
  });

  describe('pop', () => {
    it('should return undefined on empty array', () => {
      const empty = arraySignal<number>([]);
      expect(empty.pop()).toBeUndefined();
    });

    it('should shorten array by one', () => {
      const prevLength = signal().length;
      signal.pop();
      expect(signal().length).toBe(prevLength - 1);
    });

    it('should return the removed value', () => {
      const removed = signal.pop();
      expect(removed).toBe(originalArray.at(-1));
    });
  });

  describe('push', () => {
    it('should handle single element push', () => {
      const newLength = signal.push(4);
      expect(signal()).toEqual([1, 2, 3, 4]);
      expect(newLength).toBe(4);
    });

    it('should handle multiple element push', () => {
      const newLength = signal.push(5, 6, 7);
      expect(signal()).toEqual([1, 2, 3, 5, 6, 7]);
      expect(newLength).toBe(6);
    });
  });

  describe('reverse', () => {
    it('should reverse even-length array', () => {
      const even = arraySignal([1, 2, 3, 4]);
      even.reverse();
      expect(even()).toEqual([4, 3, 2, 1]);
    });

    it('should reverse odd-length array', () => {
      signal.reverse();
      expect(signal()).toEqual([3, 2, 1]);
    });

    it('should handle empty array', () => {
      const empty = arraySignal<number>([]);
      empty.reverse();
      expect(empty()).toEqual([]);
    });
  });

  describe('set', () => {
    it('should replace with new array', () => {
      signal.set([9, 8]);
      expect(signal()).toEqual([9, 8]);
    });

    it('should deep clone the value', () => {
      const arr = [1, 2];
      signal.set(arr);
      arr[0] = 99;
      expect(signal()).toEqual([1, 2]);
    });
  });

  describe('setAt', () => {
    it('should replace the item at the given index', () => {
      signal.setAt(1, 42);
      expect(signal()).toEqual([1, 42, 3]);
    });

    it('should work when setting the first item', () => {
      signal.setAt(0, 99);
      expect(signal()).toEqual([99, 2, 3]);
    });

    it('should work when setting the last item', () => {
      signal.setAt(2, 100);
      expect(signal()).toEqual([1, 2, 100]);
    });
  });

  describe('shift', () => {
    it('should remove first element', () => {
      expect(signal.shift()).toBe(1);
      expect(signal()).toEqual([2, 3]);
    });

    it('should return undefined for empty array', () => {
      const empty = arraySignal<number>([]);
      expect(empty.shift()).toBeUndefined();
    });
  });

  describe('sort', () => {
    it('should sort numerically ascending by default', () => {
      const test = arraySignal([3, 1, 2]);
      test.sort();
      expect(test()).toEqual([1, 2, 3]);
    });

    it('should sort using compare function', () => {
      signal.sort((a, b) => b - a);
      expect(signal()).toEqual([3, 2, 1]);
    });

    it('should not mutate identical values', () => {
      const test = arraySignal([2, 2, 2]);
      test.sort();
      expect(test()).toEqual([2, 2, 2]);
    });
  });

  describe('splice', () => {
    it('should remove and insert elements', () => {
      const result = signal.splice(1, 1, 99, 100);
      expect(result).toEqual([2]);
      expect(signal()).toEqual([1, 99, 100, 3]);
    });

    it('should remove without inserting', () => {
      const result = signal.splice(1, 2);
      expect(result).toEqual([2, 3]);
      expect(signal()).toEqual([1]);
    });

    it('should handle splice at end', () => {
      const result = signal.splice(3, 0, 5);
      expect(result).toEqual([]);
      expect(signal()).toEqual([1, 2, 3, 5]);
    });
  });

  describe('unshift', () => {
    it('should add element to beginning', () => {
      const length = signal.unshift(0);
      expect(length).toBe(4);
      expect(signal()).toEqual([0, 1, 2, 3]);
    });

    it('should add multiple elements', () => {
      signal.unshift(-2, -1, 0);
      expect(signal()).toEqual([-2, -1, 0, 1, 2, 3]);
    });
  });

  describe('update', () => {
    it('should receive the current array and return a new one', () => {
      signal.update((arr) => arr.map((x) => x * 2));
      expect(signal()).toEqual([2, 4, 6]);
    });

    it('should support empty array update', () => {
      const empty = arraySignal<number>([]);
      empty.update((arr) => [...arr, 1]);
      expect(empty()).toEqual([1]);
    });
  });

  describe('updateAt', () => {
    it('should update the item at the given index using the update function', () => {
      signal.updateAt(1, (current) => current * 2);
      expect(signal()).toEqual([1, 4, 3]);
    });

    it('should work when updating the first item', () => {
      signal.updateAt(0, (current) => current + 10);
      expect(signal()).toEqual([11, 2, 3]);
    });

    it('should work when updating the last item', () => {
      signal.updateAt(2, (current) => current - 1);
      expect(signal()).toEqual([1, 2, 2]);
    });
  });
});
