import { InjectionToken } from '@angular/core';

export interface ArdFileextPipeDefaults {
  widthDot: boolean;
}

export const ARD_FILEEXT_PIPE_DEFAULTS = new InjectionToken<ArdFileextPipeDefaults>(
  'ard-fileext-defaults',
  {
    factory: () => ({
      widthDot: false,
    }),
  },
);
