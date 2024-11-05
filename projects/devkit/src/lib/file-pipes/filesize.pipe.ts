import { Pipe, PipeTransform } from '@angular/core';

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
})
export class ArdiumFileSizePipe implements PipeTransform {
  transform(
    value: number | File | null | undefined,
    precision: number = 2,
    useSpace: boolean = true,
  ): string {
    if (!value) return '0 B';
    if (typeof value != 'number') {
      value = value.size;
    }
    if (value === 0) return '0 B';

    const index = FILE_SIZE_UNITS.findIndex((unit) => value < unit.size);

    const fileSizeUnit =
      index === -1
        ? FILE_SIZE_UNITS[FILE_SIZE_UNITS.length - 1]
        : FILE_SIZE_UNITS[index - 1];

    const convertedValue =
      fileSizeUnit.unit === 'B'
        ? value
        : (value / fileSizeUnit.size).toFixed(precision);
    const space = useSpace ? ' ' : '';

    return `${convertedValue}${space}${fileSizeUnit.unit}`;
  }
}
