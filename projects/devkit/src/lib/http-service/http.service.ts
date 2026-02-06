import {
  HttpClient,
  HttpContext,
  HttpEvent,
  HttpHeaders,
  HttpParams,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DefaultRequestOptions,
  ObjectHttpParams,
  RequestOptions,
} from './_types';
import { normalizePath } from './_utils';

const FAULTY_URL_REGEX = /https?:\/\//;

function getUrl(apiUrl: string, url: string | string[]): string {
  url = normalizePath(url);
  const finalUrl = apiUrl + url.replace(/^\//, '');
  if (FAULTY_URL_REGEX.test(url)) {
    console.warn(
      `DKT-WA0020: The url "${url}" passed into custom HTTP Service seems to be faulty, as it would produce a request to "${finalUrl}". Custom HTTP Service instances prepend an API url, and thus only accept relative url paths.`,
    );
  }
  return finalUrl;
}

function getOpts(
  defaultOptions: DefaultRequestOptions,
  options?: RequestOptions,
): any {
  return { ...defaultOptions, ...(options ?? {}) };
}

function convertToHttpParams(
  params: HttpParams | ObjectHttpParams | undefined,
): HttpParams {
  if (params instanceof HttpParams || !params) {
    return params as HttpParams;
  }
  let httpParams = new HttpParams();
  for (const key of Object.keys(params)) {
    const value = params[key];
    if (value == null) {
      continue;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        httpParams = httpParams.append(key, item.toString());
      });
    } else {
      httpParams = httpParams.append(key, value.toString());
    }
  }
  return httpParams;
}

