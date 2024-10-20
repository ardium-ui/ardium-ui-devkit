import {
  computed,
  Directive,
  effect,
  HostListener,
  input,
  output,
} from '@angular/core';
import { coerceBooleanProperty } from '../coercion/boolean';
import { coerceNumberProperty } from '../coercion/number';

/**
  Detects when the user clicks-and-holds a given element.
*/
@Directive({ selector: '[ardHold]' })
export class ArdiumHoldDirective {
  public readonly ardHold = output<void>();

  readonly disabled = input<boolean, any>(false, {
    transform: (v) => coerceBooleanProperty(v),
  });
  readonly readonly = input<boolean, any>(false, {
    transform: (v) => coerceBooleanProperty(v),
  });

  constructor() {
    effect(() => {
      if (this.disabled() || this.readonly()) {
        this._clear();
      }
    });
  }

  readonly ardHoldDelay = input<number, any>(500, {
    transform: (v) => coerceNumberProperty(v, 500),
  });
  readonly ardHoldRepeat = input<number, any>(1000 / 15, {
    transform: (v) => coerceNumberProperty(v, 1000 / 15),
  });

  readonly ardAllowSpaceKey = input<boolean, any>(false, {
    transform: (v) => coerceBooleanProperty(v),
  });
  readonly ardAllowEnterKey = input<boolean, any>(false, {
    transform: (v) => coerceBooleanProperty(v),
  });

  private readonly _shouldExecuteOnEnter = computed(
    () => this.ardAllowEnterKey() || this.ardAllowSpaceKey(),
  );

  private interval: any = null;
  private timeout: any = null;

  @HostListener('mousedown')
  @HostListener('touchstart')
  public onMouseDown(): void {
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.interval = setInterval(() => {
        this.ardHold.emit();
      }, this.ardHoldRepeat());
    }, this.ardHoldDelay());
  }

  @HostListener('mouseup')
  @HostListener('touchend')
  public onMouseUp(): void {
    this._clear();
  }
  private _clear(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
      return;
    }
    if (!this.interval) return;

    clearInterval(this.interval);
    this.interval = null;
  }

  isKeyDown: boolean = false;

  @HostListener('keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent): void {
    if (this._shouldExecuteOnEnter() && event.code == 'Enter') {
      event.preventDefault();
    }
    if (this.isKeyDown) return;
    if (
      (this.ardAllowSpaceKey() && event.code == 'Space') ||
      (this._shouldExecuteOnEnter() && event.code == 'Enter')
    ) {
      this.onMouseDown();
      this.isKeyDown = true;
    }
  }
  @HostListener('keyup', ['$event'])
  public onKeyUp(event: KeyboardEvent): void {
    this.isKeyDown = false;
    if (
      (this.ardAllowSpaceKey() && event.code == 'Space') ||
      (this._shouldExecuteOnEnter() && event.code == 'Enter')
    ) {
      this.onMouseUp();
    }
  }
}
