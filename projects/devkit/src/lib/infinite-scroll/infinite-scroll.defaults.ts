import { InjectionToken } from '@angular/core';
import { ArdInfScrollTarget } from './infinite-scroll.directive';

export interface ArdInfiniteScrollDefaults {
  threshold: number;
  target: ArdInfScrollTarget;
}

export const ARD_INFINITE_SCROLL_DEFAULTS =
  new InjectionToken<ArdInfiniteScrollDefaults>(
    'ard-infinite-scroll-defaults',
    {
      factory: () => ({
        threshold: 200,
        target: ArdInfScrollTarget.HTML,
      }),
    },
  );
