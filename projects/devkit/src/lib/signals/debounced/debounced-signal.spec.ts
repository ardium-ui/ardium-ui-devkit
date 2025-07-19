import { fakeAsync, tick } from '@angular/core/testing';
import { debouncedSignal } from './debounced-signal';

describe('debouncedSignal', () => {
  it('should return a WritableSignal with initial value', () => {
    const s = debouncedSignal('hello', 100);
    expect(s()).toBe('hello');
    expect(typeof s.set).toBe('function');
    expect(typeof s.update).toBe('function');
    expect(s.debounceTime).toBe(100);
  });

  it('should not update value immediately after set', fakeAsync(() => {
    const s = debouncedSignal(1, 200);
    s.set(2);
    expect(s()).toBe(1); // Should still be the initial value

    tick(199);
    expect(s()).toBe(1); // Still not updated

    tick(1); // 200ms passed
    expect(s()).toBe(2);
  }));

  it('should debounce rapid consecutive sets', fakeAsync(() => {
    const s = debouncedSignal(0, 100);

    s.set(1);
    tick(50);
    s.set(2); // should reset the debounce timer
    tick(50);
    s.set(3); // should reset again

    tick(99);
    expect(s()).toBe(0); // Not yet updated

    tick(1); // 100ms after last set
    expect(s()).toBe(3);
  }));

  it('should support multiple independent signals', fakeAsync(() => {
    const s1 = debouncedSignal('a', 50);
    const s2 = debouncedSignal('b', 100);

    s1.set('x');
    s2.set('y');

    tick(50);
    expect(s1()).toBe('x');
    expect(s2()).toBe('b');

    tick(50);
    expect(s2()).toBe('y');
  }));

  it('should call update with debounced behavior', fakeAsync(() => {
    const s = debouncedSignal(5, 30);
    s.update((v) => v + 1); // Should debounce

    tick(29);
    expect(s()).toBe(5);

    tick(1);
    expect(s()).toBe(6);
  }));

  it('should handle multiple sets, only final one applies', fakeAsync(() => {
    const s = debouncedSignal(100, 100);

    s.set(101);
    tick(50);
    s.set(102);
    tick(50);
    s.set(103);

    // 100ms after last set
    tick(100);

    expect(s()).toBe(103);
  }));

  it('should assign debounceTime property correctly', () => {
    const s = debouncedSignal('test', 500);
    expect(s.debounceTime).toBe(500);
  });
});
