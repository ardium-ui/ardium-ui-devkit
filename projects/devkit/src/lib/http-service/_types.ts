import { HttpContext, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

export type ObjectHttpParams = Record<string, string | number | boolean | null | undefined | ReadonlyArray<string | number | boolean>>;

export interface RequestOptions<TParams extends ObjectHttpParams = ObjectHttpParams> extends DefaultRequestOptions<TParams> {
  observe?: 'body' | 'events' | 'response';
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
}

export interface DefaultRequestOptions<TParams extends ObjectHttpParams = ObjectHttpParams> {
  body?: any;
  headers?: HttpHeaders | { [header: string]: string | string[] };
  context?: HttpContext;
  params?:
    | HttpParams
    | TParams;
  reportProgress?: boolean;
  withCredentials?: boolean;
  transferCache?: { includeHeaders?: string[] } | boolean;
}

export type RequestReturnType<
  O extends RequestOptions,
  TRes,
> = O['observe'] extends 'body'
  ? O['responseType'] extends 'arraybuffer'
    ? ArrayBuffer
    : O['responseType'] extends 'blob'
      ? Blob
      : O['responseType'] extends 'text'
        ? string
        : TRes
  : O['observe'] extends 'response'
    ? HttpResponse<
        O['responseType'] extends 'arraybuffer'
          ? ArrayBuffer
          : O['responseType'] extends 'blob'
            ? Blob
            : O['responseType'] extends 'text'
              ? string
              : TRes
      >
    : O['observe'] extends 'events'
      ? HttpEvent<
          O['responseType'] extends 'arraybuffer'
            ? ArrayBuffer
            : O['responseType'] extends 'blob'
              ? Blob
              : O['responseType'] extends 'text'
                ? string
                : TRes
        >
      : TRes;