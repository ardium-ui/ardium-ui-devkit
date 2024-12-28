import { Pipe, PipeTransform } from '@angular/core';
import { escapeHTML } from './escape-html';

@Pipe({
  name: 'escapeHTML',
  standalone: false,
})
export class ArdiumEscapeHTMLPipe implements PipeTransform {
  transform(value: string): string {
    return escapeHTML(value);
  }
}
