import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { _AngularHttpClientOptions as AngularHttpClientOptions } from './_types';
import { DEFAULT_HTTP_OPTIONS } from './http-service-defaults';

/**
 * A service that wraps Angular's HttpClient and applies default options
 * for every HTTP request. The default options (including the base `apiUrl`)
 * are provided via the {@link provideHttpService} function.
 */
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly _http = inject(HttpClient);

  private readonly _providedToken = inject(DEFAULT_HTTP_OPTIONS);
  private readonly apiUrl = this._providedToken.apiUrl.endsWith('/')
    ? this._providedToken.apiUrl
    : this._providedToken.apiUrl + '/';

  get<TResponse = any>(
    url: string,
    options: AngularHttpClientOptions = {},
  ): Observable<TResponse> {
    url = this._getUrl(url);
    options = this._getOpts(options);
    return this._http.get<TResponse>(
      url,
      options as any,
    ) as Observable<TResponse>;
  }
  post<TBody = undefined, TResponse = any>(
    url: string,
    body: TBody,
    options: AngularHttpClientOptions = {},
  ): Observable<TResponse> {
    url = this._getUrl(url);
    options = this._getOpts(options);
    return this._http.post<TResponse>(
      url,
      body,
      options as any,
    ) as Observable<TResponse>;
  }
  put<TBody = undefined, TResponse = any>(
    url: string,
    body: TBody,
    options: AngularHttpClientOptions = {},
  ): Observable<TResponse> {
    url = this._getUrl(url);
    options = this._getOpts(options);
    return this._http.put<TResponse>(
      url,
      body,
      options as any,
    ) as Observable<TResponse>;
  }
  patch<TBody = undefined, TResponse = any>(
    url: string,
    body: TBody,
    options: AngularHttpClientOptions = {},
  ): Observable<TResponse> {
    url = this._getUrl(url);
    options = this._getOpts(options);
    return this._http.patch<TResponse>(
      url,
      body,
      options as any,
    ) as Observable<TResponse>;
  }
  delete<TResponse = any>(
    url: string,
    options: AngularHttpClientOptions = {},
  ): Observable<TResponse> {
    url = this._getUrl(url);
    options = this._getOpts(options);
    return this._http.delete<TResponse>(
      url,
      options as any,
    ) as Observable<TResponse>;
  }
  head<TResponse = any>(
    url: string,
    options: AngularHttpClientOptions = {},
  ): Observable<TResponse> {
    url = this._getUrl(url);
    options = this._getOpts(options);
    return this._http.head<TResponse>(
      url,
      options as any,
    ) as Observable<TResponse>;
  }
  options<TResponse = any>(
    url: string,
    options: AngularHttpClientOptions = {},
  ): Observable<TResponse> {
    url = this._getUrl(url);
    options = this._getOpts(options);
    return this._http.options<TResponse>(
      url,
      options as any,
    ) as Observable<TResponse>;
  }

  private _getUrl(url: string): string {
    if (this.apiUrl === 'ɘnullɘ/')
      throw new Error(
        `DKT-FT0020: HttpService needs to be provided using 'provideHttpService' before it can be used.`,
      );
    return this.apiUrl + url.replace(/^\//, '');
  }
  private _getOpts(
    options: AngularHttpClientOptions,
  ): AngularHttpClientOptions {
    return { ...this._providedToken.options, ...options };
  }
}
