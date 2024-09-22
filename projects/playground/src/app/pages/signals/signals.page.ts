import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  persistentSignal,
  PersistentStorageMethod,
} from '../../../../../devkit/src/public-api';

@Component({
  selector: 'signals-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signals.page.html',
  styleUrl: './signals.page.scss',
})
export class SignalsPage {
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
}
