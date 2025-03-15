import { computed, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { isNumber } from 'simple-bool';
import { RequireAtLeastOne, throttleSaveLast } from './utils';

export const ViewportRelation = {
  Above: 'above',
  Inside: 'inside',
  Below: 'below',
  Undefined: 'undefined',
} as const;
export type ViewportRelation =
  (typeof ViewportRelation)[keyof typeof ViewportRelation];

export interface ViewportMargins {
  top: number;
  bottom: number;
}

class ViewportMarginsImpl implements ViewportMargins {
  top: number = 0;
  bottom: number = 0;

  constructor(margin: ArdViewportObserverConfig['margin']) {
    if (isNumber(margin)) {
      this.top = margin;
      this.bottom = margin;
      return;
    }
    this.top = margin?.top ?? 0;
    this.bottom = margin?.bottom ?? 0;
  }
}

export interface ArdViewportObserverConfig {
  margin?: number | RequireAtLeastOne<{ top: number; bottom: number }>;
  throttleTime?: number;
};

export class ArdViewportObserverRef {
  constructor(
    public readonly element: HTMLElement,
    private readonly scroll$: Observable<void>,
    config?: ArdViewportObserverConfig,
  ) {
    setTimeout(() => {
      this._updateViewportRelation();
    }, 0);

    this._throttleTime = config?.throttleTime ?? 100;
    this._margins = new ViewportMarginsImpl(config?.margin);

    this._scrollSubscription = this.scroll$
      .pipe(throttleSaveLast(this._throttleTime))
      .subscribe(() => this._updateViewportRelation());
  }
  private readonly _throttleTime!: number;
  private readonly _margins!: ViewportMargins;
  private readonly _scrollSubscription!: Subscription;

  private readonly _viewportRelation = signal<ViewportRelation>(
    ViewportRelation.Undefined,
  );
  public readonly viewportRelation = this._viewportRelation.asReadonly();
  public readonly isInViewport = computed(() =>
    this.viewportRelation() === ViewportRelation.Undefined
      ? undefined
      : this.viewportRelation() === ViewportRelation.Inside,
  );

  private _updateViewportRelation() {
    const rect = this.element.getBoundingClientRect();
    const newRelation = this._getNewRelation(rect);
    this._viewportRelation.set(newRelation);
  }
  private _getNewRelation(rect: DOMRect) {
    if (rect.bottom < this._margins.top) return ViewportRelation.Above;
    if (rect.top > window.innerHeight - this._margins.bottom)
      return ViewportRelation.Below;
    return ViewportRelation.Inside;
  }

  private readonly _isDestroyed = signal(false);
  public readonly isDestroyed = this._isDestroyed.asReadonly();

  public recheck(): void {
    this._updateViewportRelation();
  }

  public destroy(): void {
    if (this.isDestroyed()) return;
    this._isDestroyed.set(true);
    this._scrollSubscription.unsubscribe();
  }

  public setMargin(topAndBottom: number): ArdViewportObserverRef;
  public setMargin(top: number, bottom: number): ArdViewportObserverRef;
  public setMargin(top: number, bottom: number = top): ArdViewportObserverRef {
    this._margins.top = top;
    this._margins.bottom = bottom;
    this._updateViewportRelation();
    return this;
  }
}
