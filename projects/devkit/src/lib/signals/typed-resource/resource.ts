import { resource, ResourceOptions } from '@angular/core';
import { TypedResourceRef } from './_common';

export function typedResource<TValue, TError, TReq = unknown>(
  options: ResourceOptions<TValue | TError, TReq>,
): TypedResourceRef<TValue, TError> {
  return resource(options);
}
