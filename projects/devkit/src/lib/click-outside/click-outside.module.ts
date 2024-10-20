import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumClickOutsideDirective } from './click-outside.directive';

@NgModule({
  declarations: [ArdiumClickOutsideDirective],
  imports: [CommonModule],
  exports: [ArdiumClickOutsideDirective],
})
export class ArdiumClickOutsideModule {}
