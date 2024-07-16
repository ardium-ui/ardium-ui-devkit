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

@Directive({
  selector: '[ardInfScroll]',
})
export class ArdiumInfiniteScrollDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  readonly ardInfScrollReachThreshold = output<void>();

  private _getElementRect(): DOMRect {
    return this.elementRef.nativeElement.getBoundingClientRect();
  }
  private _getScrollTop(): number {
    return this.elementRef.nativeElement.scrollTop;
  }
  private _getScrollHeight(): number {
    return this.elementRef.nativeElement.scrollHeight;
  }

  //! options
  readonly ardInfScrollTarget = input<number, any>(200, {
    transform: (v) => coerceNumberProperty(v, 200),
  });
  readonly ardInfScrollActive = model<boolean>(true, {});

  //! event handlers
  @HostListener('scroll')
  onHostScroll() {
    if (!this.ardInfScrollActive()) return;

    const { height } = this._getElementRect();
    const scrollTop = this._getScrollTop();
    const scrollHeight = this._getScrollHeight();
    if (scrollTop + height > scrollHeight - this.ardInfScrollTarget()) {
      this.ardInfScrollActive.set(false);
      this.ardInfScrollReachThreshold.emit();
    }
  }
}
