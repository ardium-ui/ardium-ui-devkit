import { Inject, Pipe, PipeTransform } from '@angular/core';
import { ARD_FILESIZE_PIPE_DEFAULTS } from './filesize.defaults';

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

@Pipe({
  name: 'filesize',
  standalone: false,
})
export class ArdiumFileSizePipe implements PipeTransform {
  constructor(
    @Inject(ARD_FILESIZE_PIPE_DEFAULTS)
    private readonly _DEFAULTS: { precision: number; useSpace: boolean },
  ) {}

  transform(
    value: number | File | null | undefined,
    precision: number = this._DEFAULTS.precision,
    useSpace: boolean = this._DEFAULTS.useSpace,
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
}
