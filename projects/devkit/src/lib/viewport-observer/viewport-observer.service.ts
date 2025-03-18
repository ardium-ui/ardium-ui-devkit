import {
  ElementRef,
  Injectable,
  OnDestroy,
  Renderer2,
  RendererFactory2,
  inject,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  ArdViewportObserverConfig,
  ArdViewportObserverRef,
} from './viewport-observer-ref';
import { ARD_VIEWPORT_OBSERVER_DEFAULTS } from './viewport-observer.defaults';

@Injectable({ providedIn: 'root' })
export class ArdiumViewportObserverService implements OnDestroy {
  private _lastWindowHeight = window.innerHeight;
  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);

    this.setScrollHost(document);

    this._resizeCleanupFn = this.renderer.listen(window, 'resize', () => {
      window.innerHeight !== this._lastWindowHeight &&
        this._scrollOrResizeSubject.next();
    });
  }

  protected readonly _DEFAULTS = inject(ARD_VIEWPORT_OBSERVER_DEFAULTS);

  private readonly renderer!: Renderer2;

  private readonly _scrollOrResizeSubject = new Subject<void>();
  private readonly scrollOrResize$ = this._scrollOrResizeSubject.asObservable();

  private readonly _registeredObservers: ArdViewportObserverRef[] = [];

  private _scrollCleanupFn!: () => void;
  private _resizeCleanupFn!: () => void;

  public setScrollHost(element: HTMLElement | Document): void {
    this._cleanupObservers();
    this._scrollCleanupFn = this.renderer.listen(element, 'scroll', () =>
      this._scrollOrResizeSubject.next(),
    );
  }

  public observeElement(
    element: HTMLElement | ElementRef<HTMLElement>,
    config?: Partial<ArdViewportObserverConfig>,
  ): ArdViewportObserverRef {
    const finalConfig = { ...this._DEFAULTS, ...(config ?? {}) };

    const vo = new ArdViewportObserverRef(
      element,
      this.scrollOrResize$,
      finalConfig,
    );
    this._registeredObservers.push(vo);
    return vo;
  }

  public observeById(
    id: string,
    config?: Partial<ArdViewportObserverConfig>,
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
    config?: Partial<ArdViewportObserverConfig>,
  ): ArdViewportObserverRef {
    const element = document.querySelector<HTMLElement>(query);

    if (!element) {
      throw new Error(
        `DKT-NF0002: Trying to observe an element by query, but no element matching "${query}" exists.`,
      );
    }
    return this.observeElement(element, config);
  }

  public recheckAll(): void {
    this._scrollOrResizeSubject.next();
  }

  private _cleanupObservers(): void {
    this._scrollCleanupFn?.();
    this._registeredObservers.forEach((obs) => obs.destroy());
  }
  ngOnDestroy(): void {
    this._cleanupObservers();
    this._resizeCleanupFn?.();
  }
}
