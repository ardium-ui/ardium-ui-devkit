import { Routes } from '@angular/router';
import { FileSystemPage } from './pages/file-system/file-system.page';
import { InfiniteScrollPage } from './pages/infinite-scroll/infinite-scroll.page';
import { SignalsPage } from './pages/signals/signals.page';

export const routes: Routes = [
  { path: 'infinite-scroll', component: InfiniteScrollPage },
  { path: 'signals', component: SignalsPage },
  { path: 'file-system', component: FileSystemPage },
];
