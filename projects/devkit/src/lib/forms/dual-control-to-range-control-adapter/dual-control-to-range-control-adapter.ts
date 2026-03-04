import { inject, Injector } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { isEqual } from 'lodash';
import { Subscription } from 'rxjs';
import { TrackedFormControl, trackFormControl } from '../track-form-control';

export interface Range<T, ToType = T> {
  from: T;
  to: ToType;
}

export interface DualControlToRangeControlAdapater<T, ToType = T> {
  readonly control: FormControl<Range<T, ToType>>;

  destroy(): void;
}

class _DualControlToRangeControlAdapater<T, ToType = T>
  implements DualControlToRangeControlAdapater<T, ToType>
{
  readonly control!: FormControl<Range<T, ToType>>;

  private readonly _injector = inject(Injector);

  constructor(fromControl: FormControl<T>, toControl: FormControl<ToType>) {
    this.control = new FormControl(
      { from: fromControl.getRawValue(), to: toControl.getRawValue() },
      { nonNullable: true },
    );
    const fromTracker = trackFormControl<T>(fromControl);
    const toTracker = trackFormControl<ToType>(toControl);
    const adaptedTracker = trackFormControl<Range<T, ToType>>(this.control);
    this._trackers.push(fromTracker, toTracker, adaptedTracker);

    // value
    this._subs.push(
      toObservable(fromTracker.value, { injector: this._injector }).subscribe(
        (v) => {
          if (!isEqual(v, adaptedTracker.value().from)) {
            this.control.setValue({ from: v, to: this.control.value.to });
          }
        },
      ),
    );
    this._subs.push(
      toObservable(toTracker.value, { injector: this._injector }).subscribe(
        (v) => {
          if (!isEqual(v, adaptedTracker.value().to)) {
            this.control.setValue({ from: this.control.value.from, to: v });
          }
        },
      ),
    );

    // touched
    this._subs.push(
      toObservable(fromTracker.touched, { injector: this._injector }).subscribe(
        (v) =>
          v
            ? !this.control.touched && this.control.markAsTouched()
            : this.control.touched && this.control.markAsUntouched(),
      ),
    );
    this._subs.push(
      toObservable(toTracker.touched, { injector: this._injector }).subscribe(
        (v) =>
          v
            ? !this.control.touched && this.control.markAsTouched()
            : this.control.touched && this.control.markAsUntouched(),
      ),
    );

    // pristine
    this._subs.push(
      toObservable(fromTracker.pristine, {
        injector: this._injector,
      }).subscribe((v) =>
        v
          ? !this.control.pristine && this.control.markAsPristine()
          : this.control.pristine && this.control.markAsDirty(),
      ),
    );
    this._subs.push(
      toObservable(toTracker.pristine, {
        injector: this._injector,
      }).subscribe((v) =>
        v
          ? !this.control.pristine && this.control.markAsPristine()
          : this.control.pristine && this.control.markAsDirty(),
      ),
    );

    // disabled
    this._subs.push(
      toObservable(fromTracker.disabled, {
        injector: this._injector,
      }).subscribe((v) =>
        v
          ? !this.control.disabled && this.control.disable()
          : this.control.disabled && this.control.enable(),
      ),
    );
    this._subs.push(
      toObservable(toTracker.disabled, {
        injector: this._injector,
      }).subscribe((v) =>
        v
          ? !this.control.disabled && this.control.disable()
          : this.control.disabled && this.control.enable(),
      ),
    );

    // reverse updating
    this._subs.push(
      toObservable(adaptedTracker.value, {
        injector: this._injector,
      }).subscribe((v) => {
        const { from, to } = v;
        if (!isEqual(fromControl.getRawValue(), from)) {
          fromControl.setValue(from);
        }
        if (!isEqual(toControl.getRawValue(), to)) {
          toControl.setValue(to);
        }
      }),
    );
    this._subs.push(
      toObservable(adaptedTracker.touched, {
        injector: this._injector,
      }).subscribe((v) => {
        if (!isEqual(fromControl.touched, v)) {
          v ? fromControl.markAsTouched() : fromControl.markAsUntouched();
        }
        if (!isEqual(toControl.touched, v)) {
          v ? toControl.markAsTouched() : toControl.markAsUntouched();
        }
      }),
    );
    this._subs.push(
      toObservable(adaptedTracker.pristine, {
        injector: this._injector,
      }).subscribe((v) => {
        if (!isEqual(fromControl.pristine, v)) {
          v ? fromControl.markAsPristine() : fromControl.markAsDirty();
        }
        if (!isEqual(toControl.pristine, v)) {
          v ? toControl.markAsPristine() : toControl.markAsDirty();
        }
      }),
    );
    this._subs.push(
      toObservable(adaptedTracker.disabled, {
        injector: this._injector,
      }).subscribe((v) => {
        if (!isEqual(fromControl.disabled, v)) {
          v ? fromControl.disable() : fromControl.enable();
        }
        if (!isEqual(toControl.disabled, v)) {
          v ? toControl.disable() : toControl.enable();
        }
      }),
    );
  }

  private _trackers: TrackedFormControl<any>[] = [];
  private _subs: Subscription[] = [];
  destroy(): void {
    this._trackers.forEach((t) => t.destroy());
    this._subs.forEach((s) => s.unsubscribe());
  }
}

export function dualControlToRangeControlAdapter<T, ToType = T>(
  fromControl: FormControl<T>,
  toControl: FormControl<ToType>,
): DualControlToRangeControlAdapater<T, ToType> {
  return new _DualControlToRangeControlAdapater<T, ToType>(
    fromControl,
    toControl,
  );
}
