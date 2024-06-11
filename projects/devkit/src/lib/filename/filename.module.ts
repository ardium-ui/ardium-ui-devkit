import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumFilenamePipe } from './filename.pipe';

@NgModule({
  declarations: [ArdiumFilenamePipe],
  imports: [CommonModule],
  exports: [ArdiumFilenamePipe],
})
export class ArdiumFilenamePipeModule {}
