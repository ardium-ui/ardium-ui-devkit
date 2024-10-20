import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumFileExtensionPipe } from './fileext.pipe';
import { ArdiumFileNamePipe } from './filename.pipe';
import { ArdiumFileSizePipe } from './filesize.pipe';

@NgModule({
  declarations: [
    ArdiumFileExtensionPipe,
    ArdiumFileNamePipe,
    ArdiumFileSizePipe,
  ],
  imports: [CommonModule],
  exports: [ArdiumFileExtensionPipe, ArdiumFileNamePipe, ArdiumFileSizePipe],
})
export class ArdiumFilePipesModule {}
