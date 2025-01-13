import { rxResource, RxResourceOptions } from '@angular/core/rxjs-interop';
import { TypedResourceRef } from './_common';

export function typedRxResource<TValue, TError, TReq>(
  options: RxResourceOptions<TValue, TReq>,
): TypedResourceRef<TValue, TError> {
  return rxResource(options);
}
