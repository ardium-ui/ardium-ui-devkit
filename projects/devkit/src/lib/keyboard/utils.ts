import {
  _ExpectedModifierKeySide,
  _LeftRight
} from './types-internal';

export function trySettingModifierKey(
  modifierKeyName: string,
  keyCode: string,
  rawKeyCode: string,
  previouslyFoundKeyCode: string | null,
  currentKeyState: _ExpectedModifierKeySide,
): [_ExpectedModifierKeySide, string | null, boolean] {
  if (keyCode === modifierKeyName) {
    if (previouslyFoundKeyCode) {
      console.error(
        new Error(
          `DKT-NF0030: A keyboard shortcut definition cannot contain two modifier keys of the same type. Got "${previouslyFoundKeyCode}" and "${rawKeyCode}"; only the first one will be included.`,
        ),
      );
      return [currentKeyState, previouslyFoundKeyCode, true];
    }
    return [_ExpectedModifierKeySide.Any, keyCode, true];
  }
  if (keyCode === modifierKeyName + 'left') {
    if (previouslyFoundKeyCode) {
      console.error(
        new Error(
          `DKT-NF0030: A keyboard shortcut definition cannot contain two modifier keys of the same type. Got "${previouslyFoundKeyCode}" and "${rawKeyCode}"; only the first one will be included.`,
        ),
      );
      return [currentKeyState, previouslyFoundKeyCode, true];
    }
    return [_ExpectedModifierKeySide.Left, keyCode, true];
  }
  if (keyCode === modifierKeyName + 'right') {
    if (previouslyFoundKeyCode) {
      console.error(
        new Error(
          `DKT-NF0030: A keyboard shortcut definition cannot contain two modifier keys of the same type. Got "${previouslyFoundKeyCode}" and "${rawKeyCode}"; only the first one will be included.`,
        ),
      );
      return [currentKeyState, previouslyFoundKeyCode, true];
    }
    return [_ExpectedModifierKeySide.Right, keyCode, true];
  }
  return [currentKeyState, previouslyFoundKeyCode, false];
}

export function isModifierKeyInWrongState(
  state: _LeftRight,
  expectedState: _ExpectedModifierKeySide,
): boolean {
  if (expectedState === _ExpectedModifierKeySide.Any)
    return !state.left && !state.right;
  let expectedLeft = false,
    expectedRight = false;
  switch (expectedState) {
    case _ExpectedModifierKeySide.None:
      break;
    case _ExpectedModifierKeySide.Left:
      expectedLeft = true;
      break;
    case _ExpectedModifierKeySide.Right:
      expectedRight = true;
      break;
  }
  return expectedLeft !== state.left || expectedRight !== state.right;
}
