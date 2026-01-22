import { inject, Pipe, PipeTransform } from '@angular/core';
import { ARD_FILE_PIPES_DEFAULTS } from './file-pipes.defaults';

const FILE_SIZE_UNITS = [
  { unit: 'B', size: 1 }, // bytes
  { unit: 'kB', size: 1e3 }, // kilobytes
  { unit: 'MB', size: 1e6 }, // megabytes
  { unit: 'GB', size: 1e9 }, // gigabytes
  { unit: 'TB', size: 1e12 }, // terabytes
  { unit: 'PB', size: 1e15 }, // petabytes
  { unit: 'EB', size: 1e18 }, // exabytes
  { unit: 'ZB', size: 1e21 }, // zettabytes
  { unit: 'YB', size: 1e24 }, // yottabytes
];

/**
 * Formats a file size into a human-readable string with the appropriate unit.
 *
 * @param {number | File | null | undefined} value - The file size as a number or a File object whose size is to be extracted.
 * @param {number} [precision=2] - The number of decimal places to round to. Default is 2.
 * @param {boolean} [useSpace=true] - Whether to include a space between the number and the unit. Default is true.
 * @returns {string} - The formatted file size with the unit (e.g., '1.5 MB', '10 kB').
 *
 * @example
 * formatFileSize(1024); // -> '1.00 kB'
 * formatFileSize(1048576); // -> '1.00 MB'
 * formatFileSize(1048576, 3); // -> '1.000 MB'
 * formatFileSize(1048576, 3, false); // -> '1.000MB'
 * formatFileSize(967680, 0); // -> '945 kB'
 */
export function formatFileSize(
  value: number | File | null | undefined,
  precision: number = 2,
  useSpace: boolean = true,
): string {
  const space = useSpace ? ' ' : '';
  if (!value) return `0${space}B`;
  if (typeof value != 'number') {
    value = value.size;
  }
  if (value === 0) return `0${space}B`;

  const index = FILE_SIZE_UNITS.findIndex((unit) => value < unit.size);

  const fileSizeUnit =
    index === -1
      ? FILE_SIZE_UNITS[FILE_SIZE_UNITS.length - 1]
      : FILE_SIZE_UNITS[index - 1];

  const convertedValue =
    fileSizeUnit.unit === 'B'
      ? value
      : (value / fileSizeUnit.size).toFixed(precision);

  return `${convertedValue}${space}${fileSizeUnit.unit}`;
}

/**
 * Pipe that transforms a file or file size into a human-readable file size string.
 *
 * @example
 * {{ 1024 | filesize }} // -> '1.00 kB'
 * {{ 1048576 | filesize }} // -> '1.00 MB'
 * {{ 1048576 | filesize:3 }} // -> '1.000 MB'
 * {{ 1048576 | filesize:3:false }} // -> '1.000MB'
 * {{ 967680 | filesize:0 }} // -> '945 kB'
 */
@Pipe({
  name: 'filesize',
  standalone: false,
})
export class ArdiumFileSizePipe implements PipeTransform {
  /** Default configuration for the pipe */
  protected readonly _DEFAULTS = inject(ARD_FILE_PIPES_DEFAULTS);

  /**
   * Transforms the given value to a human-readable file size string.
   *
   * @param {number | File | null | undefined} value - The file size as a number or File object whose size is to be extracted.
   * @param {number} precision - The number of decimal places to round to (defaults to config value).
   * @param {boolean} useSpace - Whether to include a space between the number and the unit (defaults to config value).
   * @returns {string} - The formatted file size string (e.g., '1.5 MB', '10 kB').
   *
   * @example
   * {{ 1024 | filesize }} // -> '1.00 kB'
   * {{ 1048576 | filesize }} // -> '1.00 MB'
   * {{ 1048576 | filesize:3 }} // -> '1.000 MB'
   * {{ 1048576 | filesize:3:false }} // -> '1.000MB'
   * {{ 967680 | filesize:0 }} // -> '945 kB'
   */
  transform(
    value: number | File | null | undefined,
    precision: number = this._DEFAULTS.sizePrecision,
    useSpace: boolean = this._DEFAULTS.sizeUseSpace,
  ): string {
    return formatFileSize(value, precision, useSpace);
  }
}
