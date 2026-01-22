import { inject, Pipe, PipeTransform } from '@angular/core';
import { ARD_FILE_PIPES_DEFAULTS } from './file-pipes.defaults';

/**
 * Formats a file extension from a string or File object.
 *
 * @param {string | File | null | undefined} value - The file name or File object whose extension is to be extracted.
 * @param {boolean} [withDot=false] - Whether to include a dot ('.') before the file extension.
 * @returns {string | null} - The file extension, or null if no extension is found or if the input is invalid.
 * 
 * @example
 * formatFileExtension('image.png'); // -> 'png'
 * formatFileExtension('image.png', true); // -> '.png'
 */
export function formatFileExtension(
  value: string | File | null | undefined,
  withDot: boolean = false,
): string | null {
  if (!value) return null;
  if (typeof value !== 'string') {
    value = value.name;
  }
  const ext = value.match(/^.+\.([^.]+)$/)?.[1] ?? null;
  const dot = withDot ? '.' : '';
  return ext ? dot + ext : null;
}

/**
 * Pipe that transforms a file or file name into its extension.
 *
 * @example
 * {{ 'image.png' | fileext }} // -> 'png'
 * {{ 'image.png' | fileext: true }} // -> '.png'
 */
@Pipe({
  name: 'fileext',
  standalone: false,
})
export class ArdiumFileExtensionPipe implements PipeTransform {
  protected readonly _DEFAULTS = inject(ARD_FILE_PIPES_DEFAULTS);

  /**
   * Transforms the given value to its file extension.
   *
   * @param {string | File | null | undefined} value - The file name or File object to extract the extension from.
   * @param {boolean} withDot - Whether to include a dot before the extension (defaults to config value).
   * @returns {string | null} - The file extension or null if no extension is found.
   *
   *
   * @example
   * {{ 'image.png' | fileext }} // -> 'png'
   * {{ 'image.png' | fileext: true }} // -> '.png'
   */
  transform(
    value: string | File | null | undefined,
    withDot: boolean = this._DEFAULTS.extensionWithDot,
  ): string | null {
    return formatFileExtension(value, withDot);
  }
}
