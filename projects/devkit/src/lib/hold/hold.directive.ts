import {
  Directive,
  effect,
  HostListener,
  inject,
  input,
  output,
} from '@angular/core';
import { coerceBooleanProperty } from '../coercion/boolean';
import { coerceNumberProperty } from '../coercion/number';
import { ARD_HOLD_DEFAULTS } from './hold.defaults';

/**
 * Detects when the user clicks-and-holds a given element.
 */
@Directive({ selector: '[ardHold]' })
export class ArdiumHoldDirective {
  protected readonly _DEFAULTS = inject(ARD_HOLD_DEFAULTS);

  public readonly ardHold = output<void>();

  readonly disabled = input<boolean, any>(false, {
    transform: (v) => coerceBooleanProperty(v),
  });

  constructor() {
    effect(() => {
      if (this.disabled()) {
        this._clear();
      }
    });
  }

  readonly ardHoldDelay = input<number, any>(this._DEFAULTS.delay, {
    transform: (v) => coerceNumberProperty(v, this._DEFAULTS.delay),
  });
  readonly ardHoldRepeat = input<number, any>(this._DEFAULTS.repeat, {
    transform: (v) => coerceNumberProperty(v, this._DEFAULTS.repeat),
  });

  readonly ardAllowSpaceKey = input<boolean, any>(
    this._DEFAULTS.allowSpaceKey,
    {
      transform: (v) => coerceBooleanProperty(v),
    },
  );
  readonly ardAllowEnterKey = input<boolean, any>(
    this._DEFAULTS.allowEnterKey,
    {
      transform: (v) => coerceBooleanProperty(v),
    },
  );

  private interval: any = null;
  private timeout: any = null;

  @HostListener('mousedown')
  @HostListener('touchstart')
  public onMouseDown(): void {
    console.log(this.ardHoldDelay(), this.ardHoldRepeat());
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.interval = setInterval(() => {
        this.ardHold.emit();
      }, this.ardHoldRepeat());
    }, this.ardHoldDelay());
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
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
    if (this.ardAllowEnterKey() && event.code == 'Enter') {
      event.preventDefault();
    }
    if (this.isKeyDown) return;
    if (
      (this.ardAllowSpaceKey() && event.code == 'Space') ||
      (this.ardAllowEnterKey() && event.code == 'Enter')
    ) {
      this.onMouseDown();
      this.isKeyDown = true;
    }
  }
  @HostListener('keyup', ['$event'])
  public onKeyUp(event: KeyboardEvent): void {
    if (
      (this.ardAllowSpaceKey() && event.code == 'Space') ||
      (this.ardAllowEnterKey() && event.code == 'Enter')
    ) {
      this.onMouseUp();
      this.isKeyDown = false;
    }
  }
}