export function createHttpService(
  apiUrl: string,
  defaultOptions: DefaultRequestOptions = {},
) {
  let http!: HttpClient;
  return class {
    constructor() {
      http = inject(HttpClient);
    }

    public readonly apiUrl = apiUrl;

    //! =============================================
    //! REQUEST
    //! =============================================

    /**
     * Sends an `HttpRequest` and returns a stream of `HttpEvent`s.
     *
     * @param req The `HttpRequest` object to send.
     * @return An `Observable` of the response, with the response body as a stream of `HttpEvent`s.
     */
    request<R>(req: HttpRequest<any>): Observable<HttpEvent<R>>;

    /**
     * Constructs a request that interprets the body as an `ArrayBuffer` and returns the response in an `ArrayBuffer`.
     *
     * @param method The HTTP method.
     * @param url The endpoint URL.
     * @param options The HTTP options with responseType set to 'arraybuffer'.
     * @return An `Observable` of the response, with the response body as an `ArrayBuffer`.
     */
    request<TParams extends ObjectHttpParams>(
      method: string,
      url: string | string[],
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<ArrayBuffer>;

    /**
     * Constructs a request that interprets the body as a `Blob` and returns the response as a `Blob`.
     *
     * @param method The HTTP method.
     * @param url The endpoint URL.
     * @param options The HTTP options with responseType set to 'blob'.
     * @return An `Observable` of the response, with the response body as a `Blob`.
     */
    request<TParams extends ObjectHttpParams = ObjectHttpParams>(
      method: string,
      url: string | string[],
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<Blob>;

    /**
     * Constructs a request that interprets the body as text and returns the response as a string.
     *
     * @param method The HTTP method.
     * @param url The endpoint URL.
     * @param options The HTTP options with responseType set to 'text'.
     * @return An `Observable` of the response, with the response body as a string.
     */
    request<TParams extends ObjectHttpParams = ObjectHttpParams>(
      method: string,
      url: string | string[],
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<string>;

    /**
     * Constructs a request that interprets the body as an `ArrayBuffer` and returns the full event stream.
     *
     * @param method The HTTP method.
     * @param url The endpoint URL.
     * @param options The HTTP options with observe set to 'events' and responseType set to 'arraybuffer'.
     * @return An `Observable` of `HttpEvent<ArrayBuffer>`.
     */
    request<TParams extends ObjectHttpParams = ObjectHttpParams>(
      method: string,
      url: string | string[],
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<ArrayBuffer>>;

    /**
     * Constructs a request that interprets the body as a `Blob` and returns the full event stream.
     *
     * @param method The HTTP method.
     * @param url The endpoint URL.
     * @param options The HTTP options with observe set to 'events' and responseType set to 'blob'.
     * @return An `Observable` of `HttpEvent<Blob>`.
     */
    request<TParams extends ObjectHttpParams = ObjectHttpParams>(
      method: string,
      url: string | string[],
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<Blob>>;

    /**
     * Constructs a request that interprets the body as text and returns the full event stream.
     *
     * @param method The HTTP method.
     * @param url The endpoint URL.
     * @param options The HTTP options with observe set to 'events' and responseType set to 'text'.
     * @return An `Observable` of `HttpEvent<string>`.
     */
    request<TParams extends ObjectHttpParams = ObjectHttpParams>(
      method: string,
      url: string | string[],
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<string>>;

    /**
     * Constructs a request that interprets the body as a JavaScript object and returns the full event stream.
     *
     * @param method The HTTP method.
     * @param url The endpoint URL.
     * @param options The HTTP options with observe set to 'events' and responseType set to 'json'.
     * @return An `Observable` of `HttpEvent<any>`.
     */
    request<TParams extends ObjectHttpParams = ObjectHttpParams>(
      method: string,
      url: string | string[],
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        reportProgress?: boolean;
        observe: 'events';
        params?: HttpParams | TParams;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<any>>;

    /**
     * Constructs a request that interprets the body as a JavaScript object and returns the full event stream with a specified response type.
     *
     * @param R The expected response type.
     * @param method The HTTP method.
     * @param url The endpoint URL.
     * @param options The HTTP options with observe set to 'events' and responseType set to 'json'.
     * @return An `Observable` of `HttpEvent<R>`.
     */
    request<R, TParams extends ObjectHttpParams = ObjectHttpParams>(
      method: string,
      url: string | string[],
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        reportProgress?: boolean;
        observe: 'events';
        params?: HttpParams | TParams;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<R>>;

    /**
     * Constructs a request that interprets the body as an `ArrayBuffer` and returns the full HTTP response.
     *
     * @param method The HTTP method.
     * @param url The endpoint URL.
     * @param options The HTTP options with observe set to 'response' and responseType set to 'arraybuffer'.
     * @return An `Observable` of `HttpResponse<ArrayBuffer>`.
     */
    request<TParams extends ObjectHttpParams = ObjectHttpParams>(
      method: string,
      url: string | string[],
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<ArrayBuffer>>;

    /**
     * Constructs a request that interprets the body as a `Blob` and returns the full HTTP response.
     *
     * @param method The HTTP method.
     * @param url The endpoint URL.
     * @param options The HTTP options with observe set to 'response' and responseType set to 'blob'.
     * @return An `Observable` of `HttpResponse<Blob>`.
     */
    request<TParams extends ObjectHttpParams = ObjectHttpParams>(
      method: string,
      url: string | string[],
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<Blob>>;

    /**
     * Constructs a request that interprets the body as text and returns the full HTTP response.
     *
     * @param method The HTTP method.
     * @param url The endpoint URL.
     * @param options The HTTP options with observe set to 'response' and responseType set to 'text'.
     * @return An `Observable` of `HttpResponse<string>`.
     */
    request<TParams extends ObjectHttpParams = ObjectHttpParams>(
      method: string,
      url: string | string[],
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<string>>;

    /**
     * Constructs a request that interprets the body as a JavaScript object and returns the full HTTP response.
     *
     * @param method The HTTP method.
     * @param url The endpoint URL.
     * @param options The HTTP options with observe set to 'response' and responseType set to 'json'.
     * @return An `Observable` of `HttpResponse<Object>`.
     */
    request<TParams extends ObjectHttpParams = ObjectHttpParams>(
      method: string,
      url: string | string[],
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        reportProgress?: boolean;
        observe: 'response';
        params?: HttpParams | TParams;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<Object>>;

    /**
     * Constructs a request that interprets the body as a JavaScript object and returns the full HTTP response with a specified response type.
     *
     * @param R The expected response type.
     * @param method The HTTP method.
     * @param url The endpoint URL.
     * @param options The HTTP options with observe set to 'response' and responseType set to 'json'.
     * @return An `Observable` of `HttpResponse<R>`.
     */
    request<R, TParams extends ObjectHttpParams = ObjectHttpParams>(
      method: string,
      url: string | string[],
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        reportProgress?: boolean;
        observe: 'response';
        params?: HttpParams | TParams;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<R>>;

    /**
     * Constructs a request that interprets the body as a JavaScript object and returns the response body.
     *
     * @param method The HTTP method.
     * @param url The endpoint URL.
     * @param options The HTTP options with default observe and responseType settings.
     * @return An `Observable` of the response body as an object.
     */
    request<TParams extends ObjectHttpParams = ObjectHttpParams>(
      method: string,
      url: string | string[],
      options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        responseType?: 'json';
        reportProgress?: boolean;
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<Object>;

    /**
     * Constructs a request that interprets the body as a JavaScript object and returns the response body with a specified type.
     *
     * @param R The expected response type.
     * @param method The HTTP method.
     * @param url The endpoint URL.
     * @param options The HTTP options with default observe and responseType settings.
     * @return An `Observable` of the response body of type `R`.
     */
    request<R, TParams extends ObjectHttpParams = ObjectHttpParams>(
      method: string,
      url: string | string[],
      options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        responseType?: 'json';
        reportProgress?: boolean;
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<R>;

    /**
     * Constructs a request where response type and requested observable are not known statically.
     *
     * @param method The HTTP method.
     * @param url The endpoint URL.
     * @param options The HTTP options with flexible observe and responseType settings.
     * @return An `Observable` of the requested response.
     */
    request<TParams extends ObjectHttpParams = ObjectHttpParams>(
      method: string,
      url: string | string[],
      options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        params?: HttpParams | TParams;
        observe?: 'body' | 'events' | 'response';
        reportProgress?: boolean;
        responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<any>;

    request<TParams extends ObjectHttpParams = ObjectHttpParams>(
      methodOrReq: string | HttpRequest<any>,
      url?: string | string[],
      options?: RequestOptions<TParams>,
    ) {
      if (typeof methodOrReq === 'string') {
        const finalUrl = getUrl(apiUrl, url!);
        const finalOptions = getOpts(defaultOptions, options);
        if (finalOptions.params) {
          finalOptions.params = convertToHttpParams(finalOptions.params);
        }
        return http.request(methodOrReq, finalUrl, finalOptions) as any;
      }
      return http.request(methodOrReq) as any;
    }

    //! =============================================
    //! DELETE
    //! =============================================

    /**
     * Constructs a `DELETE` request that interprets the body as an `ArrayBuffer`
     * and returns the response as an `ArrayBuffer`.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the response body as an `ArrayBuffer`.
     */
    delete<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        body?: any | null;
      },
    ): Observable<ArrayBuffer>;

    /**
     * Constructs a `DELETE` request that interprets the body as a `Blob` and returns
     * the response as a `Blob`.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the response body as a `Blob`.
     */
    delete<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
        body?: any | null;
      },
    ): Observable<Blob>;

    /**
     * Constructs a `DELETE` request that interprets the body as a text string and returns
     * a string.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the response, with the response body of type string.
     */
    delete<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
        body?: any | null;
      },
    ): Observable<string>;

    /**
     * Constructs a `DELETE` request that interprets the body as an `ArrayBuffer`
     * and returns the full event stream.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of all `HttpEvent`s for the request,
     * with response body as an `ArrayBuffer`.
     */
    delete<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        body?: any | null;
      },
    ): Observable<HttpEvent<ArrayBuffer>>;

    /**
     * Constructs a `DELETE` request that interprets the body as a `Blob`
     * and returns the full event stream.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of all the `HttpEvent`s for the request, with the response body as a `Blob`.
     */
    delete<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
        body?: any | null;
      },
    ): Observable<HttpEvent<Blob>>;

    /**
     * Constructs a `DELETE` request that interprets the body as a text string
     * and returns the full event stream.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of all `HttpEvent`s for the request, with the response body of type string.
     */
    delete<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
        body?: any | null;
      },
    ): Observable<HttpEvent<string>>;

    /**
     * Constructs a `DELETE` request that interprets the body as JSON
     * and returns the full event stream.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of all `HttpEvent`s for the request, with response body of type `Object`.
     */
    delete<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        body?: any | null;
      },
    ): Observable<HttpEvent<Object>>;

    /**
     * Constructs a `DELETE` request that interprets the body as JSON
     * and returns the full event stream.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of all `HttpEvent`s for the request, with a response body in the requested type.
     */
    delete<TRes, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | (string | number | boolean)[];
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        body?: any | null;
      },
    ): Observable<HttpEvent<TRes>>;

    /**
     * Constructs a `DELETE` request that interprets the body as an `ArrayBuffer` and returns
     * the full `HttpResponse`.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the full `HttpResponse`, with the response body as an `ArrayBuffer`.
     */
    delete<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        body?: any | null;
      },
    ): Observable<HttpResponse<ArrayBuffer>>;

    /**
     * Constructs a `DELETE` request that interprets the body as a `Blob` and returns the full
     * `HttpResponse`.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the `HttpResponse`, with the response body of type `Blob`.
     */
    delete<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
        body?: any | null;
      },
    ): Observable<HttpResponse<Blob>>;

    /**
     * Constructs a `DELETE` request that interprets the body as a text stream and
     * returns the full `HttpResponse`.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the full `HttpResponse`, with the response body of type string.
     */
    delete<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
        body?: any | null;
      },
    ): Observable<HttpResponse<string>>;

    /**
     * Constructs a `DELETE` request that interprets the body as a JavaScript object and returns
     * the full `HttpResponse`.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the `HttpResponse`, with the response body of type `Object`.
     */
    delete<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        body?: any | null;
      },
    ): Observable<HttpResponse<Object>>;

    /**
     * Constructs a `DELETE` request that interprets the body as JSON
     * and returns the full `HttpResponse`.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the `HttpResponse`, with the response body of the requested type.
     */
    delete<TRes, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        body?: any | null;
      },
    ): Observable<HttpResponse<TRes>>;

    /**
     * Constructs a `DELETE` request that interprets the body as JSON
     * and returns the response body as an object parsed from JSON.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the response, with the response body of type `Object`.
     */
    delete<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        body?: any | null;
      },
    ): Observable<Object>;

    /**
     * Constructs a DELETE request that interprets the body as JSON and returns
     * the response in a given type.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the response body in the requested type.
     */
    delete<TRes, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        body?: any | null;
      },
    ): Observable<TRes>;

    delete<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options?: RequestOptions<TParams>,
    ) {
      const finalUrl = getUrl(apiUrl, url);
      const finalOptions = getOpts(defaultOptions, options);
      if (finalOptions.params) {
        finalOptions.params = convertToHttpParams(finalOptions.params);
      }
      return http.delete(finalUrl, finalOptions) as any;
    }

    //! =============================================
    //! GET
    //! =============================================

    /**
     * Constructs a `GET` request that interprets the body as an `ArrayBuffer` and returns the
     * response in an `ArrayBuffer`.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the response, with the response body as an `ArrayBuffer`.
     */
    get<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<ArrayBuffer>;

    /**
     * Constructs a `GET` request that interprets the body as a `Blob`
     * and returns the response as a `Blob`.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the response, with the response body as a `Blob`.
     */
    get<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<Blob>;

    /**
     * Constructs a `GET` request that interprets the body as a text string
     * and returns the response as a string value.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the response, with the response body of type string.
     */
    get<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<string>;

    /**
     * Constructs a `GET` request that interprets the body as an `ArrayBuffer` and returns
     * the full event stream.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of all `HttpEvent`s for the request,
     * with the response body as an `ArrayBuffer`.
     */
    get<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<ArrayBuffer>>;

    /**
     * Constructs a `GET` request that interprets the body as a `Blob` and
     * returns the full event stream.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of all `HttpEvent`s for the request,
     * with the response body as a `Blob`.
     */
    get<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<Blob>>;

    /**
     * Constructs a `GET` request that interprets the body as a text string and returns
     * the full event stream.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of all `HttpEvent`s for the request,
     * with the response body of type string.
     */
    get<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<string>>;

    /**
     * Constructs a `GET` request that interprets the body as JSON
     * and returns the full event stream.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the response, with the response body of type `Object`.
     */
    get<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<Object>>;

    /**
     * Constructs a `GET` request that interprets the body as JSON
     * and returns the full event stream.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the response, with a response body in the requested type.
     */
    get<TRes, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<TRes>>;

    /**
     * Constructs a `GET` request that interprets the body as an `ArrayBuffer` and
     * returns the full `HttpResponse`.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the `HttpResponse` for the request,
     * with the response body as an `ArrayBuffer`.
     */
    get<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<ArrayBuffer>>;

    /**
     * Constructs a `GET` request that interprets the body as a `Blob` and
     * returns the full `HttpResponse`.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the `HttpResponse` for the request,
     * with the response body as a `Blob`.
     */
    get<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<Blob>>;

    /**
     * Constructs a `GET` request that interprets the body as a text stream and
     * returns the full `HttpResponse`.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the `HttpResponse` for the request,
     * with the response body of type string.
     */
    get<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<string>>;

    /**
     * Constructs a `GET` request that interprets the body as JSON
     * and returns the full `HttpResponse`.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the full `HttpResponse`,
     * with the response body of type `Object`.
     */
    get<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<Object>>;

    /**
     * Constructs a `GET` request that interprets the body as JSON
     * and returns the full `HttpResponse`.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the full `HttpResponse` for the request,
     * with a response body in the requested type.
     */
    get<TRes, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<TRes>>;

    /**
     * Constructs a `GET` request that interprets the body as JSON
     * and returns the response body as a JavaScript object.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the response body as a JavaScript object.
     */
    get<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<Object>;

    /**
     * Constructs a `GET` request that interprets the body as JSON
     * and returns the response body in a given type.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the response body in the requested type.
     */
    get<TRes, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<TRes>;

    get<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options?: RequestOptions<TParams>,
    ) {
      const finalUrl = getUrl(apiUrl, url);
      const finalOptions = getOpts(defaultOptions, options);
      if (finalOptions.params) {
        finalOptions.params = convertToHttpParams(finalOptions.params);
      }
      return http.get(finalUrl, finalOptions) as any;
    }

    //! =============================================
    //! HEAD
    //! =============================================

    /**
     * Constructs a `HEAD` request that interprets the body as an `ArrayBuffer` and
     * returns the response as an `ArrayBuffer`.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the response, with the response body as an `ArrayBuffer`.
     */
    head<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<ArrayBuffer>;

    /**
     * Constructs a `HEAD` request that interprets the body as a `Blob` and returns
     * the response as a `Blob`.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the response, with the response body as a `Blob`.
     */
    head<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<Blob>;

    /**
     * Constructs a `HEAD` request that interprets the body as a text string and returns the response
     * as a string value.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the response, with the response body of type string.
     */
    head<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<string>;

    /**
     * Constructs a `HEAD` request that interprets the body as an `ArrayBuffer`
     * and returns the full event stream.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of all `HttpEvent`s for the request,
     * with the response body as an `ArrayBuffer`.
     */
    head<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<ArrayBuffer>>;

    /**
     * Constructs a `HEAD` request that interprets the body as a `Blob` and
     * returns the full event stream.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of all `HttpEvent`s for the request,
     * with the response body as a `Blob`.
     */
    head<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<Blob>>;

    /**
     * Constructs a `HEAD` request that interprets the body as a text string
     * and returns the full event stream.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of all `HttpEvent`s for the request,
     * with the response body of type string.
     */
    head<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<string>>;

    /**
     * Constructs a `HEAD` request that interprets the body as JSON
     * and returns the full HTTP event stream.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of all `HttpEvent`s for the request,
     * with a response body of type `Object`.
     */
    head<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<Object>>;

    /**
     * Constructs a `HEAD` request that interprets the body as JSON
     * and returns the full HTTP event stream.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of all the `HttpEvent`s for the request,
     * with a response body in the requested type.
     */
    head<TRes, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<TRes>>;

    /**
     * Constructs a `HEAD` request that interprets the body as an `ArrayBuffer`
     * and returns the full HTTP response.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the `HttpResponse` for the request,
     * with the response body as an `ArrayBuffer`.
     */
    head<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<ArrayBuffer>>;

    /**
     * Constructs a `HEAD` request that interprets the body as a `Blob` and returns
     * the full HTTP response.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the `HttpResponse` for the request,
     * with the response body as a blob.
     */
    head<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<Blob>>;

    /**
     * Constructs a `HEAD` request that interprets the body as text stream
     * and returns the full HTTP response.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the `HttpResponse` for the request,
     * with the response body of type string.
     */
    head<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<string>>;

    /**
     * Constructs a `HEAD` request that interprets the body as JSON
     * and returns the full HTTP response.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the `HttpResponse` for the request,
     * with the response body of type `Object`.
     */
    head<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<Object>>;

    /**
     * Constructs a `HEAD` request that interprets the body as JSON
     * and returns the full HTTP response.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the `HttpResponse` for the request,
     * with a response body of the requested type.
     */
    head<TRes, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe?: 'body';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<TRes>;

    head<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options?: RequestOptions<TParams>,
    ) {
      const finalUrl = getUrl(apiUrl, url);
      const finalOptions = getOpts(defaultOptions, options);
      if (finalOptions.params) {
        finalOptions.params = convertToHttpParams(finalOptions.params);
      }
      return http.head(finalUrl, finalOptions) as any;
    }

    //! =============================================
    //! JSONP
    //! =============================================

    /**
     * Constructs a `JSONP` request for the given URL and name of the callback parameter.
     *
     * @param url The resource URL.
     * @param callbackParam The callback function name.
     *
     * @return An `Observable` of the response object, with response body as an object.
     */
    jsonp(url: string | string[], callbackParam: string): Observable<Object>;

    /**
     * Constructs a `JSONP` request for the given URL and name of the callback parameter.
     *
     * @param url The resource URL.
     * @param callbackParam The callback function name.
     *
     * You must install a suitable interceptor, such as one provided by `HttpClientJsonpModule`.
     * If no such interceptor is reached, then the `JSONP` request can be rejected by the configured backend.
     *
     * @return An `Observable` of the response object, with response body in the requested type.
     */
    jsonp<TRes>(
      url: string | string[],
      callbackParam: string,
    ): Observable<TRes>;

    jsonp(url: string | string[], callbackParam: string) {
      url = getUrl(apiUrl, url);
      return http.jsonp(url, callbackParam) as any;
    }

    //! =============================================
    //! OPTIONS
    //! =============================================

    /**
     * Constructs an `OPTIONS` request that interprets the body as an
     * `ArrayBuffer` and returns the response as an `ArrayBuffer`.
     *
     * @param url The endpoint URL.
     * @param options HTTP options.
     *
     * @return An `Observable` of the response, with the response body as an `ArrayBuffer`.
     */
    options<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
      },
    ): Observable<ArrayBuffer>;

    /**
     * Constructs an `OPTIONS` request that interprets the body as a `Blob` and returns
     * the response as a `Blob`.
     *
     * @param url The endpoint URL.
     * @param options HTTP options.
     *
     * @return An `Observable` of the response, with the response body as a `Blob`.
     */
    options<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
      },
    ): Observable<Blob>;

    /**
     * Constructs an `OPTIONS` request that interprets the body as a text string and
     * returns a string value.
     *
     * @param url The endpoint URL.
     * @param options HTTP options.
     *
     * @return An `Observable` of the response, with the response body of type string.
     */
    options<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
      },
    ): Observable<string>;

    /**
     * Constructs an `OPTIONS` request that interprets the body as an `ArrayBuffer`
     * and returns the full event stream.
     *
     * @param url The endpoint URL.
     * @param options HTTP options.
     *
     * @return An `Observable` of all `HttpEvent`s for the request,
     * with the response body as an `ArrayBuffer`.
     */
    options<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
      },
    ): Observable<HttpEvent<ArrayBuffer>>;

    /**
     * Constructs an `OPTIONS` request that interprets the body as a `Blob` and
     * returns the full event stream.
     *
     * @param url The endpoint URL.
     * @param options HTTP options.
     *
     * @return An `Observable` of all `HttpEvent`s for the request,
     * with the response body as a `Blob`.
     */
    options<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
      },
    ): Observable<HttpEvent<Blob>>;

    /**
     * Constructs an `OPTIONS` request that interprets the body as a text string
     * and returns the full event stream.
     *
     * @param url The endpoint URL.
     * @param options HTTP options.
     *
     * @return An `Observable` of all the `HttpEvent`s for the request,
     * with the response body of type string.
     */
    options<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
      },
    ): Observable<HttpEvent<string>>;

    /**
     * Constructs an `OPTIONS` request that interprets the body as JSON
     * and returns the full event stream.
     *
     * @param url The endpoint URL.
     * @param options HTTP options.
     *
     * @return An `Observable` of all the `HttpEvent`s for the request with the response
     * body of type `Object`.
     */
    options<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpEvent<Object>>;

    /**
     * Constructs an `OPTIONS` request that interprets the body as JSON and
     * returns the full event stream.
     *
     * @param url The endpoint URL.
     * @param options HTTP options.
     *
     * @return An `Observable` of all the `HttpEvent`s for the request,
     * with a response body in the requested type.
     */
    options<TRes, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpEvent<TRes>>;

    /**
     * Constructs an `OPTIONS` request that interprets the body as an `ArrayBuffer`
     * and returns the full HTTP response.
     *
     * @param url The endpoint URL.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request,
     * with the response body as an `ArrayBuffer`.
     */
    options<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<ArrayBuffer>>;

    /**
     * Constructs an `OPTIONS` request that interprets the body as a `Blob`
     * and returns the full HTTP response.
     *
     * @param url The endpoint URL.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request,
     * with the response body as a `Blob`.
     */
    options<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<Blob>>;

    /**
     * Constructs an `OPTIONS` request that interprets the body as a text stream
     * and returns the full HTTP response.
     *
     * @param url The endpoint URL.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request,
     * with the response body of type string.
     */
    options<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<string>>;

    /**
     * Constructs an `OPTIONS` request that interprets the body as JSON
     * and returns the full HTTP response.
     *
     * @param url The endpoint URL.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request,
     * with the response body of type `Object`.
     */
    options<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<Object>>;

    /**
     * Constructs an `OPTIONS` request that interprets the body as JSON and
     * returns the full HTTP response.
     *
     * @param url The endpoint URL.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request,
     * with a response body in the requested type.
     */
    options<TRes, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<TRes>>;

    /**
     * Constructs an `OPTIONS` request that interprets the body as JSON and returns the
     * response body as an object parsed from JSON.
     *
     * @param url The endpoint URL.
     * @param options HTTP options.
     *
     * @return An `Observable` of the response, with the response body as an object parsed from JSON.
     */
    options<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<Object>;

    /**
     * Constructs an `OPTIONS` request that interprets the body as JSON and returns the
     * response in a given type.
     *
     * @param url The endpoint URL.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse`, with a response body of the given type.
     */
    options<TRes, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<TRes>;

    options<TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      options?: RequestOptions<TParams>,
    ) {
      const finalUrl = getUrl(apiUrl, url);
      const finalOptions = getOpts(defaultOptions, options);
      if (finalOptions.params) {
        finalOptions.params = convertToHttpParams(finalOptions.params);
      }
      return http.options(finalUrl, finalOptions) as any;
    }

    //! =============================================
    //! PATCH
    //! =============================================

    /**
     * Constructs a `PATCH` request that interprets the body as an `ArrayBuffer` and returns
     * the response as an `ArrayBuffer`.
     *
     * @param url The endpoint URL.
     * @param body The resources to edit.
     * @param options HTTP options.
     *
     * @return An `Observable` of the response, with the response body as an `ArrayBuffer`.
     */
    patch<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
      },
    ): Observable<ArrayBuffer>;

    /**
     * Constructs a `PATCH` request that interprets the body as a `Blob` and returns the response
     * as a `Blob`.
     *
     * @param url The endpoint URL.
     * @param body The resources to edit.
     * @param options HTTP options.
     *
     * @return An `Observable` of the response, with the response body as a `Blob`.
     */
    patch<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
      },
    ): Observable<Blob>;

    /**
     * Constructs a `PATCH` request that interprets the body as a text string and
     * returns the response as a string value.
     *
     * @param url The endpoint URL.
     * @param body The resources to edit.
     * @param options HTTP options.
     *
     * @return An `Observable` of the response, with a response body of type string.
     */
    patch<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
      },
    ): Observable<string>;

    /**
     * Constructs a `PATCH` request that interprets the body as an `ArrayBuffer` and
     * returns the full event stream.
     *
     * @param url The endpoint URL.
     * @param body The resources to edit.
     * @param options HTTP options.
     *
     * @return An `Observable` of all the `HttpEvent`s for the request,
     * with the response body as an `ArrayBuffer`.
     */
    patch<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
      },
    ): Observable<HttpEvent<ArrayBuffer>>;

    /**
     * Constructs a `PATCH` request that interprets the body as a `Blob`
     * and returns the full event stream.
     *
     * @param url The endpoint URL.
     * @param body The resources to edit.
     * @param options HTTP options.
     *
     * @return An `Observable` of all the `HttpEvent`s for the request, with the response body as `Blob`.
     */
    patch<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
      },
    ): Observable<HttpEvent<Blob>>;

    /**
     * Constructs a `PATCH` request that interprets the body as a text string and
     * returns the full event stream.
     *
     * @param url The endpoint URL.
     * @param body The resources to edit.
     * @param options HTTP options.
     *
     * @return An `Observable` of all the `HttpEvent`s for the request, with a
     * response body of type string.
     */
    patch<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
      },
    ): Observable<HttpEvent<string>>;

    /**
     * Constructs a `PATCH` request that interprets the body as JSON
     * and returns the full event stream.
     *
     * @param url The endpoint URL.
     * @param body The resources to edit.
     * @param options HTTP options.
     *
     * @return An `Observable` of all the `HttpEvent`s for the request,
     * with a response body of type `Object`.
     */
    patch<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpEvent<Object>>;

    /**
     * Constructs a `PATCH` request that interprets the body as JSON
     * and returns the full event stream.
     *
     * @param url The endpoint URL.
     * @param body The resources to edit.
     * @param options HTTP options.
     *
     * @return An `Observable` of all the `HttpEvent`s for the request,
     * with a response body in the requested type.
     */
    patch<
      TRes,
      TBody = any,
      TParams extends ObjectHttpParams = ObjectHttpParams,
    >(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpEvent<TRes>>;

    /**
     * Constructs a `PATCH` request that interprets the body as an `ArrayBuffer`
     * and returns the full `HttpResponse`.
     *
     * @param url The endpoint URL.
     * @param body The resources to edit.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request,
     * with the response body as an `ArrayBuffer`.
     */
    patch<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<ArrayBuffer>>;

    /**
     * Constructs a `PATCH` request that interprets the body as a `Blob` and returns the full
     * `HttpResponse`.
     *
     * @param url The endpoint URL.
     * @param body The resources to edit.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request,
     * with the response body as a `Blob`.
     */
    patch<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<Blob>>;

    /**
     * Constructs a `PATCH` request that interprets the body as a text stream and returns the
     * full `HttpResponse`.
     *
     * @param url The endpoint URL.
     * @param body The resources to edit.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request,
     * with a response body of type string.
     */
    patch<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<string>>;

    /**
     * Constructs a `PATCH` request that interprets the body as JSON
     * and returns the full `HttpResponse`.
     *
     * @param url The endpoint URL.
     * @param body The resources to edit.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request,
     * with a response body in the requested type.
     */
    patch<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<Object>>;

    /**
     * Constructs a `PATCH` request that interprets the body as JSON
     * and returns the full `HttpResponse`.
     *
     * @param url The endpoint URL.
     * @param body The resources to edit.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request,
     * with a response body in the given type.
     */
    patch<
      TRes,
      TBody = any,
      TParams extends ObjectHttpParams = ObjectHttpParams,
    >(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<TRes>>;

    /**
     * Constructs a `PATCH` request that interprets the body as JSON and
     * returns the response body as an object parsed from JSON.
     *
     * @param url The endpoint URL.
     * @param body The resources to edit.
     * @param options HTTP options.
     *
     * @return An `Observable` of the response, with the response body as an object parsed from JSON.
     */
    patch<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<Object>;

    /**
     * Constructs a `PATCH` request that interprets the body as JSON and returns
     * the response in a given type.
     *
     * @param url The endpoint URL.
     * @param body The resources to edit.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request,
     * with a response body in the given type.
     */
    patch<
      TRes,
      TBody = any,
      TParams extends ObjectHttpParams = ObjectHttpParams,
    >(
      url: string | string[],
      body: TBody | null,
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<TRes>;

    patch<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options?: RequestOptions<TParams>,
    ) {
      const finalUrl = getUrl(apiUrl, url);
      const finalOptions = getOpts(defaultOptions, options);
      if (finalOptions.params) {
        finalOptions.params = convertToHttpParams(finalOptions.params);
      }
      return http.patch(finalUrl, body, finalOptions) as any;
    }

    //! =============================================
    //! POST
    //! =============================================

    /**
     * Constructs a `POST` request that interprets the body as an `ArrayBuffer` and returns
     * an `ArrayBuffer`.
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     * @param options HTTP options.
     *
     * @return An `Observable` of the response, with the response body as an `ArrayBuffer`.
     */
    post<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<ArrayBuffer>;

    /**
     * Constructs a `POST` request that interprets the body as a `Blob` and returns the
     * response as a `Blob`.
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     * @param options HTTP options.
     *
     * @return An `Observable` of the response, with the response body as a `Blob`.
     */
    post<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<Blob>;

    /**
     * Constructs a `POST` request that interprets the body as a text string and
     * returns the response as a string value.
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     * @param options HTTP options.
     *
     * @return An `Observable` of the response, with a response body of type string.
     */
    post<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<string>;

    /**
     * Constructs a `POST` request that interprets the body as an `ArrayBuffer` and
     * returns the full event stream.
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     * @param options HTTP options.
     *
     * @return An `Observable` of all `HttpEvent`s for the request, with the response body as an `ArrayBuffer`.
     */
    post<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<ArrayBuffer>>;

    /**
     * Constructs a `POST` request that interprets the body as a `Blob`
     * and returns the response in an observable of the full event stream.
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     * @param options HTTP options.
     *
     * @return An `Observable` of all `HttpEvent`s for the request, with the response body as `Blob`.
     */
    post<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<Blob>>;

    /**
     * Constructs a `POST` request that interprets the body as a text string and returns the full
     * event stream.
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     * @param options HTTP options.
     *
     * @return An `Observable` of all `HttpEvent`s for the request, with a response body of type string.
     */
    post<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<string>>;

    /**
     * Constructs a `POST` request that interprets the body as JSON and returns the full
     * event stream.
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     * @param options HTTP options.
     *
     * @return An `Observable` of all `HttpEvent`s for the request, with a response body of type `Object`.
     */
    post<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<Object>>;

    /**
     * Constructs a `POST` request that interprets the body as JSON and returns the full
     * event stream.
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     * @param options HTTP options.
     *
     * @return An `Observable` of all `HttpEvent`s for the request, with a response body in the requested type.
     */
    post<
      TRes,
      TBody = any,
      TParams extends ObjectHttpParams = ObjectHttpParams,
    >(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<TRes>>;

    /**
     * Constructs a `POST` request that interprets the body as an `ArrayBuffer`
     * and returns the full `HttpResponse`.
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request, with the response body as an `ArrayBuffer`.
     */
    post<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<ArrayBuffer>>;

    /**
     * Constructs a `POST` request that interprets the body as a `Blob` and returns the full
     * `HttpResponse`.
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request, with the response body as a `Blob`.
     */
    post<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<Blob>>;

    /**
     * Constructs a `POST` request that interprets the body as a text stream and returns
     * the full `HttpResponse`.
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request, with a response body of type string.
     */
    post<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<string>>;

    /**
     * Constructs a `POST` request that interprets the body as JSON and returns the full
     * `HttpResponse`.
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request, with a response body of type `Object`.
     */
    post<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<Object>>;

    /**
     * Constructs a `POST` request that interprets the body as JSON and returns the full
     * `HttpResponse`.
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request, with a response body in the requested type.
     */
    post<
      TRes,
      TBody = any,
      TParams extends ObjectHttpParams = ObjectHttpParams,
    >(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<TRes>>;

    /**
     * Constructs a `POST` request that interprets the body as JSON and returns the response body
     * as an object parsed from JSON.
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     * @param options HTTP options.
     *
     * @return An `Observable` of the response, with the response body as an object parsed from JSON.
     */
    post<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<Object>;

    /**
     * Constructs a `POST` request that interprets the body as JSON and returns an observable of the response.
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request, with a response body in the requested type.
     */
    post<
      TRes,
      TBody = any,
      TParams extends ObjectHttpParams = ObjectHttpParams,
    >(
      url: string | string[],
      body: TBody | null,
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<TRes>;

    post<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options?: RequestOptions<TParams>,
    ) {
      const finalUrl = getUrl(apiUrl, url);
      const finalOptions = getOpts(defaultOptions, options);
      if (finalOptions.params) {
        finalOptions.params = convertToHttpParams(finalOptions.params);
      }
      return http.post(finalUrl, body, finalOptions) as any;
    }

    //! =============================================
    //! PUT
    //! =============================================

    /**
     * Constructs a `PUT` request that interprets the body as an `ArrayBuffer` and returns the
     * response as an `ArrayBuffer`.
     *
     * @param url The endpoint URL.
     * @param body The resources to add/update.
     * @param options HTTP options.
     *
     * @return An `Observable` of the response, with the response body as an `ArrayBuffer`.
     */
    put<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
      },
    ): Observable<ArrayBuffer>;

    /**
     * Constructs a `PUT` request that interprets the body as a `Blob` and returns
     * the response as a `Blob`.
     *
     * @param url The endpoint URL.
     * @param body The resources to add/update.
     * @param options HTTP options.
     *
     * @return An `Observable` of the response, with the response body as a `Blob`.
     */
    put<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
      },
    ): Observable<Blob>;

    /**
     * Constructs a `PUT` request that interprets the body as a text string and
     * returns the response as a string value.
     *
     * @param url The endpoint URL.
     * @param body The resources to add/update.
     * @param options HTTP options.
     *
     * @return An `Observable` of the response, with a response body of type string.
     */
    put<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
      },
    ): Observable<string>;

    /**
     * Constructs a `PUT` request that interprets the body as an `ArrayBuffer` and
     * returns the full event stream.
     *
     * @param url The endpoint URL.
     * @param body The resources to add/update.
     * @param options HTTP options.
     *
     * @return An `Observable` of all `HttpEvent`s for the request,
     * with the response body as an `ArrayBuffer`.
     */
    put<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
      },
    ): Observable<HttpEvent<ArrayBuffer>>;

    /**
     * Constructs a `PUT` request that interprets the body as a `Blob` and returns the full event
     * stream.
     *
     * @param url The endpoint URL.
     * @param body The resources to add/update.
     * @param options HTTP options.
     *
     * @return An `Observable` of all `HttpEvent`s for the request,
     * with the response body as a `Blob`.
     */
    put<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
      },
    ): Observable<HttpEvent<Blob>>;

    /**
     * Constructs a `PUT` request that interprets the body as a text string and returns the full event
     * stream.
     *
     * @param url The endpoint URL.
     * @param body The resources to add/update.
     * @param options HTTP options.
     *
     * @return An `Observable` of all `HttpEvent`s for the request,
     * with a response body of type string.
     */
    put<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
      },
    ): Observable<HttpEvent<string>>;

    /**
     * Constructs a `PUT` request that interprets the body as JSON and returns the full
     * event stream.
     *
     * @param url The endpoint URL.
     * @param body The resources to add/update.
     * @param options HTTP options.
     *
     * @return An `Observable` of all `HttpEvent`s for the request,
     * with a response body of type `Object`.
     */
    put<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpEvent<Object>>;

    /**
     * Constructs a `PUT` request that interprets the body as JSON and returns the full event stream.
     *
     * @param url The endpoint URL.
     * @param body The resources to add/update.
     * @param options HTTP options.
     *
     * @return An `Observable` of all `HttpEvent`s for the request,
     * with a response body in the requested type.
     */
    put<TRes, TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'events';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpEvent<TRes>>;

    /**
     * Constructs a `PUT` request that interprets the body as an `ArrayBuffer`
     * and returns an observable of the full HTTP response.
     *
     * @param url The endpoint URL.
     * @param body The resources to add/update.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request, with the response body as an `ArrayBuffer`.
     */
    put<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<ArrayBuffer>>;

    /**
     * Constructs a `PUT` request that interprets the body as a `Blob` and returns the
     * full HTTP response.
     *
     * @param url The endpoint URL.
     * @param body The resources to add/update.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request, with the response body as a `Blob`.
     */
    put<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'blob';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<Blob>>;

    /**
     * Constructs a `PUT` request that interprets the body as a text stream and returns the
     * full HTTP response.
     *
     * @param url The endpoint URL.
     * @param body The resources to add/update.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request, with a response body of type string.
     */
    put<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<string>>;

    /**
     * Constructs a `PUT` request that interprets the body as JSON and returns the full
     * HTTP response.
     *
     * @param url The endpoint URL.
     * @param body The resources to add/update.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request, with a response body of type `Object`.
     */
    put<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<Object>>;

    /**
     * Constructs a `PUT` request that interprets the body as an instance of the requested type and
     * returns the full HTTP response.
     *
     * @param url The endpoint URL.
     * @param body The resources to add/update.
     * @param options HTTP options.
     *
     * @return An `Observable` of the `HttpResponse` for the request, with a response body in the requested type.
     */
    put<TRes, TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<TRes>>;

    /**
     * Constructs a `PUT` request that interprets the body as JSON and returns an observable of the
     * JavaScript object.
     *
     * @param url The endpoint URL.
     * @param body The resources to add/update.
     * @param options HTTP options.
     *
     * @return An `Observable` of the response as a JavaScript object.
     */
    put<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<Object>;

    /**
     * Constructs a `PUT` request that interprets the body as an instance of the requested type
     * and returns an observable of the requested type.
     *
     * @param url The endpoint URL.
     * @param body The resources to add/update.
     * @param options HTTP options.
     *
     * @return An `Observable` of the requested type.
     */
    put<TRes, TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | TParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<TRes>;

    put<TBody = any, TParams extends ObjectHttpParams = ObjectHttpParams>(
      url: string | string[],
      body: TBody | null,
      options?: RequestOptions<TParams>,
    ) {
      const finalUrl = getUrl(apiUrl, url);
      const finalOptions = getOpts(defaultOptions, options);
      if (finalOptions.params) {
        finalOptions.params = convertToHttpParams(finalOptions.params);
      }
      return http.put(finalUrl, body, finalOptions) as any;
    }
  };
}
