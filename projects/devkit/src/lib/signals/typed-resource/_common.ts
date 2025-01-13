import { ResourceRef, Signal } from "@angular/core";

export interface TypedResourceRef<TValue, TError> extends Omit<ResourceRef<TValue>, "error"> {
  readonly error: Signal<TError | unknown>;
}
