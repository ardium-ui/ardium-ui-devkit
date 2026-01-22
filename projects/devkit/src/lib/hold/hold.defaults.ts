import { InjectionToken, Provider } from "@angular/core";

export interface ArdHoldDefaults {
  delay: number;
  repeat: number;
  allowSpaceKey: boolean;
  allowEnterKey: boolean;
}

const _holdDefaults: ArdHoldDefaults = {
  delay: 500,
  repeat: 1000 / 15,
  allowSpaceKey: false,
  allowEnterKey: false,
};

export const ARD_HOLD_DEFAULTS = new InjectionToken<ArdHoldDefaults>(
  'ard-hold-defaults',
  {
    factory: () => ({
      ..._holdDefaults,
    }),
  },
);

export function provideHoldDefaults(
  config: Partial<ArdHoldDefaults>,
): Provider {
  return {
    provide: ARD_HOLD_DEFAULTS,
    useValue: { ..._holdDefaults, ...config },
  };
}
