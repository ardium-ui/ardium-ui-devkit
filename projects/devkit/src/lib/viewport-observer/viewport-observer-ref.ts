import { computed, Signal, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { isNumber } from 'simple-bool';
import { RequireAtLeastOne, throttleSaveLast } from './utils';

enum ViewportRelation {
  Above = 'above',
  PartiallyAbove = 'partially-above',
  Inside = 'inside',
  PartiallyBelow = 'partially-below',
  Below = 'below',
  Undefined = 'undefined',
}

class ViewportMargins {
  readonly top = signal<number>(0);
  readonly bottom = signal<number>(0);

  constructor(margin: ArdViewportObserverConfig['margin']) {
    if (isNumber(margin)) {
      this.top.set(margin);
      this.bottom.set(margin);
      return;
    }
    this.top.set(margin?.top ?? 0);
    this.bottom.set(margin?.bottom ?? 0);
  }
}

export interface ArdViewportObserverConfig {
  margin: number | RequireAtLeastOne<{ top: number; bottom: number }>;
  throttleTime: number;
}

export class ArdViewportObserverRef {
  constructor(
    public readonly element: HTMLElement,
    private readonly scroll$: Observable<void>,
    config: ArdViewportObserverConfig,
  ) {
    setTimeout(() => {
      this._updateViewportRelation();
    }, 0);

    this._throttleTime = config.throttleTime;
    this._margins = new ViewportMargins(config.margin);

    this._scrollSubscription = this.scroll$
      .pipe(throttleSaveLast(this._throttleTime))
      .subscribe(() => this._updateViewportRelation());
  }
  private readonly _throttleTime!: number;
  private readonly _margins!: ViewportMargins;
  public readonly margins = {
    top: this._margins.top.asReadonly(),
    bottom: this._margins.bottom.asReadonly(),
  } as { readonly top: Signal<number>; readonly bottom: Signal<number> };
  private readonly _scrollSubscription!: Subscription;

  private readonly _viewportRelation = signal<ViewportRelation>(
    ViewportRelation.Undefined,
  );
  public readonly viewportRelation = this._viewportRelation.asReadonly();
  public readonly isInViewport = computed(() =>
    this.viewportRelation() === ViewportRelation.Undefined
      ? undefined
      : this.viewportRelation() === ViewportRelation.Inside ||
        this.viewportRelation() === ViewportRelation.PartiallyAbove ||
        this.viewportRelation() === ViewportRelation.PartiallyBelow,
  );

  private _updateViewportRelation() {
    const rect = this.element.getBoundingClientRect();
    const newRelation = this._getNewRelation(rect);
    this._viewportRelation.set(newRelation);
  }
  private _getNewRelation(rect: DOMRect) {
    if (rect.bottom <= this._margins.top()) {
      return ViewportRelation.Above;
    }
    if (rect.bottom > this._margins.top() && rect.top < this._margins.top()) {
      return ViewportRelation.PartiallyAbove;
    }
    const bottomThreshold = window.innerHeight - this._margins.bottom();
    if (rect.top < bottomThreshold && rect.bottom > bottomThreshold) {
      return ViewportRelation.PartiallyBelow;
    }
    if (rect.top >= bottomThreshold) {
      return ViewportRelation.Below;
    }
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
    this._margins.top.set(top);
    this._margins.bottom.set(bottom);
    this._updateViewportRelation();
    return this;
  }
}
