export type KeyboardShortcut = {
  keys: string[];
  event: KeyboardEvent;
};
export type KeyboardKey = {
  key: string;
  event: KeyboardEvent;
};
export type KeyboardKeyState = {
  key: string;
  isHeld: boolean;
  event: KeyboardEvent;
};
