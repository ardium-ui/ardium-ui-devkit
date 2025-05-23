import { ArdiumFileNamePipe } from "./filename.pipe";


describe('ArdiumFilenamePipe', () => {
  let pipe: ArdiumFileNamePipe;

  beforeEach(() => {
    pipe = new ArdiumFileNamePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the filename without extension from a string', () => {
    const result = pipe.transform('example.txt');
    expect(result).toBe('example');
  });

  it('should return the filename without extension from a string with multiple dots', () => {
    const result = pipe.transform('example.test.file.txt');
    expect(result).toBe('example.test.file');
  });

  it('should return the entire string if there is no extension', () => {
    const result = pipe.transform('example');
    expect(result).toBe('example');
  });

  it('should handle file input and return the filename without extension', () => {
    const file = new File(['content'], 'example.pdf');
    const result = pipe.transform(file);
    expect(result).toBe('example');
  });

  it('should handle file input and return the entire filename if there is no extension', () => {
    const file = new File(['content'], 'examplefile');
    const result = pipe.transform(file);
    expect(result).toBe('examplefile');
  });

  it('should return an empty string if the value is an empty string', () => {
    const result = pipe.transform('');
    expect(result).toBe('');
  });

  it('should return an empty string if the value is a file with an empty name', () => {
    const file = new File(['content'], '');
    const result = pipe.transform(file);
    expect(result).toBe('');
  });

  it('should return the entire string if there is a dot at the end of the filename', () => {
    const result = pipe.transform('example.');
    expect(result).toBe('example.');
  });
});
