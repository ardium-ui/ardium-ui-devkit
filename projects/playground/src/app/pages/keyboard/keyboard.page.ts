import { Component, inject, OnInit } from '@angular/core';
import { KeyboardService } from '../../../../../devkit/src/public-api';

@Component({
  selector: 'keyboard-page',
  standalone: true,
  imports: [],
  templateUrl: './keyboard.page.html',
  styleUrl: './keyboard.page.scss',
})
export class KeyboardPage implements OnInit {
  readonly keyboardService = inject(KeyboardService);

  ngOnInit(): void {
    // this.keyboardService.anyKeyPress$.subscribe(v => console.log(v));
    // this.keyboardService.anyShortcut$.subscribe(v => console.log(v));

    this.keyboardService.listenToKey('W').subscribe(v => console.log(v));
    this.keyboardService.listenToKey('A').subscribe(v => console.log(v));
    this.keyboardService.listenToKey('S').subscribe(v => console.log(v));
    this.keyboardService.listenToKey('D').subscribe(v => console.log(v));

    this.keyboardService.listenToShortcut(['Ctrl', 'F']).subscribe((v) => {
      console.log(v);
      v.event.preventDefault();
    });
    this.keyboardService
      .listenToShortcut(['Alt', 'Y'])
      .subscribe((v) => console.log(v));
    this.keyboardService
      .listenToShortcut(['Ctrl', 'Alt', 'Shift', 'G'])
      .subscribe((v) => console.log(v));
    
    this.keyboardService.listenToKeyState('Z').subscribe((v) => console.log(v));
    this.keyboardService.listenToKeyState('X').subscribe((v) => console.log(v));
  }
}
