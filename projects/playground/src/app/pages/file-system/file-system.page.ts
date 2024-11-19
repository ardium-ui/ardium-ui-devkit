import { Component, inject } from '@angular/core';
import { FileSystemMethod, FileSystemService, FileSystemStartDirectory } from '../../../../../../dist/devkit';

@Component({
  selector: 'file-system-page',
  standalone: true,
  imports: [],
  templateUrl: './file-system.page.html',
  styleUrl: './file-system.page.scss',
})
export class FileSystemPage {
  readonly fileSystem = inject(FileSystemService);

  async onButtonClick() {
    const file = (await this.fileSystem.requestFileUpload({
      directoryId: 'gorilla',
      startDirectory: FileSystemStartDirectory.Downloads,
      method: FileSystemMethod.PreferFileSystem,
      multiple: false,
      types: [
        { description: 'Text files', accept: { 'text/plain': ['.txt'] } },
        {
          description: 'Image files',
          accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] },
        },
        { description: 'PDF files', accept: { 'application/pdf': ['.pdf'] } },
      ],
    })) as File | null;
    console.log(file);
  }
}
