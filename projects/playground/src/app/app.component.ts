import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FileSystemService } from '../../../devkit/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly fileSystemService = inject(FileSystemService);

  save() {
    this.fileSystemService.saveAs('test', {
      fileName: 'test.txt',
      types: [
        { description: 'Plik tesktowy', accept: { 'text/plain': ['.txt'] } },
      ],
    });
  }
}
