import { Component, computed, signal } from '@angular/core';
import { ArdiumInfiniteScrollModule } from '../../../../../devkit/src/public-api';

@Component({
  selector: 'infinite-scroll-page',
  standalone: true,
  imports: [ArdiumInfiniteScrollModule],
  templateUrl: './infinite-scroll.page.html',
  styleUrl: './infinite-scroll.page.scss',
})
export class InfiniteScrollPage {
  private readonly currentPage = signal<number>(1);
  readonly items = computed<number[]>(() =>
    new Array(this.currentPage() * 5).fill(0).map((_, i) => i),
  );

  readonly isInfScrollActive = signal<boolean>(true);

  onThresholdReach() {
    setTimeout(() => {
      this.currentPage.update((v) => v + 1);
      this.isInfScrollActive.set(true);
    }, 0);
  }
}
