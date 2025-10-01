import { Pipe, PipeTransform } from "@angular/core";

/**
 * Formats a file name by removing its extension.
 *
 * @param {string | File | null | undefined} value - The file name or File object to extract the name without extension from.
 * @returns {string} - The file name without the extension, or the original input if no extension is found.
 * 
 * @example
 * formatFileName('image.png'); // -> 'image'
 * formatFileName('document.pdf'); // -> 'document'
 * formatFileName('my-component.component.ts'); // -> 'my-component.component'
 */
export function formatFileName(
  value: string | File | null | undefined
): string {
  if (!value) return "";
  if (typeof value != "string") {
    value = value.name;
  }
  return value.match(/^(.+)\.[^.]+$/)?.[1] ?? value;
}

/**
 * Pipe that transforms a file or file name into its name without the extension.
 *
 * @example
 * {{ 'image.png' | filename }} // -> 'image'
 * {{ 'document.pdf' | filename }} // -> 'document'
 * {{ 'my-component.component.ts' | filename }} // -> 'my-component.component'
 */
@Pipe({
  name: "filename",
  standalone: false,
})
export class ArdiumFileNamePipe implements PipeTransform {
  /**
   * Transforms the given value to its file name without the extension.
   *
   * @param {string | File | null | undefined} value - The file name or File object to extract the name without extension from.
   * @returns {string} - The file name without the extension.
   * 
   * @example
   * {{ 'image.png' | filename }} // -> 'image'
   * {{ 'document.pdf' | filename }} // -> 'document'
 * {{ 'my-component.component.ts' | filename }} // -> 'my-component.component'
   */
  transform(value: string | File | null | undefined): string {
    return formatFileName(value);
  }
}
