import { InjectionToken, Provider } from '@angular/core';
import { ArdViewportObserverConfig } from './viewport-observer-ref';

export interface ArdViewportObserverDefaults
  extends Required<ArdViewportObserverConfig> {
  margin: Required<Exclude<ArdViewportObserverConfig['margin'], undefined>>;
}

const _viewportObserverDefaults: ArdViewportObserverDefaults = {
  margin: 0,
  throttleTime: 100,
};

export const ARD_VIEWPORT_OBSERVER_DEFAULTS =
  new InjectionToken<ArdViewportObserverDefaults>(
    'ard-viewport-observer-defaults',
    {
      factory: () => ({
        ..._viewportObserverDefaults,
      }),
    },
  );

export function provideViewportObserverDefaults(
  config: Partial<ArdViewportObserverDefaults>,
): Provider {
  return {
    provide: ARD_VIEWPORT_OBSERVER_DEFAULTS,
    useValue: { ..._viewportObserverDefaults, ...config },
  };
}
