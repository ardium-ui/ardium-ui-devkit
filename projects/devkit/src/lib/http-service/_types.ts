import { HttpContext, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

export interface RequestOptions extends DefaultRequestOptions {
  observe?: 'body' | 'events' | 'response';
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
}

export interface DefaultRequestOptions {
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