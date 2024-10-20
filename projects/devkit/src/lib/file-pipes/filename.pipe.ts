import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filename',
})
export class ArdiumFileNamePipe implements PipeTransform {
  transform(value: string | File): string {
    if (typeof value != 'string') {
      value = value.name;
    }
    return value.match(/^(.+)\.[^.]+$/)?.[1] ?? value;
  }
}
