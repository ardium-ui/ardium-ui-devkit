import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoldDirective } from './hold.directive';

@NgModule({
  declarations: [HoldDirective],
  imports: [CommonModule],
  exports: [HoldDirective],
})
export class ArdiumHoldEventModule {}
