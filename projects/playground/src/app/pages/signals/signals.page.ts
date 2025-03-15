import { Component, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debouncedSignal } from '../../../../../devkit/src/lib/signals/debounced/debounced';
import {
    persistentSignal,
    PersistentStorageMethod,
    queryParamSignal,
    throttledSignal,
} from '../../../../../devkit/src/public-api';

@Component({
  selector: 'signals-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signals.page.html',
  styleUrl: './signals.page.scss',
})
export class SignalsPage {
  // Persistent signals examples
  readonly favoriteAnimalCookie = persistentSignal('initial', {
    name: 'favorite-animal',
    method: PersistentStorageMethod.Cookies,
  });
  readonly favoriteAnimalSession = persistentSignal('initial', {
    name: 'favorite-animal',
    method: PersistentStorageMethod.SessionStorage,
  });
  readonly favoriteAnimalLocal = persistentSignal('initial', {
    name: 'favorite-animal',
    method: PersistentStorageMethod.LocalStorage,
  });
  readonly animalCount = persistentSignal(3, {
    name: 'animal-count',
    method: PersistentStorageMethod.LocalStorage,
    serialize: (value) => (value === null ? null : value.toString()),
    deserialize: (value) => parseInt(value),
  });

  // Query signals examples
  readonly simpleQueryParam = queryParamSignal('default', 'simple-param');
  readonly numberQueryParam = queryParamSignal<number>(0, {
    paramName: 'number-param',
    serialize: (value) => value?.toString() ?? null,
    deserialize: (value) => parseInt(value ?? '0'),
  });

  constructor() {
    effect(() => {
      console.log('simpleThrottled:', this.simpleThrottled());
    });
    effect(() => {
      console.log('simpleDebounced:', this.simpleDebounced());
    });
  }

  // Throttled signal example
  readonly simpleThrottled = throttledSignal('initial', 1000);

  // Debounced signal example
  readonly simpleDebounced = debouncedSignal('initial', 1000);
}
