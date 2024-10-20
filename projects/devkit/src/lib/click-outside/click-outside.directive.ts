import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  output,
} from '@angular/core';

/**
  Detects when the user clicks outside a given element.

  @license
  Shamelessly stolen from [Christian Liebel](https://github.com/chliebel/angular2-click-outside)
*/
@Directive({ selector: '[ardClickOutside]' })
export class ArdiumClickOutsideDirective {
  private readonly _elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  public readonly ardClickOutside = output<MouseEvent>();

  @HostListener('document:mousedown', ['$event', '$event.target'])
  @HostListener('document:touchstart', ['$event', '$event.target'])
  public onClick(event: MouseEvent, target: HTMLElement): void {
    if (!target) return;

    const hostContainsTarget = this._elementRef.nativeElement.contains(target);
    if (!hostContainsTarget) {
      this.ardClickOutside.emit(event);
    }
  }
}
