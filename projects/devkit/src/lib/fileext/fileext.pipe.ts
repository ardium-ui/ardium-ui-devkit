import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileext',
})
export class ArdiumFileextPipe implements PipeTransform {
  transform(value: string | File, withDot: boolean = false): string | null {
    if (typeof value != 'string') {
      value = value.name;
    }
    const ext = value.match(/^.+\.([^.]+)$/)?.[1] ?? null;
    const dot = withDot ? '.' : '';
    return ext && dot + ext;
  }
}
