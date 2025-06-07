import { stackSignal, StackSignal, WritableStackSignal } from './stack';

describe('stackSignal', () => {
  let signal: WritableStackSignal<number>;
  const initialStack = [1, 2, 3];

  beforeEach(() => {
    signal = stackSignal([...initialStack]);
  });

  describe('initialization and basic access', () => {
    it('should return the initial stack', () => {
      expect(signal()).toEqual([1, 2, 3]);
    });

    it('should return correct isEmpty and size', () => {
      expect(signal.isEmpty()).toBe(false);
      expect(signal.size()).toBe(3);
    });

    it('should reflect empty state', () => {
      const empty = stackSignal<number>([]);
      expect(empty.isEmpty()).toBe(true);
      expect(empty.size()).toBe(0);
    });

    it('should return the top element', () => {
      expect(signal.top()).toBe(3);
      expect(signal.peek()).toBe(3);
    });

    it('should return undefined as top for an empty stack', () => {
      const empty = stackSignal<number>([]);
      expect(empty.top()).toBeUndefined();
      expect(empty.peek()).toBeUndefined();
    });
  });

  describe('push', () => {
    it('should push a single item', () => {
      signal.push(4);
      expect(signal()).toEqual([1, 2, 3, 4]);
      expect(signal.top()).toBe(4);
      expect(signal.size()).toBe(4);
    });

    it('should push multiple items', () => {
      signal.push(4, 5, 6);
      expect(signal()).toEqual([1, 2, 3, 4, 5, 6]);
      expect(signal.top()).toBe(6);
      expect(signal.size()).toBe(6);
    });
  });

  describe('pop', () => {
    it('should pop and return the top item', () => {
      const popped = signal.pop();
      expect(popped).toBe(3);
      expect(signal()).toEqual([1, 2]);
      expect(signal.top()).toBe(2);
      expect(signal.size()).toBe(2);
    });

    it('should pop all items and become empty', () => {
      signal.pop();
      signal.pop();
      signal.pop();
      expect(signal()).toEqual([]);
      expect(signal.isEmpty()).toBe(true);
      expect(signal.top()).toBeUndefined();
      expect(signal.pop()).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('should clear the stack', () => {
      signal.clear();
      expect(signal()).toEqual([]);
      expect(signal.isEmpty()).toBe(true);
      expect(signal.size()).toBe(0);
      expect(signal.top()).toBeUndefined();
    });
  });

  describe('set and update', () => {
    it('should replace the stack with set', () => {
      signal.set([7, 8]);
      expect(signal()).toEqual([7, 8]);
      expect(signal.size()).toBe(2);
      expect(signal.top()).toBe(8);
    });

    it('should deep clone with set', () => {
      const arr = [9, 10];
      signal.set(arr);
      arr[0] = 42;
      expect(signal()).toEqual([9, 10]);
    });

    it('should update the stack using update', () => {
      signal.update((stack) => stack.map((x) => x * 2));
      expect(signal()).toEqual([2, 4, 6]);
    });

    it('should support empty stack update', () => {
      const empty = stackSignal<number>([]);
      empty.update(() => [5]);
      expect(empty()).toEqual([5]);
    });
  });

  describe('asArray computed', () => {
    it('should return a copy of the stack', () => {
      const arr = signal.asArray();
      expect(arr).toEqual([1, 2, 3]);
      // Mutating returned array should not affect the stack
      arr[0] = 99;
      expect(signal()).toEqual([1, 2, 3]);
    });
  });

  describe('asReadonly', () => {
    let readonly: StackSignal<number>;

    beforeEach(() => {
      readonly = signal.asReadonly();
    });

    it('should reflect internal updates', () => {
      signal.push(9);
      expect(readonly()).toEqual([1, 2, 3, 9]);
      expect(readonly.size()).toBe(4);
      expect(readonly.top()).toBe(9);
    });

    it('should provide computed helpers and peek', () => {
      expect(readonly.isEmpty()).toBe(false);
      expect(readonly.size()).toBe(3);
      expect(readonly.top()).toBe(3);
      expect(readonly.peek()).toBe(3);
      expect(readonly.asArray()).toEqual([1, 2, 3]);
    });
  });
});
