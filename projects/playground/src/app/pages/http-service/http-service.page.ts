import { JsonPipe } from '@angular/common';
import { Component, computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { createHttpService } from '../../../../../devkit/src/public-api';

@Injectable({ providedIn: 'root' })
export class MyHttpService extends createHttpService(
  'https://jsonplaceholder.typicode.com/',
) {}

@Component({
  selector: 'http-service-page',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  providers: [MyHttpService],
  templateUrl: './http-service.page.html',
  styleUrl: './http-service.page.scss',
})
export class HttpServicePage {
  private readonly http = inject(MyHttpService);

  readonly id = signal<string>('1');

  readonly users = rxResource({
    request: () => ({ id: this.id() }),
    loader: ({ request }) => this.http.get(`/users/${request.id}`),
  });

  readonly error = computed(() => (this.users.error() as any).message);

  readonly users2 = rxResource({
    request: () => ({ id: this.id() }),
    loader: ({ request }) => this.http.get(['users', request.id]),
  });

  readonly error2 = computed(() => (this.users.error() as any).message);
}
