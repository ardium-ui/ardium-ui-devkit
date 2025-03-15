import { ElementRef } from '@angular/core';

export class EventRelativePos<T extends HTMLElement> {
  readonly overflowsTop!: boolean;
  readonly overflowsRight!: boolean;
  readonly overflowsBottom!: boolean;
  readonly overflowsLeft!: boolean;
  readonly overflows!: boolean;

  constructor(
    public readonly target: T,
    public readonly top: number,
    public readonly right: number,
    public readonly bottom: number,
    public readonly left: number,
  ) {
    this.overflowsTop = top < 0;
    this.overflowsRight = right < 0;
    this.overflowsBottom = bottom < 0;
    this.overflowsLeft = left < 0;
    this.overflows =
      this.overflowsTop ||
      this.overflowsRight ||
      this.overflowsBottom ||
      this.overflowsLeft;
  }

  valueOf() {
    return {
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      left: this.left,
    };
  }
  toJSON(): string {
    return JSON.stringify(this.valueOf());
  }
  toString(): string {
    return this.toJSON();
  }

  static fromEvent<T extends HTMLElement>(
    event: MouseEvent | TouchEvent | Touch,
    el: T | ElementRef<T>,
  ): EventRelativePos<T> {
    return getEventRelativePos(event, el);
  }
}

function _isTouchEvent(v: any): v is TouchEvent {
  return typeof v === 'object' && 'touches' in v;
}

export function getEventRelativePos<T extends HTMLElement>(
  event: MouseEvent | TouchEvent | Touch,
  el: T | ElementRef<T>,
): EventRelativePos<T> {
  //convert ElementRef
  if (el instanceof ElementRef) el = el.nativeElement;

  //convert TouchEvent
  if (_isTouchEvent(event)) {
    const firstTouch = event.touches.item(0);
    if (!firstTouch)
      throw new Error(
        'DKT-FT9000: Cannot read event position. The TouchEvent has no Touch instances.',
      );
    event = firstTouch;
  }

  //calculate
  const elRect = el.getBoundingClientRect();

  const eventX = event.clientX;
  const eventY = event.clientY;

  return new EventRelativePos<T>(
    el,
    eventY - elRect.top, //top
    elRect.right - eventX, //right
    elRect.bottom - eventY, //bottom
    eventX - elRect.left, //left
  );
}
