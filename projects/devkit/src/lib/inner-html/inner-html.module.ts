import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumInnerHTMLDirective } from './inner-html.directive';

@NgModule({
  declarations: [ArdiumInnerHTMLDirective],
  imports: [CommonModule],
  exports: [ArdiumInnerHTMLDirective],
})
export class ArdiumInnerHTMLModule {}
