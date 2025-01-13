import { resource, ResourceOptions } from '@angular/core';
import { TypedResourceRef } from './_common';

export function typedResource<TValue, TError, TReq>(
  options: ResourceOptions<TValue, TReq>,
): TypedResourceRef<TValue, TError> {
  return resource(options);
}
