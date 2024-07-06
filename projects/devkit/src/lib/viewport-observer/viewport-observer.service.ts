import { Injectable, OnDestroy, Renderer2, inject } from '@angular/core';
import { Subject } from 'rxjs';
import {
  ArdViewportObserverConfig,
  ArdViewportObserverRef,
} from './viewport-observer-ref';

@Injectable({ providedIn: 'root' })
export class ArdiumViewportObserverService implements OnDestroy {
  constructor() {
    this.setScrollHost(document);
  }

  private readonly renderer = inject(Renderer2);

  private readonly _scrollSubject = new Subject<void>();
  private readonly scroll$ = this._scrollSubject.asObservable();

  private readonly _registeredObservers: ArdViewportObserverRef[] = [];

  private _scrollCleanupFn!: () => void;

  public setScrollHost(element: HTMLElement | Document): void {
    this.ngOnDestroy();
    this._scrollCleanupFn = this.renderer.listen(element, 'scroll', () => {
      this._scrollSubject.next();
    });
  }

  public observeElement(
    element: HTMLElement,
    config?: ArdViewportObserverConfig,
  ): ArdViewportObserverRef {
    const vo = new ArdViewportObserverRef(element, this.scroll$, config);
    this._registeredObservers.push(vo);
    return vo;
  }

  public observeById(
    id: string,
    config?: ArdViewportObserverConfig,
  ): ArdViewportObserverRef {
    const element = document.getElementById(id);

    if (!element) {
      throw new Error(
        `DKT-NF0001: Trying to observe an element by id, but the element with id "${id}" does not exist.`,
      );
    }
    return this.observeElement(element, config);
  }

  public observeByQuery(
    query: string,
    config?: ArdViewportObserverConfig,
  ): ArdViewportObserverRef {
    const element = document.querySelector<HTMLElement>(query);

    if (!element) {
      throw new Error(
        `DKT-NF0002: Trying to observe an element by query, but no element matching "${query}" exists.`,
      );
    }
    return this.observeElement(element, config);
  }

  public triggerRecheck(): void {
    this._scrollSubject.next();
  }

  ngOnDestroy(): void {
    this._scrollCleanupFn?.();
    this._registeredObservers.forEach((obs) => obs.destroy());
  }
}
