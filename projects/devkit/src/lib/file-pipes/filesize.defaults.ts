import { InjectionToken } from '@angular/core';

export interface ArdFilesizePipeDefaults {
  precision: number;
  useSpace: boolean;
}

export const ARD_FILESIZE_PIPE_DEFAULTS = new InjectionToken<ArdFilesizePipeDefaults>(
  'ard-filesize-defaults',
  {
    factory: () => ({
      precision: 2,
      useSpace: true,
    }),
  },
);
