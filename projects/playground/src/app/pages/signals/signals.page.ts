import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debouncedSignal } from '../../../../../devkit/src/lib/signals/debounced/debounced-signal';
import {
  queryParamSignal,
  throttledSignal
} from '../../../../../devkit/src/public-api';

@Component({
  selector: 'signals-page',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  templateUrl: './signals.page.html',
  styleUrl: './signals.page.scss',
})
export class SignalsPage {
  private readonly router = inject(Router);

  readonly TODAY = new Date();

  // // Persistent signals examples
  // readonly favoriteAnimalCookie = persistentSignal('initial', {
  //   name: 'favorite-animal',
  //   method: PersistentStorageMethod.Cookies,
  // });
  // readonly favoriteAnimalSession = persistentSignal('initial', {
  //   name: 'favorite-animal',
  //   method: PersistentStorageMethod.SessionStorage,
  // });
  // readonly favoriteAnimalLocal = persistentSignal('initial', {
  //   name: 'favorite-animal',
  //   method: PersistentStorageMethod.LocalStorage,
  // });
  // readonly animalCount = persistentSignal(3, {
  //   name: 'animal-count',
  //   method: PersistentStorageMethod.LocalStorage,
  //   serialize: (value) => (value === null ? null : value.toString()),
  //   deserialize: (value) => parseInt(value),
  // });
  // readonly animalCountReadonly = this.animalCount.asReadonly();

  // // Query signals examples
  // readonly simpleQueryParam = queryParamSignal('default', 'simple-param');
  // readonly numberQueryParam = queryParamSignal<number>(null, {
  //   paramName: 'number-param',
  //   serialize: (value) => value?.toString() ?? null,
  //   deserialize: (value) => parseInt(value ?? '0'),
  // });
  // readonly numberQueryParamReadonly = this.numberQueryParam.asReadonly();

  readonly dateQueryParamNonNullable = queryParamSignal<Date[]>([], {
    paramName: 'dateQueryParamNonNullable',
    serialize: (v) =>
      v !== null && v.length > 0
        ? v.map((d) => d.toISOString().substring(0, 10)).join(',')
        : null,
    deserialize: (v) => {
      const dates = v
        .trim()
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => new Date(s))
        .filter((d) => !Number.isNaN(d.getTime()));
      return dates.length > 0 ? dates : null;
    },
    nonNullable: true,
  });

  updateDateParam(value: Date[] | null) {
    this.router.navigate([], {
      queryParams: {
        dateQueryParamNonNullable: value
          ? value.map((d) => d.toISOString().substring(0, 10)).join(',')
          : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  updateQueryParam(value: string | null) {
    this.router.navigate([], {
      queryParams: { 'simple-param': value },
      queryParamsHandling: 'merge',
    });
  }

  constructor() {
    // effect(() => {
    //   console.log('simpleThrottled:', this.simpleThrottled());
    // });
    // effect(() => {
    //   console.log('simpleDebounced:', this.simpleDebounced());
    // });
  }

  // Throttled signal example
  readonly simpleThrottled = throttledSignal('initial', 1000);

  // Debounced signal example
  readonly simpleDebounced = debouncedSignal('initial', 1000);
}
