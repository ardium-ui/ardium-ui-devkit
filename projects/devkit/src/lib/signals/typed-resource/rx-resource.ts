import { rxResource, RxResourceOptions } from '@angular/core/rxjs-interop';
import { TypedResourceRef } from './_common';

export function typedRxResource<TValue, TError, TReq = unknown>(
  options: RxResourceOptions<TValue | TError, TReq>,
): TypedResourceRef<TValue, TError> {
  return rxResource(options);
}
