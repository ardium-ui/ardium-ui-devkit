import { ElementRef } from '@angular/core';

export function getDomContentRect(el: HTMLElement): DOMRect;
export function getDomContentRect(el: ElementRef<HTMLElement>): DOMRect;
export function getDomContentRect(
  el: HTMLElement | ElementRef<HTMLElement>,
): DOMRect;
export function getDomContentRect(
  el: HTMLElement | ElementRef<HTMLElement>,
): DOMRect {
  if (el instanceof ElementRef) el = el.nativeElement;

  const elRect = el.getBoundingClientRect();
  const [topPadd, rightPadd, bottomPadd, leftPadd] = getFourWayValue(
    el,
    'padding',
  );
  const [topBorder, rightBorder, bottomBorder, leftBorder] = getFourWayValue(
    el,
    'border-width',
  );

  return new DOMRect(
    elRect.x + leftPadd + leftBorder,
    elRect.y + topPadd + topBorder,
    elRect.width - leftPadd - rightPadd - leftBorder - rightBorder,
    elRect.height - topPadd - bottomPadd - topBorder - bottomBorder,
  );
}

export function getDomPaddingRect(el: HTMLElement): DOMRect;
export function getDomPaddingRect(el: ElementRef<HTMLElement>): DOMRect;
export function getDomPaddingRect(
  el: HTMLElement | ElementRef<HTMLElement>,
): DOMRect;
export function getDomPaddingRect(
  el: HTMLElement | ElementRef<HTMLElement>,
): DOMRect {
  if (el instanceof ElementRef) el = el.nativeElement;

  const elRect = el.getBoundingClientRect();
  const [topBorder, rightBorder, bottomBorder, leftBorder] = getFourWayValue(
    el,
    'border-width',
  );

  return new DOMRect(
    elRect.x + leftBorder,
    elRect.y + topBorder,
    elRect.width - leftBorder - rightBorder,
    elRect.height - topBorder - bottomBorder,
  );
}

function getFourWayValue(
  el: HTMLElement,
  v: string,
): [number, number, number, number] {
  const elValues = window.getComputedStyle(el).getPropertyValue(v);
  const values = elValues.split(' ').map((v) => (v ? parseFloat(v) : null));
  const topValue = values[0] ?? 0;
  const rightValue = values[1] ?? topValue;
  const bottomValue = values[2] ?? topValue;
  const leftValue = values[3] ?? rightValue ?? topValue;

  return [topValue, rightValue, bottomValue, leftValue];
}
