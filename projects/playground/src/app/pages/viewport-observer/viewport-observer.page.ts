import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  ArdiumViewportObserverService,
  ArdViewportObserverRef,
} from '../../../../../devkit/src/public-api';

@Component({
  selector: 'viewport-observer-page',
  standalone: true,
  imports: [],
  providers: [],
  templateUrl: './viewport-observer.page.html',
  styleUrl: './viewport-observer.page.scss',
})
export class ViewportObserverPage implements AfterViewInit {
  readonly vss = inject(ArdiumViewportObserverService);

  readonly itemByElement = signal<ArdViewportObserverRef | null>(null);
  readonly itemById = signal<ArdViewportObserverRef | null>(null);
  readonly itemByQuery = signal<ArdViewportObserverRef | null>(null);

  readonly item1 = viewChild<ElementRef<HTMLElement>>('item');

  ngAfterViewInit(): void {
    this.itemByElement.set(this.vss.observeElement(this.item1()!));
    this.itemById.set(this.vss.observeById('item'));
    this.itemByQuery.set(this.vss.observeByQuery('[data-item]'));
  }

  constructor() {
    effect(() => {
      console.table({
        byEl: {
          top: this.itemByElement()?.position()?.top,
          bottom: this.itemByElement()?.position()?.bottom,
          relation: this.itemByElement()?.viewportRelation(),
          inside: this.itemByElement()?.isInViewport(),
        },
        byId: {
          top: this.itemById()?.position()?.top,
          bottom: this.itemById()?.position()?.bottom,
          relation: this.itemById()?.viewportRelation(),
          inside: this.itemById()?.isInViewport(),
        },
        byQuery: {
          top: this.itemByQuery()?.position()?.top,
          bottom: this.itemByQuery()?.position()?.bottom,
          relation: this.itemByQuery()?.viewportRelation(),
          inside: this.itemByQuery()?.isInViewport(),
        },
      });
    });
  }
}
