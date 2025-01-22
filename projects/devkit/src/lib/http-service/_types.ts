import { HttpContext, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

export interface RequestOptions {
  body?: any;
  headers?: HttpHeaders | { [header: string]: string | string[] };
  context?: HttpContext;
  observe?: 'body' | 'events' | 'response';
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
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
  transferCache?: { includeHeaders?: string[] } | boolean;
}

export type RequestReturnType<
  O extends RequestOptions,
  TRes = any,
> = O['observe'] extends 'body'
  ? O['responseType'] extends 'arraybuffer'
    ? ArrayBuffer
    : O['responseType'] extends 'blob'
      ? Blob
      : O['responseType'] extends 'text'
        ? string
        : TRes // Defaults to JSON
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
      : never;
