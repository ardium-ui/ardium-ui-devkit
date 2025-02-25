import { KeyboardShortcut } from "./keyboard.types";

export type _LeftRight = { left: boolean; right: boolean; };

export type _KeyboardShortcutInternal = {
  ctrl: _LeftRight;
  alt: _LeftRight;
  shift: _LeftRight;
  meta: _LeftRight;
  key: string;
  publicData: KeyboardShortcut;
};

export const _ExpectedModifierKeySide = {
  None: 'none',
  Left: 'left',
  Right: 'right',
  Any: 'any',
} as const;
export type _ExpectedModifierKeySide = typeof _ExpectedModifierKeySide[keyof typeof _ExpectedModifierKeySide];