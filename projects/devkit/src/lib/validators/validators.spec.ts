// ext-validators.spec.ts
import { FormControl } from '@angular/forms';
import { ExtValidators } from './validators';

function makeFile(name: string, size: number): File {
  const f = new File([new Uint8Array(1)], name);
  // In JSDOM, File.size is typically read-only; defineProperty lets us control it for tests.
  Object.defineProperty(f, 'size', { value: size });
  return f;
}

describe('ExtValidators', () => {
  describe('contains', () => {
    it('returns null when value contains seed', () => {
      const control = new FormControl('I love angular', ExtValidators.contains('angular'));
      expect(control.errors).toBeNull();
    });

    it('returns error when value does not contain seed', () => {
      const control = new FormControl('ng', ExtValidators.contains('angular'));
      expect(control.errors).toEqual({
        contains: { actualValue: 'ng', shouldContain: 'angular' },
      });
    });

    it('does not validate non-string values', () => {
      const control = new FormControl(123 as any, ExtValidators.contains('1'));
      expect(control.errors).toBeNull();
    });

    it('is case-sensitive', () => {
      const control = new FormControl('Angular', ExtValidators.contains('angular'));
      expect(control.errors).toEqual({
        contains: { actualValue: 'Angular', shouldContain: 'angular' },
      });
    });
  });

  describe('notContains', () => {
    it('returns null when value does not contain seed', () => {
      const control = new FormControl('angular', ExtValidators.notContains('react'));
      expect(control.errors).toBeNull();
    });

    it('returns error when value contains seed', () => {
      const control = new FormControl('angular', ExtValidators.notContains('ng'));
      expect(control.errors).toEqual({
        notContains: { actualValue: 'angular', shouldNotContain: 'ng' },
      });
    });

    it('does not validate non-string values', () => {
      const control = new FormControl({} as any, ExtValidators.notContains('x'));
      expect(control.errors).toBeNull();
    });
  });

  describe('lowercase', () => {
    it('returns null when lowercase', () => {
      const control = new FormControl('angular', ExtValidators.lowercase);
      expect(control.errors).toBeNull();
    });

    it('returns error when not lowercase', () => {
      const control = new FormControl('Angular', ExtValidators.lowercase);
      expect(control.errors).toEqual({ lowercase: { actualValue: 'Angular' } });
    });

    it('does not validate non-string values', () => {
      const control = new FormControl(42 as any, ExtValidators.lowercase);
      expect(control.errors).toBeNull();
    });
  });

  describe('uppercase', () => {
    it('returns null when uppercase', () => {
      const control = new FormControl('ANGULAR', ExtValidators.uppercase);
      expect(control.errors).toBeNull();
    });

    it('returns error when not uppercase', () => {
      const control = new FormControl('Angular', ExtValidators.uppercase);
      expect(control.errors).toEqual({ uppercase: { actualValue: 'Angular' } });
    });

    it('does not validate non-string values', () => {
      const control = new FormControl(false as any, ExtValidators.uppercase);
      expect(control.errors).toBeNull();
    });
  });

  describe('namedPattern', () => {
    it('returns null when matches pattern (RegExp)', () => {
      const control = new FormControl(
        'ABC-123',
        ExtValidators.namedPattern('sku', /^[A-Z]{3}-\d{3}$/),
      );
      expect(control.errors).toBeNull();
    });

    it('returns named error when does not match pattern (RegExp)', () => {
      const control = new FormControl(
        'abc-123',
        ExtValidators.namedPattern('sku', /^[A-Z]{3}-\d{3}$/),
      );
      expect(control.errors).toEqual({ sku: { actualValue: 'abc-123' } });
    });

    it('supports string patterns', () => {
      const control = new FormControl('123', ExtValidators.namedPattern('digits', '^\\d+$'));
      expect(control.errors).toBeNull();
    });

    it('does not validate non-string values', () => {
      const control = new FormControl(123 as any, ExtValidators.namedPattern('digits', '^\\d+$'));
      expect(control.errors).toBeNull();
    });
  });

  describe('divisibleBy', () => {
    it('returns null when divisible', () => {
      const control = new FormControl('15', ExtValidators.divisibleBy(5));
      expect(control.errors).toBeNull();
    });

    it('returns error when not divisible', () => {
      const control = new FormControl('12', ExtValidators.divisibleBy(5));
      expect(control.errors).toEqual({
        divisibleBy: { divisor: 5, actual: '12' },
      });
    });

    it('skips validation for null/undefined values', () => {
      const c1 = new FormControl(null, ExtValidators.divisibleBy(5));
      const c2 = new FormControl(undefined as any, ExtValidators.divisibleBy(5));
      expect(c1.errors).toBeNull();
      expect(c2.errors).toBeNull();
    });

    it('skips validation for divisor 0 (or null/undefined divisor)', () => {
      const control = new FormControl('12', ExtValidators.divisibleBy(0));
      expect(control.errors).toBeNull();
    });

    it('treats NaN after parsing as valid (no error)', () => {
      const control = new FormControl('abc', ExtValidators.divisibleBy(5));
      expect(control.errors).toBeNull();
    });
  });

  describe('ascii', () => {
    it('returns null for ASCII-only strings', () => {
      const control = new FormControl('Hello!', ExtValidators.ascii);
      expect(control.errors).toBeNull();
    });

    it('returns error for non-ASCII strings', () => {
      const control = new FormControl('Zażółć', ExtValidators.ascii);
      expect(control.errors).toEqual({ ascii: { actualValue: 'Zażółć' } });
    });

    it('does not validate non-string values', () => {
      const control = new FormControl(1 as any, ExtValidators.ascii);
      expect(control.errors).toBeNull();
    });
  });

  describe('base64', () => {
    it('returns null for valid base64', () => {
      const control = new FormControl('aGVsbG8=', ExtValidators.base64);
      expect(control.errors).toBeNull();
    });

    it('returns error for invalid base64', () => {
      const control = new FormControl('hello world', ExtValidators.base64);
      expect(control.errors).toEqual({ base64: { actualValue: 'hello world' } });
    });

    it('does not validate non-string values', () => {
      const control = new FormControl({} as any, ExtValidators.base64);
      expect(control.errors).toBeNull();
    });
  });

  describe('hex', () => {
    it('returns null for valid hex', () => {
      const control = new FormControl('deadBEEF', ExtValidators.hex);
      expect(control.errors).toBeNull();
    });

    it('returns error for invalid hex', () => {
      const control = new FormControl('0xdeadbeef', ExtValidators.hex);
      expect(control.errors).toEqual({ hex: { actualValue: '0xdeadbeef' } });
    });

    it('does not validate non-string values', () => {
      const control = new FormControl(123 as any, ExtValidators.hex);
      expect(control.errors).toBeNull();
    });
  });

  describe('octal', () => {
    it('returns null for valid octal', () => {
      const control = new FormControl('755', ExtValidators.octal);
      expect(control.errors).toBeNull();
    });

    it('returns error for invalid octal', () => {
      const control = new FormControl('128', ExtValidators.octal);
      expect(control.errors).toEqual({ octal: { actualValue: '128' } });
    });

    it('does not validate non-string values', () => {
      const control = new FormControl([] as any, ExtValidators.octal);
      expect(control.errors).toBeNull();
    });
  });

  describe('binary', () => {
    it('returns null for valid binary', () => {
      const control = new FormControl('101010', ExtValidators.binary);
      expect(control.errors).toBeNull();
    });

    it('returns error for invalid binary', () => {
      const control = new FormControl('10201', ExtValidators.binary);
      expect(control.errors).toEqual({ binary: { actualValue: '10201' } });
    });

    it('does not validate non-string values', () => {
      const control = new FormControl(null, ExtValidators.binary);
      expect(control.errors).toBeNull();
    });
  });

  describe('ipAddress', () => {
    describe('IPv4', () => {
      it('returns null for valid IPv4', () => {
        const control = new FormControl('127.0.0.1', ExtValidators.ipAddress(4));
        expect(control.errors).toBeNull();
      });

      it('returns error for invalid IPv4', () => {
        const control = new FormControl('999.1.2.3', ExtValidators.ipAddress(4));
        expect(control.errors).toEqual({
          ipAddress: { requiredType: 'IPv4', actualValue: '999.1.2.3' },
        });
      });

      it('does not validate non-string values', () => {
        const control = new FormControl(123 as any, ExtValidators.ipAddress(4));
        expect(control.errors).toBeNull();
      });
    });

    describe('IPv6', () => {
      it('returns null for valid IPv6', () => {
        const control = new FormControl('::1', ExtValidators.ipAddress(6));
        expect(control.errors).toBeNull();
      });

      it('returns error for invalid IPv6', () => {
        const control = new FormControl('not-an-ip', ExtValidators.ipAddress(6));
        expect(control.errors).toEqual({
          ipAddress: { requiredType: 'IPv6', actualValue: 'not-an-ip' },
        });
      });

      it('does not validate non-string values', () => {
        const control = new FormControl({} as any, ExtValidators.ipAddress(6));
        expect(control.errors).toBeNull();
      });
    });
  });

  describe('uuid', () => {
    it('returns null for valid UUID', () => {
      const control = new FormControl(
        '550e8400-e29b-41d4-a716-446655440000',
        ExtValidators.uuid,
      );
      expect(control.errors).toBeNull();
    });

    it('returns error for invalid UUID', () => {
      const control = new FormControl(
        '550e8400-e29b-41d4-a716-44665544ZZZZ',
        ExtValidators.uuid,
      );
      expect(control.errors).toEqual({
        uuid: { actualValue: '550e8400-e29b-41d4-a716-44665544ZZZZ' },
      });
    });

    it('does not validate non-string values', () => {
      const control = new FormControl(123 as any, ExtValidators.uuid);
      expect(control.errors).toBeNull();
    });
  });

  describe('hexColor', () => {
    it('returns null for valid hex colors (#RGB, #RRGGBB, with/without #)', () => {
      expect(new FormControl('#fff', ExtValidators.hexColor).errors).toBeNull();
      expect(new FormControl('fff', ExtValidators.hexColor).errors).toBeNull();
      expect(new FormControl('#ff00aa', ExtValidators.hexColor).errors).toBeNull();
      expect(new FormControl('ff00aa', ExtValidators.hexColor).errors).toBeNull();
    });

    it('returns error for invalid hex colors', () => {
      const control = new FormControl('#12FG00', ExtValidators.hexColor);
      expect(control.errors).toEqual({ hexColor: { actualValue: '#12FG00' } });
    });

    it('does not validate non-string values', () => {
      const control = new FormControl(null, ExtValidators.hexColor);
      expect(control.errors).toBeNull();
    });
  });

  describe('rgbColor', () => {
    it('returns null for valid rgb()', () => {
      const control = new FormControl('rgb(255, 0, 128)', ExtValidators.rgbColor);
      expect(control.errors).toBeNull();
    });

    it('returns error for invalid rgb()', () => {
      const control = new FormControl('rgb(256, 0, 0)', ExtValidators.rgbColor);
      expect(control.errors).toEqual({ rgbColor: { actualValue: 'rgb(256, 0, 0)' } });
    });

    it('does not validate non-string values', () => {
      const control = new FormControl([] as any, ExtValidators.rgbColor);
      expect(control.errors).toBeNull();
    });
  });

  describe('hslColor', () => {
    it('returns null for valid hsl()', () => {
      const control = new FormControl('hsl(210, 50%, 40%)', ExtValidators.hslColor);
      expect(control.errors).toBeNull();
    });

    it('returns error for invalid hsl()', () => {
      const control = new FormControl('hsl(361, 50%, 40%)', ExtValidators.hslColor);
      expect(control.errors).toEqual({ hslColor: { actualValue: 'hsl(361, 50%, 40%)' } });
    });

    it('does not validate non-string values', () => {
      const control = new FormControl({} as any, ExtValidators.hslColor);
      expect(control.errors).toBeNull();
    });
  });

  describe('password', () => {
    it('returns null when all enabled rules pass', () => {
      const control = new FormControl(
        'P@ssw0rd!',
        ExtValidators.password({
          minLength: 8,
          maxLength: 64,
          requireNumbers: true,
          requireUppercase: true,
          requireLowercase: true,
          requireSpecialCharacters: true,
        }),
      );

      expect(control.errors).toBeNull();
    });

    it('returns nested password errors for failing rules', () => {
      const control = new FormControl(
        'password',
        ExtValidators.password({
          minLength: 8,
          requireNumbers: true,
          requireUppercase: true,
          requireSpecialCharacters: true,
        }),
      );

      expect(control.errors).toEqual({
        password: {
          requireNumbers: true,
          requireUppercase: true,
          requireSpecialCharacters: true,
        },
      });
    });

    it('includes minLength/maxLength details when those rules fail', () => {
      const control = new FormControl(
        'Aa1!',
        ExtValidators.password({
          minLength: 8,
          maxLength: 10,
        }),
      );

      expect(control.errors).toEqual({
        password: {
          minLength: { requiredLength: 8, actualLength: 4 },
        },
      });

      control.setValue('A'.repeat(11));
      expect(control.errors).toEqual({
        password: {
          maxLength: { requiredLength: 10, actualLength: 11 },
        },
      });
    });

    it('does not validate non-string values', () => {
      const control = new FormControl(123 as any, ExtValidators.password({ minLength: 1 }));
      expect(control.errors).toBeNull();
    });
  });

  describe('arrayContains', () => {
    it('returns null when array contains seed', () => {
      const control = new FormControl(['a', 'b', 'c'], ExtValidators.arrayContains('c'));
      expect(control.errors).toBeNull();
    });

    it('returns error when array does not contain seed', () => {
      const control = new FormControl(['a', 'b'], ExtValidators.arrayContains('c'));
      expect(control.errors).toEqual({
        arrayContains: { actualValue: ['a', 'b'], shouldContain: 'c' },
      });
    });

    it('does not validate non-array values', () => {
      const control = new FormControl('abc' as any, ExtValidators.arrayContains('a'));
      expect(control.errors).toBeNull();
    });
  });

  describe('arrayNotContains', () => {
    it('returns null when array does not contain seed', () => {
      const control = new FormControl(['a', 'b'], ExtValidators.arrayNotContains('c'));
      expect(control.errors).toBeNull();
    });

    it('returns error when array contains seed', () => {
      const control = new FormControl(['a', 'b'], ExtValidators.arrayNotContains('b'));
      expect(control.errors).toEqual({
        arrayNotContains: { actualValue: ['a', 'b'], shouldNotContain: 'b' },
      });
    });

    it('does not validate non-array values', () => {
      const control = new FormControl({} as any, ExtValidators.arrayNotContains('x'));
      expect(control.errors).toBeNull();
    });
  });

  describe('arrayUnique', () => {
    it('returns null when all items are unique', () => {
      const control = new FormControl([1, 2, 3], ExtValidators.arrayUnique);
      expect(control.errors).toBeNull();
    });

    it('returns error when duplicates exist', () => {
      const control = new FormControl([1, 1, 2], ExtValidators.arrayUnique);
      expect(control.errors).toEqual({ arrayUnique: { actualValue: [1, 1, 2] } });
    });

    it('does not validate non-array values', () => {
      const control = new FormControl('not-array' as any, ExtValidators.arrayUnique);
      expect(control.errors).toBeNull();
    });
  });

  describe('fileMaxSize', () => {
    it('returns null for null value (optional)', () => {
      const control = new FormControl<File | null>(null, ExtValidators.fileMaxSize(1000));
      expect(control.errors).toBeNull();
    });

    it('returns error for single file over max', () => {
      const file = makeFile('big.txt', 1500);
      const control = new FormControl<File>(file, ExtValidators.fileMaxSize(1000));

      expect(control.errors).toEqual({
        fileMaxSize: { requiredMaxSize: 1000, actualSize: 1500 },
      });
    });

    it('returns null for single file within max', () => {
      const file = makeFile('ok.txt', 500);
      const control = new FormControl<File>(file, ExtValidators.fileMaxSize(1000));
      expect(control.errors).toBeNull();
    });

    it('returns error for array with invalid files (reports actualSizes of invalid ones)', () => {
      const a = makeFile('a.txt', 500);
      const b = makeFile('b.txt', 1500);
      const control = new FormControl<File[]>([a, b], ExtValidators.fileMaxSize(1000));

      expect(control.errors).toEqual({
        fileMaxSize: { requiredMaxSize: 1000, actualSizes: [1500] },
      });
    });

    it('does not validate non-file/non-array values', () => {
      const control = new FormControl('nope' as any, ExtValidators.fileMaxSize(1000));
      expect(control.errors).toBeNull();
    });

    it('ignores arrays with no File instances', () => {
      const control = new FormControl<any[]>([{ size: 9999 }], ExtValidators.fileMaxSize(1000));
      expect(control.errors).toBeNull();
    });
  });

  describe('fileMinSize', () => {
    it('returns null for null value (optional)', () => {
      const control = new FormControl<File | null>(null, ExtValidators.fileMinSize(100));
      expect(control.errors).toBeNull();
    });

    it('returns error for single file under min', () => {
      const file = makeFile('tiny.txt', 50);
      const control = new FormControl<File>(file, ExtValidators.fileMinSize(100));

      expect(control.errors).toEqual({
        fileMinSize: { requiredMinSize: 100, actualSize: 50 },
      });
    });

    it('returns null for single file meeting min', () => {
      const file = makeFile('ok.txt', 150);
      const control = new FormControl<File>(file, ExtValidators.fileMinSize(100));
      expect(control.errors).toBeNull();
    });

    it('returns error for array with invalid files (reports actualSizes of invalid ones)', () => {
      const a = makeFile('a.txt', 50);
      const b = makeFile('b.txt', 200);
      const control = new FormControl<File[]>([a, b], ExtValidators.fileMinSize(100));

      expect(control.errors).toEqual({
        fileMinSize: { requiredMinSize: 100, actualSizes: [50] },
      });
    });

    it('does not validate non-file/non-array values', () => {
      const control = new FormControl(123 as any, ExtValidators.fileMinSize(100));
      expect(control.errors).toBeNull();
    });

    it('ignores arrays with no File instances', () => {
      const control = new FormControl<any[]>([{ size: 10 }], ExtValidators.fileMinSize(100));
      expect(control.errors).toBeNull();
    });
  });

  describe('fileExtension', () => {
    it('returns null for null value (optional)', () => {
      const control = new FormControl<File | null>(null, ExtValidators.fileExtension(['png']));
      expect(control.errors).toBeNull();
    });

    it('returns error for single file with disallowed extension', () => {
      const file = makeFile('report.exe', 1);
      const control = new FormControl<File>(file, ExtValidators.fileExtension(['pdf', 'docx']));

      expect(control.errors).toEqual({
        fileExtension: { allowedExtensions: ['pdf', 'docx'], actualExtension: 'exe' },
      });
    });

    it('returns null for single file with allowed extension (case-insensitive filename ext)', () => {
      const file = makeFile('photo.JPG', 1);
      const control = new FormControl<File>(file, ExtValidators.fileExtension(['jpg', 'png']));
      expect(control.errors).toBeNull();
    });

    it('returns error for array with invalid files (reports invalid file names)', () => {
      const a = makeFile('a.png', 1);
      const b = makeFile('b.exe', 1);
      const control = new FormControl<File[]>([a, b], ExtValidators.fileExtension(['png', 'jpg']));

      expect(control.errors).toEqual({
        fileExtension: { allowedExtensions: ['png', 'jpg'], invalidFiles: ['b.exe'] },
      });
    });

    it('does not validate non-file/non-array values', () => {
      const control = new FormControl({ name: 'x.exe' } as any, ExtValidators.fileExtension(['exe']));
      expect(control.errors).toBeNull();
    });

    it('ignores arrays with no File instances', () => {
      const control = new FormControl<any[]>([{ name: 'a.exe' }], ExtValidators.fileExtension(['exe']));
      expect(control.errors).toBeNull();
    });
  });
});
