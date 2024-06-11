import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumFileextPipe } from './fileext.pipe';

@NgModule({
  declarations: [ArdiumFileextPipe],
  imports: [CommonModule],
  exports: [ArdiumFileextPipe],
})
export class ArdiumFileextPipeModule {}
