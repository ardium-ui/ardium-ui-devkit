import { InjectionToken } from '@angular/core';

export interface ArdHoldDefaults {
  delay: number;
  repeat: number;
  allowSpaceKey: boolean;
  allowEnterKey: boolean;
}

export const ARD_HOLD_DEFAULTS = new InjectionToken<ArdHoldDefaults>(
  'ard-hold-defaults',
  {
    factory: () => ({
      delay: 500,
      repeat: 1000 / 15,
      allowSpaceKey: false,
      allowEnterKey: false,
    }),
  },
);
