import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { coerceBooleanProperty } from '../coercion/boolean';
import { escapeHTML } from '../escape-html/escape-html';

@Directive({
  selector: '[ardInnerHTML]',
})
export class ArdiumInnerHTMLDirective {
  private readonly element = inject(ElementRef<HTMLElement>);

  readonly ardInnerHTML = input<string>('');
  readonly ardEscapeInnerHTML = input<boolean, any>(false, {
    transform: (v) => coerceBooleanProperty(v),
  });

  constructor() {
    effect(() => {
      this.element.nativeElement.innerHTML = this.ardEscapeInnerHTML()
        ? escapeHTML(this.ardInnerHTML())
        : this.ardInnerHTML();
    });
  }
}
