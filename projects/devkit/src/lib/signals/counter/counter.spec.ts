import {
  counterSignal,
  CounterSignal,
  WritableCounterSignal,
} from './counter';

describe('counterSignal', () => {
  let counter: WritableCounterSignal;

  beforeEach(() => {
    counter = counterSignal(10);
  });

  it('should initialize with the given value', () => {
    expect(counter()).toBe(10);
    expect(counter.value()).toBe(10);
    expect(counter.isReset()).toBe(true);
  });

  it('should increment and decrement', () => {
    counter.increment();
    expect(counter()).toBe(11);

    counter.increment(2);
    expect(counter()).toBe(13);

    counter.decrement();
    expect(counter()).toBe(12);

    counter.decrement(3);
    expect(counter()).toBe(9);
  });

  it('should set and update the value', () => {
    counter.set(42);
    expect(counter()).toBe(42);

    counter.update((v) => v * 2);
    expect(counter()).toBe(84);
  });

  it('should reset to the initial value', () => {
    counter.set(25);
    expect(counter()).toBe(25);
    counter.reset();
    expect(counter()).toBe(10);
    expect(counter.isReset()).toBe(true);
  });

  it('should set base value and reset to it', () => {
    counter.setBaseValue(99);
    counter.set(1);
    counter.reset();
    expect(counter()).toBe(99);
    expect(counter.isReset()).toBe(true);
  });

  it('should set isReset to false after mutation', () => {
    counter.increment();
    expect(counter.isReset()).toBe(false);
    counter.set(77);
    expect(counter.isReset()).toBe(false);
  });

  it('asReadonly should provide a safe, read-only view', () => {
    const ro: CounterSignal = counter.asReadonly();

    expect(ro()).toBe(10);
    expect(ro.value()).toBe(10);

    // It should not have mutator methods
    expect((ro as any).increment).toBeUndefined();
    expect((ro as any).decrement).toBeUndefined();
    expect((ro as any).set).toBeUndefined();

    // Value should react to changes in the original signal
    counter.increment(2);
    expect(ro()).toBe(12);
    expect(ro.value()).toBe(12);
  });

  it('isReset signal should reactively update', () => {
    expect(counter.isReset()).toBe(true);
    counter.increment();
    expect(counter.isReset()).toBe(false);
    counter.reset();
    expect(counter.isReset()).toBe(true);
  });

  it('should return correct value from value()', () => {
    expect(counter.value()).toBe(10);
    counter.increment();
    expect(counter.value()).toBe(11);
  });
});
