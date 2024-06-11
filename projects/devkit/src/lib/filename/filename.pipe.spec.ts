import { ArdiumFilenamePipe } from './filename.pipe';

describe('FilenamePipe', () => {
  it('create an instance', () => {
    const pipe = new ArdiumFilenamePipe();
    expect(pipe).toBeTruthy();
  });
});
