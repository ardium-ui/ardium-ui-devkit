import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileext',
})
export class ArdiumFileExtensionPipe implements PipeTransform {
  transform(value: string | File | null | undefined, withDot: boolean = false): string | null {
    if (!value) return null;
    if (typeof value != 'string') {
      value = value.name;
    }
    const ext = value.match(/^.+\.([^.]+)$/)?.[1] ?? null;
    const dot = withDot ? '.' : '';
    return ext && dot + ext;
  }
}
