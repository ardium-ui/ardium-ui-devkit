import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  DefaultUrlSerializer,
  Event,
  NavigationEnd,
  Router,
  UrlTree,
} from '@angular/router';
import { Subject } from 'rxjs';
import { queryParamSignal } from './query-param-signal';

class MockRouter {
  url = '/';
  readonly events = new Subject<Event>();

  private readonly serializer = new DefaultUrlSerializer();
  private navigationId = 0;

  parseUrl(url: string): UrlTree {
    return this.serializer.parse(url);
  }

  navigate(
    _: unknown[],
    extras: {
      queryParams?: Record<string, unknown>;
      queryParamsHandling?: 'merge' | '';
      replaceUrl?: boolean;
    },
  ): Promise<boolean> {
    const currentTree = this.parseUrl(this.url);
    const mergedParams =
      extras.queryParamsHandling === 'merge'
        ? { ...currentTree.queryParams, ...extras.queryParams }
        : { ...(extras.queryParams ?? {}) };

    const normalizedParams: Record<string, string> = {};
    for (const key of Object.keys(mergedParams)) {
      const value = mergedParams[key];
      if (value !== null && value !== undefined) {
        normalizedParams[key] = String(value);
      }
    }

    const queryString = new URLSearchParams(normalizedParams).toString();
    this.url = queryString ? `/?${queryString}` : '/';

    this.events.next(
      new NavigationEnd(this.navigationId++, this.url, this.url),
    );

    return Promise.resolve(true);
  }
}

describe('queryParamSignal', () => {
  let router: MockRouter;

  beforeEach(() => {
    router = new MockRouter();

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: router }],
    });
  });

  it('should update signal when query param changes externally', fakeAsync(() => {
    const signal = TestBed.runInInjectionContext(() =>
      queryParamSignal('initial', 'name'),
    );

    tick(0);

    router.navigate([], {
      queryParams: { name: 'external' },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    expect(signal()).toBe('external');
  }));

  it("should set initial value when a non-nullable signal's query param is set to null externally", fakeAsync(() => {
    const signal = TestBed.runInInjectionContext(() =>
      queryParamSignal('initial', { paramName: 'name', nonNullable: true }),
    );

    tick(0);

    router.navigate([], {
      queryParams: { name: 'external' },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    expect(signal()).toBe('external');

    tick(0);

    router.navigate([], {
      queryParams: { name: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    expect(signal()).toBe('initial');
  }));

  it('should not re-navigate when external update already matches signal state', fakeAsync(() => {
    const navigateSpy = spyOn(router, 'navigate').and.callThrough();

    const signal = TestBed.runInInjectionContext(() =>
      queryParamSignal('initial', 'name'),
    );

    tick(0);
    navigateSpy.calls.reset();

    router.navigate([], {
      queryParams: { name: 'external' },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    expect(signal()).toBe('external');
    expect(navigateSpy.calls.count()).toBe(1);
  }));

  it('should keep non-nullable signal value when url param is removed', fakeAsync(() => {
    const signal = TestBed.runInInjectionContext(() =>
      queryParamSignal('initial', { paramName: 'name', nonNullable: true }),
    );

    tick(0);

    router.navigate([], {
      queryParams: { name: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    expect(signal()).toBe('initial');
  }));
});
