import { HttpClient, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestOptions, RequestReturnType } from './_types';

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
function getOpts<O extends RequestOptions>(
  defaultOptions: RequestOptions,
  options?: O,
): any {
  return { ...defaultOptions, ...(options ?? {}) };
}

export function createHttpService(
  apiUrl: string,
  defaultOptions: RequestOptions = {},
) {
  let http!: HttpClient;
  return class {
    constructor() {
      http = inject(HttpClient);
    }

    public readonly apiUrl = apiUrl;

    /**
     * Sends an HTTP request and returns an Observable of the response.
     *
     * @param methodOrReq The HTTP method as a string or an HttpRequest object.
     * @param url The endpoint URL (if methodOrReq is a string).
     * @param options The HTTP options to send with the request.
     * @returns An Observable of the response type based on the options.
     */
    request<TRes = Object, O extends RequestOptions = {}>(
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

    /**
     * Constructs a DELETE request and returns an Observable of the response.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @returns An Observable of the response type based on the options.
     */
    delete<TBody = Object, TRes = Object, O extends RequestOptions = {}>(
      url: string,
      options?: O & { body?: TBody },
    ): Observable<RequestReturnType<O, TRes>> {
      const finalUrl = getUrl(apiUrl, url);
      const finalOptions = getOpts(defaultOptions, options);
      return http.delete(finalUrl, finalOptions) as Observable<
        RequestReturnType<O, TRes>
      >;
    }

    //! ================================================= GET
    /**
     * Constructs a GET request and returns an Observable of the response.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @returns An Observable of the response type based on the options.
     */
    get<TRes = Object, O extends RequestOptions = {}>(
      url: string,
      options?: O,
    ): Observable<RequestReturnType<O, TRes>> {
      const finalUrl = getUrl(apiUrl, url);
      const finalOptions = getOpts(defaultOptions, options);
      return http.get(finalUrl, finalOptions) as Observable<
        RequestReturnType<O, TRes>
      >;
    }

    //! ================================================= HEAD
    /**
     * Constructs a HEAD request and returns an Observable of the response.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @returns An Observable of the response type based on the options.
     */
    head<TRes = Object, O extends RequestOptions = {}>(
      url: string,
      options?: O,
    ): Observable<RequestReturnType<O, TRes>> {
      const finalUrl = getUrl(apiUrl, url);
      const finalOptions = getOpts(defaultOptions, options);
      return http.head(finalUrl, finalOptions) as Observable<
        RequestReturnType<O, TRes>
      >;
    }

    //! ================================================= JSONP
    /**
     * Constructs a `JSONP` request for the given URL and name of the callback parameter.
     *
     * @param url The resource URL.
     * @param callbackParam The callback function name.
     *
     * You must install a suitable interceptor, such as one provided by `HttpClientJsonpModule`.
     * If no such interceptor is reached,
     * then the `JSONP` request can be rejected by the configured backend.
     *
     * @return An `Observable` of the response object, with response body in the requested type.
     */
    jsonp<TRes = Object>(url: string, callbackParam: string): Observable<TRes> {
      url = getUrl(apiUrl, url!);
      return http.jsonp(url, callbackParam) as Observable<TRes>;
    }

    //! ================================================= OPTIONS
    /**
     * Constructs an OPTIONS request and returns an Observable of the response.
     *
     * @param url The endpoint URL.
     * @param options The HTTP options to send with the request.
     * @returns An Observable of the response type based on the options.
     */
    options<TRes = Object, O extends RequestOptions = {}>(
      url: string,
      options?: O,
    ): Observable<RequestReturnType<O, TRes>> {
      const finalUrl = getUrl(apiUrl, url);
      const finalOptions = getOpts(defaultOptions, options);
      return http.options(finalUrl, finalOptions) as Observable<
        RequestReturnType<O, TRes>
      >;
    }

    //! ================================================= PATCH
    /**
     * Constructs a PATCH request and returns an Observable of the response.
     *
     * @param url The endpoint URL.
     * @param body The resources to edit.
     * @param options The HTTP options to send with the request.
     * @returns An Observable of the response type based on the options.
     */
    patch<TBody = any, TRes = Object, O extends RequestOptions = {}>(
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

    //! ================================================= POST
    /**
     * Constructs a POST request and returns an Observable of the response.
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     * @param options The HTTP options to send with the request.
     * @returns An Observable of the response type based on the options.
     */
    post<TBody = any, TRes = Object, O extends RequestOptions = {}>(
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

    //! ================================================= PUT
    /**
     * Constructs a PUT request and returns an Observable of the response.
     *
     * @param url The endpoint URL.
     * @param body The resources to add/update.
     * @param options The HTTP options to send with the request.
     * @returns An Observable of the response type based on the options.
     */
    put<TBody = any, TRes = Object, O extends RequestOptions = {}>(
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
