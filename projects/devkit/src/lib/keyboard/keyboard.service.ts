import { Injectable, OnDestroy, Renderer2 } from '@angular/core';
import { ɵDomRendererFactory2 } from '@angular/platform-browser';
import { keyToString } from 'key-display-names';
import { BehaviorSubject, filter, Observable, Subject } from 'rxjs';
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
      (e) => this.onKeydown(e),
    );
    this.removeListenFuncKeyup = this.renderer.listen(
      'document',
      'keyup',
      (e) => this.onKeyup(e),
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
    this.setShiftHeld(false);
    this.setCtrlHeld(false);
    this.setAltHeld(false);
    this.setMetaHeld(false);
  }

  private _shiftHeld: boolean = false;
  private _shiftHeldSubject = new BehaviorSubject(false);
  public shiftHeld = this._shiftHeldSubject.asObservable();
  setShiftHeld(v: boolean) {
    this._shiftHeld = v;
    this._shiftHeldSubject.next(v);
  }
  private _ctrlHeld: boolean = false;
  private _ctrlHeldSubject = new BehaviorSubject(false);
  public ctrlHeld = this._ctrlHeldSubject.asObservable();
  setCtrlHeld(v: boolean) {
    this._ctrlHeld = v;
    this._ctrlHeldSubject.next(v);
  }
  private _altHeld: boolean = false;
  private _altHeldSubject = new BehaviorSubject(false);
  public altHeld = this._altHeldSubject.asObservable();
  setAltHeld(v: boolean) {
    this._altHeld = v;
    this._altHeldSubject.next(v);
  }
  private _metaHeld: boolean = false; // "⊞ Win" on Windows, "⌘ Command" on Mac
  private _metaHeldSubject = new BehaviorSubject(false);
  public metaHeld = this._metaHeldSubject.asObservable();
  setMetaHeld(v: boolean) {
    this._metaHeld = v;
    this._metaHeldSubject.next(v);
  }

  isAnyModifierKeyHeld(): boolean {
    return this._shiftHeld || this._ctrlHeld || this._altHeld || this._metaHeld;
  }

  private _shortcutSubject = new Subject<KeyboardShortcut>();
  public anyShortcut = this._shortcutSubject.asObservable();

  private _keySubject = new Subject<KeyboardKey>();
  public keypress = this._keySubject.asObservable();

  private _keyStateSubject = new Subject<KeyboardKeyState>();
  public keyState = this._keyStateSubject.asObservable();

  private _mapKeyCode(code: string): string {
    code = code.toLowerCase();
    if (code.match(/arrow/)) return code;
    if (!code.match(/bracket/) && code.match(/left|right/))
      return code.replace(/left|right/, '');
    if (code.match(/digit\d|key[a-z]/)) return code.substring(code.length - 1);
    return code;
  }
  private _demapKeyCode(code: string): string {
    code = code.toLowerCase();
    if (code.match(/^(left|right|up|down)$/)) return `arrow${code}`;
    if (code.match(/^arrow(left|right|up|down)$/)) return code;
    if (!code.match(/^bracket/) && code.match(/.+(left|right)$/))
      return code.replace(/(left|right)/, '');
    if (code.match(/^(digit\d|key[a-z])$/))
      return code.substring(code.length - 1);
    if (code == 'ctrl') return 'control';
    if (code.match(/^win(dows)?$/)) return 'meta';
    return code;
  }
  private _emitShortcut(event: KeyboardEvent): void {
    let keys = [];
    if (this._shiftHeld) keys.push('shift');
    if (this._ctrlHeld) keys.push('control');
    if (this._altHeld) keys.push('alt');
    if (this._metaHeld) keys.push('meta');
    keys.push(this._mapKeyCode(event.code));

    this._shortcutSubject.next({
      keys,
      event,
    });
  }
  private _emitKeydown(event: KeyboardEvent): void {
    let key = this._mapKeyCode(event.code);
    this._keySubject.next({ key, event });
  }
  private _emitKeyStateDown(event: KeyboardEvent): void {
    let key = this._mapKeyCode(event.code);
    this._keyStateSubject.next({ key, event, isHeld: true });
  }
  private _emitKeyStateUp(event: KeyboardEvent): void {
    let key = this._mapKeyCode(event.code);
    this._keyStateSubject.next({ key, event, isHeld: false });
  }

  listenToShortcut(toMatch: string[]): Observable<KeyboardShortcut> {
    let toMatchStr = toMatch
      .map((code) => this._demapKeyCode(code))
      .sort()
      .toString();
    return this.anyShortcut.pipe(
      filter((shortcut) => shortcut.keys.sort().toString() == toMatchStr),
    );
  }
  listenToKey(code: string): Observable<KeyboardKey> {
    let keyStr = this._demapKeyCode(code);
    return this.keypress.pipe(filter((key) => key.key == keyStr));
  }
  listenToKeyState(
    code: string,
    anyState: boolean = false,
  ): Observable<KeyboardKeyState> {
    let keyStr = this._demapKeyCode(code);
    return this.keyState.pipe(
      filter(
        (key) => key.key == keyStr && (anyState || (!anyState && key.isHeld)),
      ),
    );
  }

  onKeydown(event: KeyboardEvent): void {
    let wasModifierKey = false;
    switch (event.key) {
      case 'Shift':
        this.setShiftHeld(true);
        wasModifierKey = true;
        break;
      case 'Control':
        this.setCtrlHeld(true);
        wasModifierKey = true;
        break;
      case 'Alt':
        this.setAltHeld(true);
        wasModifierKey = true;
        break;
      case 'Meta':
        this.setMetaHeld(true);
        wasModifierKey = true;
        break;
    }
    this._emitKeyStateDown(event);
    if (!wasModifierKey && this.isAnyModifierKeyHeld()) {
      this._emitShortcut(event);
    } else this._emitKeydown(event);
  }

  onKeyup(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Shift':
        this.setShiftHeld(false);
        break;
      case 'Control':
        this.setCtrlHeld(false);
        break;
      case 'Alt':
        this.setAltHeld(false);
        break;
      case 'Meta':
        this.setMetaHeld(false);
        break;
    }
    this._emitKeyStateUp(event);
  }

  mapKeyForDisplay(key: string, useShort: boolean = true): string {
    return keyToString(key, useShort);
  }
}
