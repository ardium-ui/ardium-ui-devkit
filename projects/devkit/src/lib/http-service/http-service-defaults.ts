import { HttpClient } from '@angular/common/http';
import { InjectionToken, Provider } from '@angular/core';
import {
  _AngularHttpClientOptions as AngularHttpClientOptions,
  HTTP_SERVICE_SYMBOL,
} from './_types';
import { HttpService } from './http.service';

export interface HttpServiceProvider {
  apiUrl: string;
  options: AngularHttpClientOptions;
}

export const DEFAULT_HTTP_OPTIONS = new InjectionToken<HttpServiceProvider>(
  'http-service-provider',
  {
    factory: () => ({
      apiUrl: HTTP_SERVICE_SYMBOL,
      options: {},
    }),
  },
);

export function provideHttpService(
  apiUrl: string,
  defaultOptions?: Partial<AngularHttpClientOptions>,
): [Provider, Provider, Provider] {
  return [
    HttpClient,
    HttpService,
    {
      provide: DEFAULT_HTTP_OPTIONS,
      useValue: { apiUrl, options: { ...(defaultOptions ?? {}) } },
    },
  ];
}
