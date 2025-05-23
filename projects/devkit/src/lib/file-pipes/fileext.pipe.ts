import { Inject, Pipe, PipeTransform } from '@angular/core';
import { ARD_FILEEXT_PIPE_DEFAULTS } from './fileext.defaults';

@Pipe({
  name: 'fileext',
  standalone: false,
})
export class ArdiumFileExtensionPipe implements PipeTransform {
  constructor(
    @Inject(ARD_FILEEXT_PIPE_DEFAULTS)
    private readonly _DEFAULTS: { widthDot: boolean },
  ) {}

  transform(
    value: string | File | null | undefined,
    withDot: boolean = this._DEFAULTS.widthDot,
  ): string | null {
    if (!value) return null;
    if (typeof value !== 'string') {
      value = value.name;
    }
    const ext = value.match(/^.+\.([^.]+)$/)?.[1] ?? null;
    const dot = withDot ? '.' : '';
    return ext ? dot + ext : null;
  }
}
