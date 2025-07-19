import { queueSignal, QueueSignal, WritableQueueSignal } from './queue-signal';

describe('queueSignal', () => {
  let signal: WritableQueueSignal<number>;
  const initialQueue = [1, 2, 3];

  beforeEach(() => {
    signal = queueSignal([...initialQueue]);
  });

  describe('initialization and basic access', () => {
    it('should return the initial queue', () => {
      expect(signal()).toEqual([1, 2, 3]);
    });

    it('should return correct isEmpty and size', () => {
      expect(signal.isEmpty()).toBe(false);
      expect(signal.size()).toBe(3);
    });

    it('should reflect empty state', () => {
      const empty = queueSignal<number>([]);
      expect(empty.isEmpty()).toBe(true);
      expect(empty.size()).toBe(0);
    });

    it('should return the front element', () => {
      expect(signal.front()).toBe(1);
      expect(signal.peek()).toBe(1);
    });

    it('should return undefined as front for an empty queue', () => {
      const empty = queueSignal<number>([]);
      expect(empty.front()).toBeUndefined();
      expect(empty.peek()).toBeUndefined();
    });
  });

  describe('enqueue', () => {
    it('should enqueue a single item', () => {
      signal.enqueue(4);
      expect(signal()).toEqual([1, 2, 3, 4]);
      expect(signal.front()).toBe(1);
      expect(signal.size()).toBe(4);
    });

    it('should enqueue multiple items', () => {
      signal.enqueue(4, 5, 6);
      expect(signal()).toEqual([1, 2, 3, 4, 5, 6]);
      expect(signal.front()).toBe(1);
      expect(signal.size()).toBe(6);
    });
  });

  describe('dequeue', () => {
    it('should dequeue and return the front item', () => {
      const dequeued = signal.dequeue();
      expect(dequeued).toBe(1);
      expect(signal()).toEqual([2, 3]);
      expect(signal.front()).toBe(2);
      expect(signal.size()).toBe(2);
    });

    it('should dequeue all items and become empty', () => {
      signal.dequeue();
      signal.dequeue();
      signal.dequeue();
      expect(signal()).toEqual([]);
      expect(signal.isEmpty()).toBe(true);
      expect(signal.front()).toBeUndefined();
      expect(signal.dequeue()).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('should clear the queue', () => {
      signal.clear();
      expect(signal()).toEqual([]);
      expect(signal.isEmpty()).toBe(true);
      expect(signal.size()).toBe(0);
      expect(signal.front()).toBeUndefined();
    });
  });

  describe('set and update', () => {
    it('should replace the queue with set', () => {
      signal.set([7, 8]);
      expect(signal()).toEqual([7, 8]);
      expect(signal.size()).toBe(2);
      expect(signal.front()).toBe(7);
    });

    it('should deep clone with set', () => {
      const arr = [9, 10];
      signal.set(arr);
      arr[0] = 42;
      expect(signal()).toEqual([9, 10]);
    });

    it('should update the queue using update', () => {
      signal.update((queue) => queue.map((x) => x * 2));
      expect(signal()).toEqual([2, 4, 6]);
    });

    it('should support empty queue update', () => {
      const empty = queueSignal<number>([]);
      empty.update(() => [5]);
      expect(empty()).toEqual([5]);
    });
  });

  describe('asArray computed', () => {
    it('should return a copy of the queue', () => {
      const arr = signal.asArray();
      expect(arr).toEqual([1, 2, 3]);
      arr[0] = 99;
      expect(signal()).toEqual([1, 2, 3]);
    });
  });

  describe('asReadonly', () => {
    let readonly: QueueSignal<number>;

    beforeEach(() => {
      readonly = signal.asReadonly();
    });

    it('should reflect internal updates', () => {
      signal.enqueue(9);
      expect(readonly()).toEqual([1, 2, 3, 9]);
      expect(readonly.size()).toBe(4);
      expect(readonly.front()).toBe(1);
    });

    it('should provide computed helpers and peek', () => {
      expect(readonly.isEmpty()).toBe(false);
      expect(readonly.size()).toBe(3);
      expect(readonly.front()).toBe(1);
      expect(readonly.peek()).toBe(1);
      expect(readonly.asArray()).toEqual([1, 2, 3]);
    });
  });
});
