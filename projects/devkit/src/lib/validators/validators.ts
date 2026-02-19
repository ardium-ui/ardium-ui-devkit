import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

const ASCII_REGEX = /^[\x00-\x7F]*$/;
const BASE64_REGEX =
  /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
const HEX_REGEX = /^[0-9a-fA-F]+$/;
const OCTAL_REGEX = /^[0-7]+$/;
const BINARY_REGEX = /^[0-1]+$/;
const IPV4_REGEX =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const IPV6_REGEX =
  /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:))|(([0-9a-fA-F]{1,4}:){1,7}:)|(([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4})|(([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2})|(([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3})|(([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4})|(([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5})|([0-9a-fA-F]{1,4}:)((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])$/;
const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const HEX_COLOR_REGEX = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const RGB_COLOR_REGEX =
  /^rgb\(\s*(0|255|25[0-4]|2[0-4][0-9]|1?[0-9]{1,2})\s*,\s*(0|255|25[0-4]|2[0-4][0-9]|1?[0-9]{1,2})\s*,\s*(0|255|25[0-4]|2[0-4][0-9]|1?[0-9]{1,2})\s*\)$/;
const HSL_COLOR_REGEX =
  /^hsl\(\s*(360|3[0-5][0-9]|[12]?[0-9]{1,2})\s*,\s*(100|[1-9]?[0-9])%\s*,\s*(100|[1-9]?[0-9])%\s*\)$/;

export class ExtValidators {
  /**
   * Validator that requires the control's value to contain a certain substring.
   *
   * @param seed The substring that the control's value should contain.
   * @returns A validator function that returns an error map with the `contains` property if the validation check fails, otherwise `null`.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl('ng', ExtValidators.contains('angular'));
   * console.log(control.errors);
   * // { contains: { actualValue: 'ng', shouldContain: 'angular' } }
   *
   * const control = new FormControl('I love angular', ExtValidators.contains('angular'));
   * console.log(control.errors);
   * // null
   * ```
   */
  static contains(seed: string): ValidatorFn {
    return (control) => {
      const value = control.value;
      if (typeof value !== 'string') {
        // don't validate empty values to allow optional controls
        // don't validate non-string values to avoid false positives
        return null;
      }
      if (value.includes(seed)) {
        return null;
      }
      return { contains: { actualValue: value, shouldContain: seed } };
    };
  }

  /**
   * Validator that requires the control's value to not contain a certain substring.
   *
   * @param seed The substring that the control's value should not contain.
   * @returns A validator function that returns an error map with the `notContains` property if the validation check fails, otherwise `null`.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl('angular', ExtValidators.notContains('ng'));
   * console.log(control.errors);
   * // { notContains: { actualValue: 'angular', shouldNotContain: 'ng' } }
   *
   * const control = new FormControl('angular', ExtValidators.notContains('react'));
   * console.log(control.errors);
   * // null
   * ```
   */
  static notContains(seed: string): ValidatorFn {
    return (control) => {
      const value = control.value;
      if (typeof value !== 'string') {
        // don't validate empty values to allow optional controls
        // don't validate non-string values to avoid false positives
        return null;
      }
      if (!value.includes(seed)) {
        return null;
      }
      return { notContains: { actualValue: value, shouldNotContain: seed } };
    };
  }

  /**
   * Validator that requires the control's value to be in lowercase.
   *
   * @returns An error map with the `lowercase` property if the validation check fails, otherwise `null`.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl('Angular', ExtValidators.lowercase);
   * console.log(control.errors);
   * // { lowercase: { actualValue: 'Angular' } }
   *
   * const control = new FormControl('angular', ExtValidators.lowercase);
   * console.log(control.errors);
   * // null
   * ```
   */
  static lowercase(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') {
      // don't validate empty values to allow optional controls
      // don't validate non-string values to avoid false positives
      return null;
    }
    if (value === value.toLowerCase()) {
      return null;
    }
    return { lowercase: { actualValue: value } };
  }

  /**
   * Validator that requires the control's value to be in uppercase.
   *
   * @returns An error map with the `uppercase` property if the validation check fails, otherwise `null`.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl('Angular', ExtValidators.uppercase);
   * console.log(control.errors);
   * // { uppercase: { actualValue: 'Angular' } }
   *
   * const control = new FormControl('ANGULAR', ExtValidators.uppercase);
   * console.log(control.errors);
   * // null
   * ```
   */
  static uppercase(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') {
      // don't validate empty values to allow optional controls
      // don't validate non-string values to avoid false positives
      return null;
    }
    if (value === value.toUpperCase()) {
      return null;
    }
    return { uppercase: { actualValue: value } };
  }

  /**
   * Validator that wraps the built-in `Validators.pattern` but allows specifying a custom error name instead of the default `pattern` key.
   *
   * @param name The error name to use when the validation fails.
   * @param pattern A string or RegExp to test the control's value against.
   * @returns A `ValidatorFn` that returns an error map with the given `name` when the value does not match the pattern.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl('abc-123', ExtValidators.namedPattern('sku', /^[A-Z]{3}-\d{3}$/));
   * console.log(control.errors);
   * // { sku: { actualValue: 'abc-123' } }
   *
   * const control = new FormControl('ABC-123', ExtValidators.namedPattern('sku', /^[A-Z]{3}-\d{3}$/));
   * console.log(control.errors);
   * // null
   * ```
   */
  static namedPattern(name: string, pattern: string | RegExp): ValidatorFn {
    const validator = Validators.pattern(pattern);
    return (control) => {
      const validationResult: ValidationErrors | null = validator(control);
      if (validationResult === null) {
        return null;
      }
      return {
        [name]: { actualValue: validationResult['pattern'].actualValue },
      };
    };
  }

  /**
   * Validator that requires the control's numeric value to be divisible by the given divisor.
   *
   * - Accepts numbers or numeric strings (uses `parseFloat`).
   * - Does not validate `null`/`undefined` values to allow optional controls.
   * - If `divisor` is `null`/`undefined`/`0`, validation is skipped and `null` is returned.
   *
   * @param divisor The number the control's value must be divisible by.
   * @returns A validator function that returns `{ divisibleBy: { divisor, actual } }` when invalid, otherwise `null`.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl('12', ExtValidators.divisibleBy(5));
   * console.log(control.errors);
   * // { divisibleBy: { divisor: 5, actual: '12' } }
   *
   * const control = new FormControl('15', ExtValidators.divisibleBy(5));
   * console.log(control.errors);
   * // null
   * ```
   */
  static divisibleBy(divisor: number): ValidatorFn {
    return (control) => {
      if (control.value == null || divisor == null || divisor === 0) {
        return null; // don't validate empty values to allow optional controls
      }
      const value = parseFloat(control.value);
      // Controls with NaN values after parsing should be treated as not having a
      // divisor, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-min
      return !isNaN(value) && value % divisor !== 0
        ? { divisibleBy: { divisor: divisor, actual: control.value } }
        : null;
    };
  }

  /**
   * Validator that requires the control's value to contain only ASCII characters.
   *
   * @param control The form control to validate.
   * @returns `null` when valid (or when value is not a string), otherwise `{ ascii: { actualValue } }`.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl('Zażółć', ExtValidators.ascii);
   * console.log(control.errors);
   * // { ascii: { actualValue: 'Zażółć' } }
   *
   * const control = new FormControl('Hello!', ExtValidators.ascii);
   * console.log(control.errors);
   * // null
   * ```
   */
  static ascii(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') {
      // don't validate empty values to allow optional controls
      // don't validate non-string values to avoid false positives
      return null;
    }
    return ASCII_REGEX.test(value) ? null : { ascii: { actualValue: value } };
  }

  /**
   * Validator that requires the control's value to be valid Base64 (RFC 4648-style alphabet).
   *
   * Notes:
   * - This checks *format* (characters + padding), not whether the decoded bytes are meaningful.
   * - Non-string / empty values are not validated to allow optional controls.
   *
   * @param control The form control to validate.
   * @returns `null` when valid (or when value is not a string), otherwise `{ base64: { actualValue } }`.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl('hello world', ExtValidators.base64);
   * console.log(control.errors);
   * // { base64: { actualValue: 'hello world' } }
   *
   * const control = new FormControl('aGVsbG8=', ExtValidators.base64);
   * console.log(control.errors);
   * // null
   * ```
   */
  static base64(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') {
      // don't validate empty values to allow optional controls
      // don't validate non-string values to avoid false positives
      return null;
    }
    return BASE64_REGEX.test(value) ? null : { base64: { actualValue: value } };
  }

  /**
   * Validator that requires the control's value to be a hexadecimal string.
   *
   * - Accepts upper and lower case characters.
   * - Does not allow `0x` prefix (pure hex digits only).
   *
   * @param control The form control to validate.
   * @returns `null` when valid (or when value is not a string), otherwise `{ hex: { actualValue } }`.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl('0xdeadbeef', ExtValidators.hex);
   * console.log(control.errors);
   * // { hex: { actualValue: '0xdeadbeef' } }
   *
   * const control = new FormControl('deadBEEF', ExtValidators.hex);
   * console.log(control.errors);
   * // null
   * ```
   */
  static hex(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') {
      // don't validate empty values to allow optional controls
      // don't validate non-string values to avoid false positives
      return null;
    }
    return HEX_REGEX.test(value) ? null : { hex: { actualValue: value } };
  }

  /**
   * Validator that requires the control's value to be an octal string (digits 0-7 only).
   *
   * @param control The form control to validate.
   * @returns `null` when valid (or when value is not a string), otherwise `{ octal: { actualValue } }`.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl('128', ExtValidators.octal);
   * console.log(control.errors);
   * // { octal: { actualValue: '128' } }
   *
   * const control = new FormControl('755', ExtValidators.octal);
   * console.log(control.errors);
   * // null
   * ```
   */
  static octal(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') {
      // don't validate empty values to allow optional controls
      // don't validate non-string values to avoid false positives
      return null;
    }
    return OCTAL_REGEX.test(value) ? null : { octal: { actualValue: value } };
  }

  /**
   * Validator that requires the control's value to be a binary string (digits 0-1 only).
   *
   * @param control The form control to validate.
   * @returns `null` when valid (or when value is not a string), otherwise `{ binary: { actualValue } }`.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl('10201', ExtValidators.binary);
   * console.log(control.errors);
   * // { binary: { actualValue: '10201' } }
   *
   * const control = new FormControl('101010', ExtValidators.binary);
   * console.log(control.errors);
   * // null
   * ```
   */
  static binary(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') {
      // don't validate empty values to allow optional controls
      // don't validate non-string values to avoid false positives
      return null;
    }
    return BINARY_REGEX.test(value) ? null : { binary: { actualValue: value } };
  }

  /**
   * Validator that requires the control's value to be a valid IP address.
   *
   * @param ipType The required IP version (`4` for IPv4, `6` for IPv6).
   * @returns A validator function that returns `{ ipAddress: { requiredType, actualValue } }` when invalid, otherwise `null`.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl('999.1.2.3', ExtValidators.ipAddress(4));
   * console.log(control.errors);
   * // { ipAddress: { requiredType: 'IPv4', actualValue: '999.1.2.3' } }
   *
   * const control = new FormControl('127.0.0.1', ExtValidators.ipAddress(4));
   * console.log(control.errors);
   * // null
   * ```
   *
   * ```ts
   * const control = new FormControl('not-an-ip', ExtValidators.ipAddress(6));
   * console.log(control.errors);
   * // { ipAddress: { requiredType: 'IPv6', actualValue: 'not-an-ip' } }
   *
   * const control = new FormControl('::1', ExtValidators.ipAddress(6));
   * console.log(control.errors);
   * // null
   * ```
   */
  static ipAddress(ipType: 4 | 6): ValidatorFn {
    return (control) => {
      const value = control.value;
      if (typeof value !== 'string') {
        // don't validate empty values to allow optional controls
        // don't validate non-string values to avoid false positives
        return null;
      }

      if (ipType === 4) {
        return IPV4_REGEX.test(value)
          ? null
          : { ipAddress: { requiredType: 'IPv4', actualValue: value } };
      }
      return IPV6_REGEX.test(value)
        ? null
        : { ipAddress: { requiredType: 'IPv6', actualValue: value } };
    };
  }

  /**
   * Validator that requires the control's value to be a UUID string.
   *
   * Notes:
   * - This validates the canonical 8-4-4-4-12 hex format.
   * - It does not enforce UUID version/variant bits (it accepts any hex in those positions).
   *
   * @param control The form control to validate.
   * @returns `null` when valid (or when value is not a string), otherwise `{ uuid: { actualValue } }`.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl('550e8400-e29b-41d4-a716-44665544ZZZZ', ExtValidators.uuid);
   * console.log(control.errors);
   * // { uuid: { actualValue: '550e8400-e29b-41d4-a716-44665544ZZZZ' } }
   *
   * const control = new FormControl('550e8400-e29b-41d4-a716-446655440000', ExtValidators.uuid);
   * console.log(control.errors);
   * // null
   * ```
   */
  static uuid(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') {
      // don't validate empty values to allow optional controls
      // don't validate non-string values to avoid false positives
      return null;
    }
    return UUID_REGEX.test(value) ? null : { uuid: { actualValue: value } };
  }

  /**
   * Validator that requires the control's value to be a hex color.
   *
   * Accepts:
   * - `#RGB` / `RGB`
   * - `#RRGGBB` / `RRGGBB`
   *
   * @param control The form control to validate.
   * @returns `null` when valid (or when value is not a string), otherwise `{ hexColor: { actualValue } }`.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl('#12FG00', ExtValidators.hexColor);
   * console.log(control.errors);
   * // { hexColor: { actualValue: '#12FG00' } }
   *
   * const control = new FormControl('#ff00aa', ExtValidators.hexColor);
   * console.log(control.errors);
   * // null
   * ```
   */
  static hexColor(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') {
      // don't validate empty values to allow optional controls
      // don't validate non-string values to avoid false positives
      return null;
    }
    return HEX_COLOR_REGEX.test(value)
      ? null
      : { hexColor: { actualValue: value } };
  }

  /**
   * Validator that requires the control's value to be an `rgb(r, g, b)` CSS color string.
   *
   * Constraints:
   * - `r`, `g`, `b` must be integers in the range 0..255
   * - Whitespace is allowed
   *
   * @param control The form control to validate.
   * @returns `null` when valid (or when value is not a string), otherwise `{ rgbColor: { actualValue } }`.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl('rgb(256, 0, 0)', ExtValidators.rgbColor);
   * console.log(control.errors);
   * // { rgbColor: { actualValue: 'rgb(256, 0, 0)' } }
   *
   * const control = new FormControl('rgb(255, 0, 128)', ExtValidators.rgbColor);
   * console.log(control.errors);
   * // null
   * ```
   */
  static rgbColor(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') {
      // don't validate empty values to allow optional controls
      // don't validate non-string values to avoid false positives
      return null;
    }
    return RGB_COLOR_REGEX.test(value)
      ? null
      : { rgbColor: { actualValue: value } };
  }

  /**
   * Validator that requires the control's value to be an `hsl(h, s%, l%)` CSS color string.
   *
   * Constraints:
   * - `h` (hue) must be an integer in the range 0..360
   * - `s` and `l` must be percentages in the range 0..100
   * - Whitespace is allowed
   *
   * @param control The form control to validate.
   * @returns `null` when valid (or when value is not a string), otherwise `{ hslColor: { actualValue } }`.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl('hsl(361, 50%, 40%)', ExtValidators.hslColor);
   * console.log(control.errors);
   * // { hslColor: { actualValue: 'hsl(361, 50%, 40%)' } }
   *
   * const control = new FormControl('hsl(210, 50%, 40%)', ExtValidators.hslColor);
   * console.log(control.errors);
   * // null
   * ```
   */
  static hslColor(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') {
      // don't validate empty values to allow optional controls
      // don't validate non-string values to avoid false positives
      return null;
    }
    return HSL_COLOR_REGEX.test(value)
      ? null
      : { hslColor: { actualValue: value } };
  }

  /**
   * Validator factory for password-like rules.
   *
   * You can combine any subset of rules. Only rules that are enabled will be validated.
   *
   * Returned error shape:
   * - `null` when valid
   * - `{ password: { ...details } }` when invalid, where `details` may include:
   *   - `minLength` / `maxLength` objects with required/actual lengths
   *   - boolean flags: `requireNumbers`, `requireUppercase`, `requireLowercase`, `requireSpecialCharacters`
   *
   * Notes:
   * - Special character set is: `[!@#$%^&*(),.?":{}|<>]`
   * - Non-string / empty values are not validated to allow optional controls.
   *
   * @param rules Password rules configuration.
   * @returns A validator function that returns a `password` error map when validation fails, otherwise `null`.
   *
   * @example
   *
   * Negative example (produces an error and shows the nested details):
   *
   * ```ts
   * const control = new FormControl('password', ExtValidators.password({
   *   minLength: 8,
   *   requireNumbers: true,
   *   requireUppercase: true,
   *   requireSpecialCharacters: true,
   * }));
   *
   * console.log(control.errors);
   * // {
   * //   password: {
   * //     requireNumbers: true,
   * //     requireUppercase: true,
   * //     requireSpecialCharacters: true
   * //   }
   * // }
   *
   * const control = new FormControl('P@ssw0rd!', ExtValidators.password({
   *   minLength: 8,
   *   requireNumbers: true,
   *   requireUppercase: true,
   *   requireSpecialCharacters: true,
   * }));
   *
   * console.log(control.errors);
   * // null
   * ```
   */
  static password(rules: {
    minLength?: number;
    maxLength?: number;
    requireNumbers?: boolean;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireSpecialCharacters?: boolean;
  }): ValidatorFn {
    return (control) => {
      const value = control.value;
      if (typeof value !== 'string') {
        // don't validate empty values to allow optional controls
        // don't validate non-string values to avoid false positives
        return null;
      }
      const errors: any = {};
      if (rules.minLength != null && value.length < rules.minLength) {
        errors.minLength = {
          requiredLength: rules.minLength,
          actualLength: value.length,
        };
      }
      if (rules.maxLength != null && value.length > rules.maxLength) {
        errors.maxLength = {
          requiredLength: rules.maxLength,
          actualLength: value.length,
        };
      }
      if (rules.requireNumbers && !/\d/.test(value)) {
        errors.requireNumbers = true;
      }
      if (rules.requireUppercase && !/[A-Z]/.test(value)) {
        errors.requireUppercase = true;
      }
      if (rules.requireLowercase && !/[a-z]/.test(value)) {
        errors.requireLowercase = true;
      }
      if (
        rules.requireSpecialCharacters &&
        !/[!@#$%^&*(),.?":{}|<>]/.test(value)
      ) {
        errors.requireSpecialCharacters = true;
      }
      return Object.keys(errors).length > 0 ? { password: errors } : null;
    };
  }

  /**
   * Validator that requires the control's value (an array) to contain a specific element.
   *
   * Non-array values are ignored to avoid false positives.
   *
   * @param seed The element that must exist in the array (uses `Array.prototype.includes`).
   * @returns A validator function that returns `{ arrayContains: { actualValue, shouldContain } }` when invalid, otherwise `null`.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl(['a', 'b'], ExtValidators.arrayContains('c'));
   * console.log(control.errors);
   * // { arrayContains: { actualValue: ['a', 'b'], shouldContain: 'c' } }
   *
   * const control = new FormControl(['a', 'b', 'c'], ExtValidators.arrayContains('c'));
   * console.log(control.errors);
   * // null
   * ```
   */
  static arrayContains(seed: any): ValidatorFn {
    return (control) => {
      const value = control.value;
      if (!Array.isArray(value)) {
        // don't validate non-array values to avoid false positives
        return null;
      }
      if (value.includes(seed)) {
        return null;
      }
      return { arrayContains: { actualValue: value, shouldContain: seed } };
    };
  }

  /**
   * Validator that requires the control's value (an array) to *not* contain a specific element.
   *
   * Non-array values are ignored to avoid false positives.
   *
   * @param seed The element that must not exist in the array (uses `Array.prototype.includes`).
   * @returns A validator function that returns `{ arrayNotContains: { actualValue, shouldNotContain } }` when invalid, otherwise `null`.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl(['a', 'b'], ExtValidators.arrayNotContains('b'));
   * console.log(control.errors);
   * // { arrayNotContains: { actualValue: ['a', 'b'], shouldNotContain: 'b' } }
   *
   * const control = new FormControl(['a', 'b'], ExtValidators.arrayNotContains('c'));
   * console.log(control.errors);
   * // null
   * ```
   */
  static arrayNotContains(seed: any): ValidatorFn {
    return (control) => {
      const value = control.value;
      if (!Array.isArray(value)) {
        // don't validate non-array values to avoid false positives
        return null;
      }
      if (!value.includes(seed)) {
        return null;
      }
      return {
        arrayNotContains: { actualValue: value, shouldNotContain: seed },
      };
    };
  }

  /**
   * Validator that requires the control's value (an array) to contain only unique items.
   *
   * Uses a `Set` to compare uniqueness (`Set.size === array.length`).
   *
   * @param control The form control to validate.
   * @returns `null` when valid (or when value is not an array), otherwise `{ arrayUnique: { actualValue } }`.
   *
   * @example
   *
   * ```ts
   * const control = new FormControl([1, 1, 2], ExtValidators.arrayUnique);
   * console.log(control.errors);
   * // { arrayUnique: { actualValue: [1, 1, 2] } }
   *
   * const control = new FormControl([1, 2, 3], ExtValidators.arrayUnique);
   * console.log(control.errors);
   * // null
   * ```
   */
  static arrayUnique(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!Array.isArray(value)) {
      // don't validate non-array values to avoid false positives
      return null;
    }
    const uniqueValues = new Set(value);
    if (uniqueValues.size === value.length) {
      return null;
    }
    return { arrayUnique: { actualValue: value } };
  }

  /**
   * Validator factory that requires uploaded file(s) to be at most the given size.
   *
   * Supported control value shapes:
   * - a single `File`
   * - an array of files (typically `File[]`)
   *
   * Non-file values (or arrays with no `File` instances) are ignored to avoid false positives.
   *
   * Error shape:
   * - If a single `File` was provided: `{ fileMaxSize: { requiredMaxSize, actualSize } }`
   * - If an array was provided: `{ fileMaxSize: { requiredMaxSize, actualSizes } }` where `actualSizes` are the sizes of invalid files
   *
   * @param maxSizeInBytes Maximum allowed size in bytes.
   * @returns A validator function that returns a `fileMaxSize` error map when invalid, otherwise `null`.
   *
   * @example
   *
   * Negative example (single file; produces an error):
   *
   * ```ts
   * const big = new File([new Uint8Array(10)], 'big.txt'); // example only
   * Object.defineProperty(big, 'size', { value: 10_000_000 }); // force size for demo
   *
   * const control = new FormControl<File | null>(big, ExtValidators.fileMaxSize(1_000));
   * console.log(control.errors);
   * // { fileMaxSize: { requiredMaxSize: 1000, actualSize: 10000000 } }
   * ```
   *
   * Negative example (array; produces an error with `actualSizes`):
   *
   * ```ts
   * const f1 = new File([new Uint8Array(1)], 'a.txt');
   * const f2 = new File([new Uint8Array(1)], 'b.txt');
   * Object.defineProperty(f1, 'size', { value: 500 });
   * Object.defineProperty(f2, 'size', { value: 1500 });
   *
   * const control = new FormControl<File[]>([f1, f2], ExtValidators.fileMaxSize(1000));
   * console.log(control.errors);
   * // { fileMaxSize: { requiredMaxSize: 1000, actualSizes: [1500] } }
   *
   * const f = new File([new Uint8Array(1)], 'ok.txt');
   * Object.defineProperty(f, 'size', { value: 500 });
   *
   * const control = new FormControl<File | null>(f, ExtValidators.fileMaxSize(1000));
   * console.log(control.errors);
   * // null
   * ```
   */
  static fileMaxSize(maxSizeInBytes: number): ValidatorFn {
    return (control) => {
      const value = control.value;
      if (value == null) {
        return null;
      }

      let isSingleFile = false;
      let files: any[] | null = null;
      if (value instanceof File) {
        files = [value];
        isSingleFile = true;
      } else if (Array.isArray(value)) {
        files = value;
      } else {
        // don't validate non-file/non-array values to avoid false positives
        return null;
      }

      const fileInstances = files.filter((f) => f instanceof File) as File[];
      if (fileInstances.length === 0) {
        return null;
      }

      const invalid = fileInstances.filter((f) => f.size > maxSizeInBytes);
      if (invalid.length === 0) {
        return null;
      }

      // preserve single-file shape when only one file was provided
      if (isSingleFile) {
        return {
          fileMaxSize: {
            requiredMaxSize: maxSizeInBytes,
            actualSize: fileInstances[0].size,
          },
        };
      }

      return {
        fileMaxSize: {
          requiredMaxSize: maxSizeInBytes,
          actualSizes: invalid.map((f) => f.size),
        },
      };
    };
  }

  /**
   * Validator factory that requires uploaded file(s) to be at least the given size.
   *
   * Supported control value shapes:
   * - a single `File`
   * - an array of files (typically `File[]`)
   *
   * Non-file values (or arrays with no `File` instances) are ignored to avoid false positives.
   *
   * Error shape:
   * - If a single `File` was provided: `{ fileMinSize: { requiredMinSize, actualSize } }`
   * - If an array was provided: `{ fileMinSize: { requiredMinSize, actualSizes } }` where `actualSizes` are the sizes of invalid files
   *
   * @param minSizeInBytes Minimum allowed size in bytes.
   * @returns A validator function that returns a `fileMinSize` error map when invalid, otherwise `null`.
   *
   * @example
   *
   * Negative example (single file; produces an error):
   *
   * ```ts
   * const tiny = new File([new Uint8Array(1)], 'tiny.txt');
   * Object.defineProperty(tiny, 'size', { value: 50 });
   *
   * const control = new FormControl<File | null>(tiny, ExtValidators.fileMinSize(100));
   * console.log(control.errors);
   * // { fileMinSize: { requiredMinSize: 100, actualSize: 50 } }
   * ```
   *
   * Negative example (array; produces an error with `actualSizes`):
   *
   * ```ts
   * const f1 = new File([new Uint8Array(1)], 'a.txt');
   * const f2 = new File([new Uint8Array(1)], 'b.txt');
   * Object.defineProperty(f1, 'size', { value: 50 });
   * Object.defineProperty(f2, 'size', { value: 200 });
   *
   * const control = new FormControl<File[]>([f1, f2], ExtValidators.fileMinSize(100));
   * console.log(control.errors);
   * // { fileMinSize: { requiredMinSize: 100, actualSizes: [50] } }
   *
   * const ok = new File([new Uint8Array(1)], 'ok.txt');
   * Object.defineProperty(ok, 'size', { value: 150 });
   *
   * const control = new FormControl<File | null>(ok, ExtValidators.fileMinSize(100));
   * console.log(control.errors);
   * // null
   * ```
   */
  static fileMinSize(minSizeInBytes: number): ValidatorFn {
    return (control) => {
      const value = control.value;
      if (value == null) {
        return null;
      }

      let isSingleFile = false;
      let files: any[] | null = null;
      if (value instanceof File) {
        files = [value];
        isSingleFile = true;
      } else if (Array.isArray(value)) {
        files = value;
      } else {
        // don't validate non-file/non-array values to avoid false positives
        return null;
      }

      const fileInstances = files.filter((f) => f instanceof File) as File[];
      if (fileInstances.length === 0) {
        return null;
      }

      const invalid = fileInstances.filter((f) => f.size < minSizeInBytes);
      if (invalid.length === 0) {
        return null;
      }

      if (isSingleFile) {
        return {
          fileMinSize: {
            requiredMinSize: minSizeInBytes,
            actualSize: fileInstances[0].size,
          },
        };
      }

      return {
        fileMinSize: {
          requiredMinSize: minSizeInBytes,
          actualSizes: invalid.map((f) => f.size),
        },
      };
    };
  }

  /**
   * Validator factory that requires uploaded file(s) to have an allowed extension.
   *
   * Supported control value shapes:
   * - a single `File`
   * - an array of files (typically `File[]`)
   *
   * Notes:
   * - Extension is derived from the last `.` in the filename: `file.name.split('.').pop()`
   * - The extracted extension is lowercased before checking.
   * - `allowedExtensions` should be provided in lowercase to match the comparison.
   *
   * Error shape:
   * - If a single `File` was provided: `{ fileExtension: { allowedExtensions, actualExtension } }`
   * - If an array was provided: `{ fileExtension: { allowedExtensions, invalidFiles } }`
   *
   * @param allowedExtensions A list of allowed extensions (without dots), e.g. `['png', 'jpg', 'pdf']`.
   * @returns A validator function that returns a `fileExtension` error map when invalid, otherwise `null`.
   *
   * @example
   *
   * Negative example (single file; produces an error):
   *
   * ```ts
   * const file = new File([new Uint8Array(1)], 'report.exe');
   * const control = new FormControl<File | null>(file, ExtValidators.fileExtension(['pdf', 'docx']));
   * console.log(control.errors);
   * // { fileExtension: { allowedExtensions: ['pdf', 'docx'], actualExtension: 'exe' } }
   * ```
   *
   * Negative example (array; produces an error with invalid file names):
   *
   * ```ts
   * const a = new File([new Uint8Array(1)], 'a.png');
   * const b = new File([new Uint8Array(1)], 'b.exe');
   *
   * const control = new FormControl<File[]>([a, b], ExtValidators.fileExtension(['png', 'jpg']));
   * console.log(control.errors);
   * // { fileExtension: { allowedExtensions: ['png', 'jpg'], invalidFiles: ['b.exe'] } }
   *
   * const file = new File([new Uint8Array(1)], 'photo.jpg');
   * const control = new FormControl<File | null>(file, ExtValidators.fileExtension(['png', 'jpg']));
   * console.log(control.errors);
   * // null
   * ```
   */
  static fileExtension(allowedExtensions: string[]): ValidatorFn {
    return (control) => {
      const value = control.value;
      if (value == null) {
        return null;
      }

      let isSingleFile = false;
      let files: any[] | null = null;
      if (value instanceof File) {
        files = [value];
        isSingleFile = true;
      } else if (Array.isArray(value)) {
        files = value;
      } else {
        // don't validate non-file/non-array values to avoid false positives
        return null;
      }

      const fileInstances = files.filter((f) => f instanceof File) as File[];
      if (fileInstances.length === 0) {
        return null;
      }

      const invalidFiles = fileInstances.filter((f) => {
        const ext = f.name.split('.').pop()?.toLowerCase() || '';
        return !allowedExtensions.includes(ext);
      });

      if (invalidFiles.length === 0) {
        return null;
      }

      if (isSingleFile) {
        const fileExtension = fileInstances[0].name
          .split('.')
          .pop()
          ?.toLowerCase();
        return {
          fileExtension: {
            allowedExtensions: allowedExtensions,
            actualExtension: fileExtension,
          },
        };
      }

      return {
        fileExtension: {
          allowedExtensions: allowedExtensions,
          invalidFiles: invalidFiles.map((f) => f.name),
        },
      };
    };
  }
}
