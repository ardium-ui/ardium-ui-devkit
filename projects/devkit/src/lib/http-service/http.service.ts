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
import { DefaultRequestOptions, RequestOptions, RequestReturnType } from './_types';

const FAULTY_URL_REGEX = /https?:\/\//;

function getUrl(apiUrl: string, url: string): string {
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
    request(
      method: string,
      url: string,
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    request(
      method: string,
      url: string,
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    request(
      method: string,
      url: string,
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    request(
      method: string,
      url: string,
      options: {
        body?: any;
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    request(
      method: string,
      url: string,
      options: {
        body?: any;
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    request(
      method: string,
      url: string,
      options: {
        body?: any;
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    request(
      method: string,
      url: string,
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        reportProgress?: boolean;
        observe: 'events';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    request<R>(
      method: string,
      url: string,
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        reportProgress?: boolean;
        observe: 'events';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    request(
      method: string,
      url: string,
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    request(
      method: string,
      url: string,
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    request(
      method: string,
      url: string,
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    request(
      method: string,
      url: string,
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        reportProgress?: boolean;
        observe: 'response';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    request<R>(
      method: string,
      url: string,
      options: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        reportProgress?: boolean;
        observe: 'response';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    request(
      method: string,
      url: string,
      options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    request<R>(
      method: string,
      url: string,
      options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    request(
      method: string,
      url: string,
      options?: {
        body?: any;
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
        observe?: 'body' | 'events' | 'response';
        reportProgress?: boolean;
        responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<any>;

    // Implementation
    request<TRes = Object, O extends RequestOptions = RequestOptions>(
      methodOrReq: string | HttpRequest<any>,
      url?: string,
      options?: O,
    ): Observable<RequestReturnType<O, TRes>> {
      if (typeof methodOrReq === 'string') {
        const finalUrl = getUrl(apiUrl, url!);
        const finalOptions = getOpts(defaultOptions, options);
        return http.request(methodOrReq, finalUrl, finalOptions) as Observable<
          RequestReturnType<O, TRes>
        >;
      }
      return http.request(methodOrReq) as Observable<
        RequestReturnType<O, TRes>
      >;
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
    delete(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    delete(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    delete(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    delete(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    delete(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    delete(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    delete(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    delete<T>(
      url: string,
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
    ): Observable<HttpEvent<T>>;

    /**
     * Constructs a `DELETE` request that interprets the body as an `ArrayBuffer` and returns
     * the full `HttpResponse`.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the full `HttpResponse`, with the response body as an `ArrayBuffer`.
     */
    delete(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    delete(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    delete(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    delete(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    delete<T>(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        body?: any | null;
      },
    ): Observable<HttpResponse<T>>;

    /**
     * Constructs a `DELETE` request that interprets the body as JSON
     * and returns the response body as an object parsed from JSON.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the response, with the response body of type `Object`.
     */
    delete(
      url: string,
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    delete<T>(
      url: string,
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        body?: any | null;
      },
    ): Observable<T>;

    delete<TRes = Object, O extends RequestOptions = RequestOptions>(
      url: string,
      options?: O,
    ): Observable<RequestReturnType<O, TRes>> {
      const finalUrl = getUrl(apiUrl, url);
      const finalOptions = getOpts(defaultOptions, options);
      return http.delete(finalUrl, finalOptions) as Observable<
        RequestReturnType<O, TRes>
      >;
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
    get(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    get(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    get(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    get(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    get(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    get(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    get(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    get<T>(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<T>>;

    /**
     * Constructs a `GET` request that interprets the body as an `ArrayBuffer` and
     * returns the full `HttpResponse`.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the `HttpResponse` for the request,
     * with the response body as an `ArrayBuffer`.
     */
    get(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    get(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    get(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    get(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    get<T>(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<T>>;

    /**
     * Constructs a `GET` request that interprets the body as JSON
     * and returns the response body as a JavaScript object.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the response body as a JavaScript object.
     */
    get(
      url: string,
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    get<T>(
      url: string,
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<T>;

    get<TRes = Object, O extends RequestOptions = RequestOptions>(
      url: string,
      options?: O,
    ): Observable<RequestReturnType<O, TRes>> {
      const finalUrl = getUrl(apiUrl, url);
      const finalOptions = getOpts(defaultOptions, options);
      return http.get(finalUrl, finalOptions) as Observable<
        RequestReturnType<O, TRes>
      >;
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
    head(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    head(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    head(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    head(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    head(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    head(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    head(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    head<T>(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<T>>;

    /**
     * Constructs a `HEAD` request that interprets the body as an `ArrayBuffer`
     * and returns the full HTTP response.
     *
     * @param url     The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @return An `Observable` of the `HttpResponse` for the request,
     * with the response body as an `ArrayBuffer`.
     */
    head(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    head(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    head(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    head(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    head<T>(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe?: 'body';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<T>;

    head<TRes = Object, O extends RequestOptions = RequestOptions>(
      url: string,
      options?: O,
    ): Observable<RequestReturnType<O, TRes>> {
      const finalUrl = getUrl(apiUrl, url);
      const finalOptions = getOpts(defaultOptions, options);
      return http.head(finalUrl, finalOptions) as Observable<
        RequestReturnType<O, TRes>
      >;
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
    jsonp(url: string, callbackParam: string): Observable<Object>;

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
    jsonp<T>(url: string, callbackParam: string): Observable<T>;

    jsonp<TRes = Object>(url: string, callbackParam: string): Observable<TRes> {
      url = getUrl(apiUrl, url);
      return http.jsonp(url, callbackParam) as Observable<TRes>;
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
    options(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    options(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    options(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    options(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    options(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    options(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    options(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    options<T>(
      url: string,
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
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpEvent<T>>;

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
    options(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    options(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    options(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    options(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    options<T>(
      url: string,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<T>>;

    /**
     * Constructs an `OPTIONS` request that interprets the body as JSON and returns the
     * response body as an object parsed from JSON.
     *
     * @param url The endpoint URL.
     * @param options HTTP options.
     *
     * @return An `Observable` of the response, with the response body as an object parsed from JSON.
     */
    options(
      url: string,
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    options<T>(
      url: string,
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<T>;

    options<TRes = Object, O extends RequestOptions = RequestOptions>(
      url: string,
      options?: O,
    ): Observable<RequestReturnType<O, TRes>> {
      const finalUrl = getUrl(apiUrl, url);
      const finalOptions = getOpts(defaultOptions, options);
      return http.options(finalUrl, finalOptions) as Observable<
        RequestReturnType<O, TRes>
      >;
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
    patch(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    patch(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    patch(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    patch(
      url: string,
      body: any | null,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    patch(
      url: string,
      body: any | null,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    patch(
      url: string,
      body: any | null,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    patch(
      url: string,
      body: any | null,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    patch<T>(
      url: string,
      body: any | null,
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
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpEvent<T>>;

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
    patch(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    patch(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    patch(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    patch(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    patch<T>(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<T>>;

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
    patch(
      url: string,
      body: any | null,
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    patch<T>(
      url: string,
      body: any | null,
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<T>;

    patch<
      TBody = any,
      TRes = Object,
      O extends RequestOptions = RequestOptions,
    >(
      url: string,
      body: TBody | null,
      options?: O,
    ): Observable<RequestReturnType<O, TRes>> {
      const finalUrl = getUrl(apiUrl, url);
      const finalOptions = getOpts(defaultOptions, options);
      return http.patch(finalUrl, body, finalOptions) as Observable<
        RequestReturnType<O, TRes>
      >;
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
    post(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    post(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    post(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    post(
      url: string,
      body: any | null,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    post(
      url: string,
      body: any | null,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    post(
      url: string,
      body: any | null,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    post(
      url: string,
      body: any | null,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    post<T>(
      url: string,
      body: any | null,
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
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpEvent<T>>;

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
    post(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    post(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    post(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    post(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    post<T>(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<HttpResponse<T>>;

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
    post(
      url: string,
      body: any | null,
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    post<T>(
      url: string,
      body: any | null,
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        transferCache?: { includeHeaders?: string[] } | boolean;
      },
    ): Observable<T>;

    post<TBody = any, TRes = Object, O extends RequestOptions = RequestOptions>(
      url: string,
      body: TBody | null,
      options?: O,
    ): Observable<RequestReturnType<O, TRes>> {
      const finalUrl = getUrl(apiUrl, url);
      const finalOptions = getOpts(defaultOptions, options);
      return http.post(finalUrl, body, finalOptions) as Observable<
        RequestReturnType<O, TRes>
      >;
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
    put(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    put(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    put(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    put(
      url: string,
      body: any | null,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    put(
      url: string,
      body: any | null,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    put(
      url: string,
      body: any | null,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    put(
      url: string,
      body: any | null,
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
                | ReadonlyArray<string | number | boolean>;
            };
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
    put<T>(
      url: string,
      body: any | null,
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
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpEvent<T>>;

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
    put(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    put(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    put(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    put(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    put<T>(
      url: string,
      body: any | null,
      options: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe: 'response';
        context?: HttpContext;
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<HttpResponse<T>>;

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
    put(
      url: string,
      body: any | null,
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
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
    put<T>(
      url: string,
      body: any | null,
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext;
        observe?: 'body';
        params?:
          | HttpParams
          | {
              [param: string]:
                | string
                | number
                | boolean
                | ReadonlyArray<string | number | boolean>;
            };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      },
    ): Observable<T>;

    put<TBody = any, TRes = Object, O extends RequestOptions = RequestOptions>(
      url: string,
      body: TBody | null,
      options?: O,
    ): Observable<RequestReturnType<O, TRes>> {
      const finalUrl = getUrl(apiUrl, url);
      const finalOptions = getOpts(defaultOptions, options);
      return http.put(finalUrl, body, finalOptions) as Observable<
        RequestReturnType<O, TRes>
      >;
    }
  };
}
