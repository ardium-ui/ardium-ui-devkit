import { computed, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, filter, map, pairwise } from 'rxjs';
import { throttleSaveLast } from './throttleSaveLast';

export const ViewportRelation = {
  Above: 'above',
  Inside: 'inside',
  Below: 'below',
  Undefined: 'undefined',
} as const;
export type ViewportRelation = (typeof ViewportRelation)[keyof typeof ViewportRelation];

/**
 * Copied from [Microsoft Learn](https://learn.microsoft.com/en-us/javascript/api/@azure/keyvault-certificates/requireatleastone).
 */
type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type ArdViewportObserverConfig = {
  margin?: number | RequireAtLeastOne<{ top: number; bottom: number }>;
  throttleTime?: number;
};

export class ArdViewportObserverRef {
  constructor(
    public readonly element: HTMLElement,
    private readonly scroll$: Observable<void>,
    config?: ArdViewportObserverConfig
  ) {
    setTimeout(() => {
      this._checkViewportRelation();
    }, 0);

    this._throttleTime = config?.throttleTime ?? 100;
    this._margins = {
      top: (typeof config?.margin === 'number' ? config?.margin : config?.margin?.top) ?? 0,
      bottom: (typeof config?.margin === 'number' ? config?.margin : config?.margin?.bottom) ?? 0,
    };

    this._scrollSubscription = this.scroll$.pipe(throttleSaveLast(this._throttleTime)).subscribe(() => this._checkViewportRelation());
  }

  private readonly _throttleTime!: number;
  private readonly _margins!: { top: number; bottom: number };

  private readonly _viewportRelationSubject = new BehaviorSubject<ViewportRelation>(ViewportRelation.Undefined);
  public readonly viewportRelation = this._viewportRelationSubject.asObservable();
  public readonly isInViewport = this.viewportRelation.pipe(map(v => v === ViewportRelation.Inside));

  private readonly _leaveViewportSubject = new Subject<void>();
  public readonly leaveViewport = this._viewportRelationSubject.pipe(
    pairwise(),
    filter(([oldRelation, newRelation]) => {
      return newRelation !== ViewportRelation.Inside && (oldRelation === ViewportRelation.Inside || oldRelation === ViewportRelation.Undefined);
    }),
    map(() => undefined)
  );

  private readonly _enterViewportSubject = new Subject<void>();
  public readonly enterViewport = this._viewportRelationSubject.pipe(
    pairwise(),
    filter(([oldRelation, newRelation]) => {
      return newRelation === ViewportRelation.Inside && oldRelation !== ViewportRelation.Inside;
    }),
    map(() => undefined)
  );

  private readonly _scrollSubscription!: Subscription;

  private _checkViewportRelation() {
    const domRect = this.element.getBoundingClientRect();

    let newRelation!: ViewportRelation;

    if (domRect.bottom < this._margins.top) {
      newRelation = ViewportRelation.Above;
    } else if (domRect.top > window.innerHeight - this._margins.bottom) {
      newRelation = ViewportRelation.Below;
    } else {
      newRelation = ViewportRelation.Inside;
    }

    if (newRelation === this._viewportRelationSubject.getValue()) return;

    this._viewportRelationSubject.next(newRelation);
  }

  private readonly _isDestroyed = signal(false);
  public readonly isDestroyed = computed(() => this._isDestroyed());

  public destroy(): void {
    if (this.isDestroyed()) return;
    this._isDestroyed.set(true);
    this._scrollSubscription.unsubscribe();
    this._leaveViewportSubject.complete();
    this._enterViewportSubject.complete();
  }

  public setMargin(topAndBottom: number): ArdViewportObserverRef;
  public setMargin(top: number, bottom: number): ArdViewportObserverRef;
  public setMargin(top: number, bottom: number = top): ArdViewportObserverRef {
    this._margins.top = top;
    this._margins.bottom = bottom;
    this._checkViewportRelation();
    return this;
  }
}
