import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';

/**
  Detects when the user clicks outside a given element.

  @license
  Shamelessly stolen from [Christian Liebel](https://github.com/chliebel/angular2-click-outside)
*/
@Directive({ selector: '[ardClickOutside]' })
export class ClickOutsideDirective {
  constructor(private _elementRef: ElementRef) {}

  @Output('ardClickOutside')
  public clickOutside = new EventEmitter<MouseEvent>();

  @HostListener('document:mousedown', ['$event', '$event.target'])
  @HostListener('document:touchstart', ['$event', '$event.target'])
  public onClick(event: MouseEvent, target: HTMLElement): void {
    if (!target) return;

    const hostContainsTarget = this._elementRef.nativeElement.contains(target);
    if (!hostContainsTarget) {
      this.clickOutside.emit(event);
    }
  }
}
