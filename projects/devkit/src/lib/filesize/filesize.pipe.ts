import { Pipe, PipeTransform } from '@angular/core';
import { approximate } from 'more-rounding';

const filesizeMap = {
  k: 'k',
  M: 'M',
  B: 'G',
  T: 'T',
  Qa: 'P',
  Qi: 'E',
};

@Pipe({
  name: 'filesize',
})
export class ArdiumFilesizePipe implements PipeTransform {
  transform(
    value: number,
    precision: number = 2,
    useSpace: boolean = false,
  ): string {
    return (
      approximate(
        value,
        precision,
        undefined,
        undefined,
        filesizeMap,
        useSpace,
      ) + 'B'
    );
  }
}
