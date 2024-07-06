import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumInfiniteScrollDirective } from './infinite-scroll.directive';

@NgModule({
  declarations: [ArdiumInfiniteScrollDirective],
  imports: [CommonModule],
  exports: [ArdiumInfiniteScrollDirective],
})
export class ArdiumInfiniteScrollModule {}
