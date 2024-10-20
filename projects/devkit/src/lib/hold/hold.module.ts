import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumHoldDirective } from './hold.directive';

@NgModule({
  declarations: [ArdiumHoldDirective],
  imports: [CommonModule],
  exports: [ArdiumHoldDirective],
})
export class ArdiumHoldModule {}
