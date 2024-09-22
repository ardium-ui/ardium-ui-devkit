import { Routes } from '@angular/router';
import { InfiniteScrollPage } from './pages/infinite-scroll/infinite-scroll.page';
import { SignalsPage } from './pages/signals/signals.page';

export const routes: Routes = [
  { path: 'infinite-scroll', component: InfiniteScrollPage },
  { path: 'signals', component: SignalsPage },
];
