import { HttpClient, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { RequestOptions, RequestReturnType } from "./_types";

export function createHttpService(apiUrl: string, defaultOptions: RequestOptions) {
  return class {
    private readonly _http = inject(HttpClient);

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
        const finalUrl = this._getUrl(url!);
        const finalOptions = this._getOpts(options);
        return this._http.request(
          methodOrReq,
          finalUrl,
          finalOptions,
        ) as Observable<RequestReturnType<O, TRes>>;
      }
      return this._http.request(methodOrReq) as Observable<
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
      const finalUrl = this._getUrl(url);
      const finalOptions = this._getOpts(options);
      return this._http.delete(finalUrl, finalOptions) as Observable<
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
      const finalUrl = this._getUrl(url);
      const finalOptions = this._getOpts(options);
      return this._http.get(finalUrl, finalOptions) as Observable<
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
      const finalUrl = this._getUrl(url);
      const finalOptions = this._getOpts(options);
      return this._http.head(finalUrl, finalOptions) as Observable<
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
      url = this._getUrl(url!);
      return this._http.jsonp(url, callbackParam) as Observable<TRes>;
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
      const finalUrl = this._getUrl(url);
      const finalOptions = this._getOpts(options);
      return this._http.options(finalUrl, finalOptions) as Observable<
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
      const finalUrl = this._getUrl(url);
      const finalOptions = this._getOpts(options);
      return this._http.patch(finalUrl, body, finalOptions) as Observable<
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
      const finalUrl = this._getUrl(url);
      const finalOptions = this._getOpts(options);
      return this._http.post(finalUrl, body, finalOptions) as Observable<
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
      const finalUrl = this._getUrl(url);
      const finalOptions = this._getOpts(options);
      return this._http.put(finalUrl, body, finalOptions) as Observable<
        RequestReturnType<O, TRes>
      >;
    }

    private _getUrl(url: string): string {
      return apiUrl + url.replace(/^\//, '');
    }
    private _getOpts<O extends RequestOptions>(options?: O): any {
      return { ...defaultOptions, ...(options ?? {}) };
    }
  };
}