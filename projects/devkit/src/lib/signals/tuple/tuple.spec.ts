import { tupleSignal, TupleSignal, WritableTupleSignal } from './tuple';

describe('tupleSignal', () => {
  let signal: WritableTupleSignal<[number, string, boolean]>;
  const initialTuple: [number, string, boolean] = [42, 'hello', false];

  beforeEach(() => {
    signal = tupleSignal(initialTuple);
  });

  describe('basic access', () => {
    it('should return the initial tuple', () => {
      expect(signal()).toEqual([42, 'hello', false]);
    });

    it('should be able to get values by index', () => {
      expect(signal.getAt(0)).toBe(42);
      expect(signal.getAt(1)).toBe('hello');
      expect(signal.getAt(2)).toBe(false);
    });
  });

  describe('setAt', () => {
    it('should set a value at a specific index', () => {
      signal.setAt(0, 99);
      expect(signal()).toEqual([99, 'hello', false]);
      signal.setAt(1, 'world');
      expect(signal()).toEqual([99, 'world', false]);
      signal.setAt(2, true);
      expect(signal()).toEqual([99, 'world', true]);
    });
  });

  describe('update', () => {
    it('should update the entire tuple', () => {
      signal.update(([n, s, b]) => [n + 1, s.toUpperCase(), !b]);
      expect(signal()).toEqual([43, 'HELLO', true]);
    });
  });

  describe('updateAt', () => {
    it('should update a value at a specific index', () => {
      signal.updateAt(0, (n) => n * 2);
      expect(signal()).toEqual([84, 'hello', false]);
      signal.updateAt(1, (s) => s + '!');
      expect(signal()).toEqual([84, 'hello!', false]);
      signal.updateAt(2, (b) => !b);
      expect(signal()).toEqual([84, 'hello!', true]);
    });

    it('should not affect other elements', () => {
      signal.updateAt(1, () => 'changed');
      expect(signal()).toEqual([42, 'changed', false]);
    });
  });

  describe('set', () => {
    it('should replace the entire tuple', () => {
      signal.set([1, 'a', true]);
      expect(signal()).toEqual([1, 'a', true]);
    });

    it('should deep clone the tuple', () => {
      const tuple: [number, string, boolean] = [10, 'x', false];
      signal.set(tuple);
      tuple[0] = 99;
      expect(signal()).toEqual([10, 'x', false]);
    });
  });

  describe('isEmpty', () => {
    it('should be false for a tuple with length > 0', () => {
      expect(signal.isEmpty()).toBe(false);
    });

    it('should be true for a tuple of length 0', () => {
      const empty = tupleSignal([]);
      expect(empty.isEmpty()).toBe(true);
    });
  });

  describe('entriesArray', () => {
    it('should provide entries as [index, value] pairs', () => {
      expect(signal.entriesArray()).toEqual([
        [0 as any, 42],
        [1 as any, 'hello'],
        [2 as any, false],
      ]);
    });

    it('should reflect changes', () => {
      signal.setAt(2, true);
      expect(signal.entriesArray()).toEqual([
        [0 as any, 42],
        [1 as any, 'hello'],
        [2 as any, true],
      ]);
    });
  });

  describe('asReadonly', () => {
    let readonly: TupleSignal<[number, string, boolean]>;

    beforeEach(() => {
      readonly = signal.asReadonly();
    });

    it('should reflect changes made to the original signal', () => {
      signal.setAt(0, 111);
      expect(readonly()).toEqual([111, 'hello', false]);
    });

    it('should provide access to getAt', () => {
      expect(readonly.getAt(1)).toBe('hello');
    });

    it('should provide isEmpty and entriesArray', () => {
      expect(readonly.isEmpty()).toBe(false);
      expect(readonly.entriesArray()).toEqual([
        [0 as any, 42],
        [1 as any, 'hello'],
        [2 as any, false],
      ]);
    });
  });
});
