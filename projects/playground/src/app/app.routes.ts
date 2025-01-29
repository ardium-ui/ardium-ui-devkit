import { Routes } from '@angular/router';
import { FileSystemPage } from './pages/file-system/file-system.page';
import { HoldPage } from './pages/hold/hold.page';
import { HomePage } from './pages/home/home.page';
import { HttpServicePage } from './pages/http-service/http-service.page';
import { InfiniteScrollHostPage } from './pages/infinite-scroll-host/infinite-scroll-host.page';
import { InfiniteScrollPage } from './pages/infinite-scroll/infinite-scroll.page';
import { SignalsPage } from './pages/signals/signals.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'infinite-scroll', component: InfiniteScrollPage },
  { path: 'infinite-scroll-host', component: InfiniteScrollHostPage },
  { path: 'signals', component: SignalsPage },
  { path: 'file-system', component: FileSystemPage },
  { path: 'hold', component: HoldPage },
  { path: 'http-service', component: HttpServicePage },
];
