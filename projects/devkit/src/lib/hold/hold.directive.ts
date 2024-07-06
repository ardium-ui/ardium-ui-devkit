import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { coerceBooleanProperty } from '../coercion/boolean';

/**
  Detects when the user clicks-and-holds a given element.
*/
@Directive({ selector: '[ardHold]' })
export class HoldDirective {
  @Output('ardHold')
  public holdEvent = new EventEmitter<undefined>();

  @Input() set disabled(v: any) {
    this._clear();
  }
  @Input() set readonly(v: any) {
    this._clear();
  }

  @Input('ardHoldDelay') holdDelay: number = 500;
  @Input('ardHoldRepeat') holdRepeat: number = 1000 / 15;

  private _allowSpaceKey: boolean = false;
  @Input('ardHoldSpaceKey')
  get allowSpaceKey(): boolean {
    return this._allowSpaceKey;
  }
  set allowSpaceKey(v: any) {
    this._allowSpaceKey = coerceBooleanProperty(v);
  }

  private _allowEnterKey?: boolean = undefined;
  @Input('ardHoldEnterKey')
  get allowEnterKey(): boolean {
    return this._allowEnterKey ?? this.allowSpaceKey;
  }
  set allowEnterKey(v: any) {
    this._allowEnterKey = coerceBooleanProperty(v);
  }

  interval: any = null;
  timeout: any = null;

  @HostListener('mousedown')
  @HostListener('touchstart')
  public onMouseDown(): void {
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.interval = setInterval(() => {
        this.holdEvent.next(undefined);
      }, this.holdRepeat);
    }, this.holdDelay);
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
    if (this.allowEnterKey && event.code == 'Enter') event.preventDefault();
    if (this.isKeyDown) return;
    if (
      (this.allowSpaceKey && event.code == 'Space') ||
      (this.allowEnterKey && event.code == 'Enter')
    ) {
      this.onMouseDown();
      this.isKeyDown = true;
    }
  }
  @HostListener('keyup', ['$event'])
  public onKeyUp(event: KeyboardEvent): void {
    this.isKeyDown = false;
    if (
      (this.allowSpaceKey && event.code == 'Space') ||
      (this.allowEnterKey && event.code == 'Enter')
    ) {
      this.onMouseUp();
    }
  }
}
