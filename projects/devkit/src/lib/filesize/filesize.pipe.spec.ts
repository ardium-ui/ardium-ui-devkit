import { ArdiumFilesizePipe } from './filesize.pipe';

describe('FilesizePipe', () => {
  it('create an instance', () => {
    const pipe = new ArdiumFilesizePipe();
    expect(pipe).toBeTruthy();
  });
});
