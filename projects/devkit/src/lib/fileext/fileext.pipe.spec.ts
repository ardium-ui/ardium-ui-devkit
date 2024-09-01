import { ArdiumFileextPipe } from './fileext.pipe';

describe('ArdiumFileextPipe', () => {
  let pipe: ArdiumFileextPipe;

  beforeEach(() => {
    pipe = new ArdiumFileextPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the correct file extension without dot', () => {
    const result = pipe.transform('example.txt');
    expect(result).toBe('txt');
  });

  it('should return the correct file extension with dot', () => {
    const result = pipe.transform('example.txt', true);
    expect(result).toBe('.txt');
  });

  it('should return null if there is no extension', () => {
    const result = pipe.transform('example');
    expect(result).toBeNull();
  });

  it('should handle file input and return the correct extension', () => {
    const file = new File(['content'], 'example.pdf');
    const result = pipe.transform(file);
    expect(result).toBe('pdf');
  });

  it('should handle file input and return the correct extension with dot', () => {
    const file = new File(['content'], 'example.pdf');
    const result = pipe.transform(file, true);
    expect(result).toBe('.pdf');
  });
});
