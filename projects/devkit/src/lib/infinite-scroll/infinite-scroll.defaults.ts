import { InjectionToken, Provider } from '@angular/core';
import { ArdInfScrollTarget } from './infinite-scroll.directive';

export interface ArdInfiniteScrollDefaults {
  threshold: number;
  target: ArdInfScrollTarget;
}

const _infiniteScrollDefaults: ArdInfiniteScrollDefaults = {
  threshold: 200,
  target: ArdInfScrollTarget.HTML,
};

export const ARD_INFINITE_SCROLL_DEFAULTS =
  new InjectionToken<ArdInfiniteScrollDefaults>(
    'ard-infinite-scroll-defaults',
    {
      factory: () => ({ ..._infiniteScrollDefaults }),
    },
  );

export function provideInfiniteScrollDefaults(config: Partial<ArdInfiniteScrollDefaults>): Provider {
  return {
    provide: ARD_INFINITE_SCROLL_DEFAULTS,
    useValue: { ..._infiniteScrollDefaults, ...config },
  };
}
