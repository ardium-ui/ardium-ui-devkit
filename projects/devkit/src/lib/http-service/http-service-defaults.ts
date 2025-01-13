import { InjectionToken, Provider } from '@angular/core';
import { _AngularHttpClientOptions as AngularHttpClientOptions } from './_types';

export interface HttpServiceProvider {
  apiUrl: string;
  options: AngularHttpClientOptions;
}

export const DEFAULT_HTTP_OPTIONS = new InjectionToken<HttpServiceProvider>(
  'http-service-provider',
  {
    factory: () => ({ apiUrl: 'ɘnullɘ', options: {} }),
  },
);

export function provideHttpService(
  apiUrl: string,
  defaultOptions?: Partial<AngularHttpClientOptions>,
): Provider {
  return {
    provide: DEFAULT_HTTP_OPTIONS,
    useValue: { apiUrl, options: { ...(defaultOptions ?? {}) } },
  };
}
