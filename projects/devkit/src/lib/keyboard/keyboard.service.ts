import {
  computed,
  Injectable,
  OnDestroy,
  Renderer2,
  signal,
} from '@angular/core';
import { ɵDomRendererFactory2 } from '@angular/platform-browser';
import { filter, Observable, Subject } from 'rxjs';
import {
  KeyboardKey,
  KeyboardKeyState,
  KeyboardShortcut,
} from './keyboard.types';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService implements OnDestroy {
  private renderer!: Renderer2;
  private removeListenFuncKeydown!: Function;
  private removeListenFuncKeyup!: Function;
  private removeListenFuncWindowblur!: Function;
  constructor(rendererFactory: ɵDomRendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    //listen to events
    this.removeListenFuncKeydown = this.renderer.listen(
      'document',
      'keydown',
      (e) => this._onKeydown(e),
    );
    this.removeListenFuncKeyup = this.renderer.listen(
      'document',
      'keyup',
      (e) => this._onKeyup(e),
    );
    this.removeListenFuncWindowblur = this.renderer.listen(
      'window',
      'blur',
      () => this._resetAllKeys(),
    );
  }

  ngOnDestroy(): void {
    //destroy event listeners
    this.removeListenFuncKeydown();
    this.removeListenFuncKeyup();
    this.removeListenFuncWindowblur();
  }

  private _resetAllKeys(): void {
    this._shiftHeld.set(false);
    this._ctrlHeld.set(false);
    this._altHeld.set(false);
    this._metaHeld.set(false);
  }

  private readonly _shiftHeld = signal<boolean>(false);
  public readonly shiftHeld = this._shiftHeld.asReadonly();

  private readonly _ctrlHeld = signal<boolean>(false);
  public readonly ctrlHeld = this._ctrlHeld.asReadonly();

  private readonly _altHeld = signal<boolean>(false);
  public readonly altHeld = this._altHeld.asReadonly();

  private readonly _metaHeld = signal<boolean>(false); // "⊞ Win" on Windows, "⌘ Command" on Mac
  public readonly metaHeld = this._metaHeld.asReadonly();

  private readonly _capsLockOn = signal<boolean | undefined>(undefined);
  public readonly capsLockOn = this._capsLockOn.asReadonly();

  private readonly _numLockOn = signal<boolean | undefined>(undefined);
  public readonly numLockOn = this._numLockOn.asReadonly();

  private readonly _scrollLockOn = signal<boolean | undefined>(undefined);
  public readonly scrollLockOn = this._scrollLockOn.asReadonly();

  public readonly isAnyModifierKeyHeld = computed(
    () =>
      this._shiftHeld() ||
      this._ctrlHeld() ||
      this._altHeld() ||
      this._metaHeld(),
  );

  private readonly _shortcutSubject$ = new Subject<KeyboardShortcut>();
  public readonly anyShortcut$ = this._shortcutSubject$.asObservable();

  private readonly _keySubject$ = new Subject<KeyboardKey>();
  public readonly keypress$ = this._keySubject$.asObservable();

  private readonly _keyStateSubject$ = new Subject<KeyboardKeyState>();
  public readonly keyState$ = this._keyStateSubject$.asObservable();

  private _demapKeyCode(code: string): string {
    code = code.toLowerCase();
    if (code.match(/^(left|right|up|down)$/))
      return `Arrow${code.charAt(0).toUpperCase()}${code.substring(1)}`;
    if (code.match(/^[a-z]$/)) return `Key${code.toUpperCase()}`;
    if (code.match(/^\d$/)) return `Digit${code}`;
    if (code == 'ctrl') return 'control';
    if (code.match(/^win(dows)?$/)) return 'meta';
    return code;
  }
  private _emitShortcut(event: KeyboardEvent): void {
    const keys = [];
    if (this._ctrlHeld()) keys.push('Control');
    if (this._altHeld()) keys.push('Alt');
    if (this._shiftHeld()) keys.push('Shift');
    if (this._metaHeld()) keys.push('Meta');
    keys.push(event.code);

    this._shortcutSubject$.next({
      keys,
      event,
    });
  }
  private _emitKeydown(event: KeyboardEvent): void {
    const key = event.code;
    this._keySubject$.next({ key, event });
  }
  private _emitKeyStateDown(event: KeyboardEvent): void {
    const key = event.code;
    this._keyStateSubject$.next({ key, event, isHeld: true });
  }
  private _emitKeyStateUp(event: KeyboardEvent): void {
    const key = event.code;
    this._keyStateSubject$.next({ key, event, isHeld: false });
  }

  listenToShortcut(toMatch: string[]): Observable<KeyboardShortcut> {
    const toMatchStr = toMatch
      .map((code) => this._demapKeyCode(code))
      .sort()
      .toString()
      .toLowerCase();
    return this.anyShortcut$.pipe(
      filter(
        (shortcut) =>
          shortcut.keys.sort().toString().toLowerCase() == toMatchStr,
      ),
    );
  }
  listenToKey(code: string): Observable<KeyboardKey> {
    const keyStr = this._demapKeyCode(code);
    return this.keypress$.pipe(filter((key) => key.key == keyStr));
  }
  listenToKeyState(code: string): Observable<KeyboardKeyState> {
    const keyStr = this._demapKeyCode(code);
    return this.keyState$.pipe(filter((key) => key.key == keyStr));
  }

  private _onKeydown(event: KeyboardEvent): void {
    let wasModifierKey = false;
    switch (event.key) {
      case 'Shift':
        this._shiftHeld.set(true);
        wasModifierKey = true;
        break;
      case 'Control':
        this._ctrlHeld.set(true);
        wasModifierKey = true;
        break;
      case 'Alt':
        this._altHeld.set(true);
        wasModifierKey = true;
        break;
      case 'Meta':
        this._metaHeld.set(true);
        wasModifierKey = true;
        break;
    }
    this._updateLockKeyStates(event);

    this._emitKeyStateDown(event);
    if (!wasModifierKey && this.isAnyModifierKeyHeld()) {
      this._emitShortcut(event);
    } else this._emitKeydown(event);
  }
  private _updateLockKeyStates(event: KeyboardEvent): void {
    this._capsLockOn.set(event.getModifierState?.('CapsLock'));
    this._numLockOn.set(event.getModifierState?.('NumLock'));
    this._scrollLockOn.set(event.getModifierState?.('ScrollLock'));
  }

  private _onKeyup(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Shift':
        this._shiftHeld.set(false);
        break;
      case 'Control':
        this._ctrlHeld.set(false);
        break;
      case 'Alt':
        this._altHeld.set(false);
        break;
      case 'Meta':
        this._metaHeld.set(false);
        break;
    }
    this._emitKeyStateUp(event);
  }
}
