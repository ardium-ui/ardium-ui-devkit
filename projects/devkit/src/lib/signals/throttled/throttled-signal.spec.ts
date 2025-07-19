import { fakeAsync, tick } from '@angular/core/testing';
import { throttledSignal } from './throttled-signal';

describe('throttledSignal', () => {
  it('should return a WritableSignal with initial value', () => {
    const s = throttledSignal('hello', 100);
    expect(s()).toBe('hello');
    expect(typeof s.set).toBe('function');
    expect(typeof s.update).toBe('function');
    expect(s.throttleTime).toBe(100);
  });

  it('should update immediately if called after throttle time', fakeAsync(() => {
    const s = throttledSignal(1, 200);
    s.set(2);
    expect(s()).toBe(2);

    tick(200);
    s.set(3);
    expect(s()).toBe(3);
  }));

  it('should NOT update value if set called again within throttle time', fakeAsync(() => {
    const s = throttledSignal(0, 100);
    s.set(1);
    expect(s()).toBe(1);

    s.set(2); // within throttle window, should NOT update yet
    expect(s()).toBe(1);

    tick(99);
    expect(s()).toBe(1);

    tick(1); // now throttle window passes, should update to 2
    expect(s()).toBe(2);
  }));

  it('should throttle rapid consecutive sets, only last one is applied', fakeAsync(() => {
    const s = throttledSignal(0, 100);
    s.set(1);
    expect(s()).toBe(1);

    s.set(2); // queued
    s.set(3); // replaces queued
    s.set(4); // replaces queued

    tick(100);
    expect(s()).toBe(4);

    // Next throttle window:
    s.set(5);
    tick(100);
    expect(s()).toBe(5);
  }));

  it('should update with update(fn) using throttle', fakeAsync(() => {
    const s = throttledSignal(10, 50);

    s.update((v) => v + 1);
    expect(s()).toBe(11);

    s.update((v) => v * 2); // within throttle, should queue (will be 22)
    tick(49);
    expect(s()).toBe(11);

    tick(1);
    expect(s()).toBe(22);
  }));

  it('should support multiple independent signals', fakeAsync(() => {
    const s1 = throttledSignal('a', 50);
    const s2 = throttledSignal('b', 100);

    s1.set('x');
    s2.set('y');
    expect(s1()).toBe('x');
    expect(s2()).toBe('y');

    s1.set('z'); // within throttle window, should queue
    s2.set('w'); // within throttle window, should queue

    tick(50);
    expect(s1()).toBe('z');
    expect(s2()).toBe('y');

    tick(50);
    expect(s2()).toBe('w');
  }));

  it('should assign throttleTime property correctly', () => {
    const s = throttledSignal('test', 500);
    expect(s.throttleTime).toBe(500);
  });

  it('should not call set if value does not change', fakeAsync(() => {
    const s = throttledSignal(100, 100);
    s.set(100);
    expect(s()).toBe(100);
    s.set(100); // no effect
    expect(s()).toBe(100);

    // try again after window
    tick(100);
    s.set(100);
    expect(s()).toBe(100);
  }));
});
