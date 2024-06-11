import { Directive, Input, ElementRef, SimpleChanges } from '@angular/core';
import { escapeHTML } from '../escape-html/escape-html';

@Directive({
  selector: '[ardInnerHTML]',
})
export class ArdiumInnerHTMLDirective {
  @Input() ardInnerHTML: string = '';
  @Input() ardEscapeInnerHTML: boolean = false;

  constructor(private element: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges) {
    this.element.nativeElement.innerHTML = this.ardEscapeInnerHTML ? escapeHTML(this.ardInnerHTML) : this.ardInnerHTML;
  }
}
