import { ArdiumFilesizePipe } from './filesize.pipe';

describe('ArdiumFilesizePipe', () => {
  let pipe: ArdiumFilesizePipe;

  beforeEach(() => {
    pipe = new ArdiumFilesizePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the formatted filesize with the default precision and no space', () => {
    const result = pipe.transform(1234567);
    expect(result).toBe('1.23MB');
  });

  it('should return the formatted filesize with a custom precision and no space', () => {
    const result = pipe.transform(1234567, 3);
    expect(result).toBe('1.235MB');
  });

  it('should return the formatted filesize with a space between the number and unit', () => {
    const result = pipe.transform(1234567, 2, true);
    expect(result).toBe('1.23 MB');
  });

  it('should handle large numbers correctly with space', () => {
    const result = pipe.transform(1073741824, 2, true);
    expect(result).toBe('1.07 GB');
  });

  it('should return "0B" for a value of 0', () => {
    const result = pipe.transform(0);
    expect(result).toBe('0B');
  });
});
