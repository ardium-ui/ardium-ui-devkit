import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  persistentSignal,
  PersistentStorageMethod,
  queryParamSignal,
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

  // Query signals examples
  readonly simpleQueryParam = queryParamSignal('default', 'simple-param');
  readonly numberQueryParam = queryParamSignal<number>(0, {
    paramName: 'number-param',
    serialize: (value) => value?.toString() ?? null,
    deserialize: (value) => parseInt(value ?? '0'),
  });
}
