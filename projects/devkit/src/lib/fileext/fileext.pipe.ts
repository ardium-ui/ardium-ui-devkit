import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileext',
})
export class ArdiumFileextPipe implements PipeTransform {
  transform(value: string | File, withDot: boolean = false): string | null {
    if (typeof value != 'string') {
      value = value.name;
    }
    const parts = value.split('.');
    const dot = withDot ? '.' : '';
    return parts.length > 1 ? dot + parts.at(-1) : null;
  }
}
