import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filename',
  standalone: false,
})
export class ArdiumFileNamePipe implements PipeTransform {
  transform(value: string | File | null | undefined): string {
    if (!value) return '';
    if (typeof value != 'string') {
      value = value.name;
    }
    return value.match(/^(.+)\.[^.]+$/)?.[1] ?? value;
  }
}
