import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumFilesizePipe } from './filesize.pipe';

@NgModule({
  declarations: [ArdiumFilesizePipe],
  imports: [CommonModule],
  exports: [ArdiumFilesizePipe],
})
export class ArdiumFilesizePipeModule {}
