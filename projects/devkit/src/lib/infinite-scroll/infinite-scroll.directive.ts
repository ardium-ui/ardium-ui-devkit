import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { coerceNumberProperty } from './../coercion/number';
import { ARD_INFINITE_SCROLL_DEFAULTS } from './infinite-scroll.defaults';

export const ArdInfScrollTarget = {
  Host: 'host',
  HTML: 'html',
} as const;
export type ArdInfScrollTarget =
  (typeof ArdInfScrollTarget)[keyof typeof ArdInfScrollTarget];

@Directive({
  selector: '[ardInfScroll]',
  standalone: false,
})
export class ArdiumInfiniteScrollDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  protected readonly _DEFAULTS = inject(ARD_INFINITE_SCROLL_DEFAULTS);

  readonly ardInfScrollReachThreshold = output<void>();

  private _getElementRect(): DOMRect {
    return this.elementRef.nativeElement.getBoundingClientRect();
  }
  private _getElementScrollTop(): number {
    return this.elementRef.nativeElement.scrollTop;
  }
  private _getElementScrollHeight(): number {
    return this.elementRef.nativeElement.scrollHeight;
  }

  //! options
  readonly ardInfScrollThreshold = input<number, any>(
    this._DEFAULTS.threshold,
    {
      transform: (v) => coerceNumberProperty(v, this._DEFAULTS.threshold),
    },
  );
  readonly ardInfScrollActive = model<boolean>(true);

  readonly ardInfScrollTarget = input<ArdInfScrollTarget>(
    this._DEFAULTS.target,
  );

  //! event handlers
  @HostListener('scroll')
  onHostScroll() {
    if (!this.ardInfScrollActive()) return;

    if (this.ardInfScrollTarget() !== ArdInfScrollTarget.Host) {
      console.error(
        `DKT-NF1000: ardInfScroll directive has target set to "html", but the host element has just been scrolled. To ensure the directive functions properly, make the host element unscrollable.`,
      );
    }
    const { height } = this._getElementRect();
    const scrollTop = this._getElementScrollTop();
    const scrollHeight = this._getElementScrollHeight();
    const thresholdOffset = this.ardInfScrollThreshold();

    if (scrollTop + height >= scrollHeight - thresholdOffset) {
      this.ardInfScrollActive.set(false);
      this.ardInfScrollReachThreshold.emit();
    }
  }
  @HostListener('window:scroll')
  onWindowScroll() {
    if (!this.ardInfScrollActive()) return;
    if (this.ardInfScrollTarget() !== ArdInfScrollTarget.HTML) return;

    const { top, height } = this._getElementRect();
    const viewportHeight = window.innerHeight;
    const thresholdOffset = this.ardInfScrollThreshold();

    if (-1 * top + viewportHeight >= height - thresholdOffset) {
      this.ardInfScrollActive.set(false);
      this.ardInfScrollReachThreshold.emit();
    }
  }
}
