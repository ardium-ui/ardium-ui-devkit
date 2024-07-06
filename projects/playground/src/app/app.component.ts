import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArdiumInfiniteScrollDirective } from '@ardium-ui/devkit';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ArdiumInfiniteScrollDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly isPart2Hidden = signal<boolean>(true);

  readonly isInfScrollActive = signal<boolean>(true);

  onThresholdReach() {
    setTimeout(() => {
      this.isPart2Hidden.set(false);
      this.isInfScrollActive.set(true);
    }, 0);
  }
}
