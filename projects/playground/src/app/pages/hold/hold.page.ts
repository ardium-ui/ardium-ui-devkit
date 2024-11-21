import { Component, signal } from '@angular/core';
import { ARD_HOLD_DEFAULTS } from '../../../../../devkit/src/lib/hold/hold.defaults';
import { ArdiumHoldModule } from '../../../../../devkit/src/public-api';

@Component({
  selector: 'hold-page',
  standalone: true,
  imports: [ArdiumHoldModule],
  providers: [{ provide: ARD_HOLD_DEFAULTS, useValue: { delay: 1000 } }],
  templateUrl: './hold.page.html',
  styleUrl: './hold.page.scss',
})
export class HoldPage {
  readonly events = signal<number>(0);
  
  onButtonHold(): void {
    this.events.update(v => v + 1);
  }
}
