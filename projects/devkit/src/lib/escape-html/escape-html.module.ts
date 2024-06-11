import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumEscapeHTMLPipe } from './escape-html.pipe';

@NgModule({
  declarations: [ArdiumEscapeHTMLPipe],
  imports: [CommonModule],
  exports: [ArdiumEscapeHTMLPipe],
})
export class ArdiumEscapeHTMLModule {}
