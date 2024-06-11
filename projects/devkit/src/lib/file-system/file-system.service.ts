import { Injectable, Renderer2 } from '@angular/core';
import { FileSystemSaveOptions, FileSystemMethod, FileSystemRequestOptions } from './file-system.types';
import { isArray } from 'simple-bool';

const DEFAULT_SAVE_OPTIONS = {
  fileName: 'download',
  method: FileSystemMethod.PreferFileSystem,
};
const DEFAULT_REQUEST_OPTIONS = {
  accept: '*.*',
  method: FileSystemMethod.PreferFileSystem,
  multiple: false,
};

@Injectable({
  providedIn: 'root',
})
export class FileSystemService {
  constructor(private renderer2: Renderer2) {}

  isFileSystemAPISupported(method: 'showSaveFilePicker' | 'showOpenFilePicker'): boolean {
    try {
      // isn't in an iframe &&
      return window.self === window.top && method in window;
    } catch (err) {
      return false;
    }
  }

  //! saving files
  async saveAs(data: string | Blob, options: FileSystemSaveOptions = {}): Promise<boolean> {
    options = {
      ...DEFAULT_SAVE_OPTIONS,
      ...options,
    };
    // coerce string to blob if needed
    if (typeof data == 'string') {
      data = new Blob([data], {
        type: 'text/plain',
      });
    }
    // use the File System Access API if supported & preferred
    if (this.isFileSystemAPISupported('showSaveFilePicker') && options.method == FileSystemMethod.PreferFileSystem) {
      // coerce the options.accept into a valid options.types object
      if (options.accept) {
        if (typeof options.accept == 'string') {
          options.accept = options.accept.split(',');
        }
        if (!options.types) options.types = [];

        const accept = { 'application/octet-stream': options.accept };
        options.types.push({ accept: accept });
      }

      // use the File System Access API
      try {
        const handle = await (window as any).showSaveFilePicker({
          id: options.directoryId,
          startIn: options.startDirectory,
          suggestedName: options.fileName,
          types: options.types,
        });

        const writable = await handle.createWritable();
        await writable.write(data);
        await writable.close();
        return true;
      } catch (err) {
        // fail silently if the user has simply canceled the dialog.
        const error = err as any;
        if (error.name !== 'AbortError') {
          console.error(error.name, error.message);
        }
        return false;
      }
    }
    // fallback if the File System Access API is not supported
    // or the user doesn't want to use it
    const blobURL = URL.createObjectURL(data);

    const a = document.createElement('a');
    a.href = blobURL;
    a.download = options.fileName!;
    a.style.display = 'none';
    this.renderer2.appendChild(document.body, a);
    a.click();

    //remove the element from the DOM
    return await new Promise<boolean>(resolve =>
      setTimeout(() => {
        URL.revokeObjectURL(blobURL);
        this.renderer2.removeChild(document.body, a);
        resolve(true);
      }, 1000)
    );
  }

  //! opening files
  async requestFileUpload(options: FileSystemRequestOptions = {}): Promise<File | File[] | null> {
    options = {
      ...DEFAULT_REQUEST_OPTIONS,
      ...options,
    };
    // use the File System Access API if supported & preferred
    if (this.isFileSystemAPISupported('showOpenFilePicker') && options.method == 'preferFileSystem') {
      try {
        console.log('%cusing file system api', 'color:red');
        // coerce the options.accept into a valid options.types object
        if (options.accept && options.accept != '*') {
          if (typeof options.accept == 'string') {
            options.accept = options.accept.split(',');
          }
          if (!options.types) options.types = [];

          const accept = {
            'application/octet-stream': options.accept,
          };
          options.types.push({ accept: accept });
        }

        // open the dialog box
        const handles = await (window as any).showOpenFilePicker({
          id: options.directoryId,
          startIn: options.startDirectory,
          types: options.types,
          multiple: options.multiple,
        });
        const fileArray = (await Promise.all(
          handles.map(async (handle: any) => {
            const file = await handle.getFile();
            file.handle = handle;
            return file as File;
          })
        )) as File[];
        if (!options.multiple) {
          return fileArray[0];
        }
        return fileArray;
      } catch (err) {
        // fail silently if the user has simply canceled the dialog.
        const error = err as any;
        if (error.name !== 'AbortError') {
          console.error(error.name, error.message);
        }
        return null;
      }
    }
    // fallback if the File System Access API is not supported
    // or the user doesn't want to use it

    // coerce options.accept into a string
    if (isArray(options.accept)) {
      options.accept = options.accept.join(',');
    } else {
      options.accept = options.accept ?? '*';
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = options.accept;
    input.multiple = options.multiple ?? false;
    input.style.display = 'none';
    this.renderer2.appendChild(document.body, input);
    input.click();

    const fileArray = await new Promise<File[] | null>(resolve => {
      input.onchange = () => {
        resolve(input.files && input.files.length > 0 ? Array.from(input.files) : null);
        this.renderer2.removeChild(document.body, input);
      };
    });
    if (options.multiple || !fileArray) {
      return fileArray;
    }
    return fileArray[0];
  }

  //! reading file content
  async readFile(file: File, readAs?: 'text', encoding?: string): Promise<string | null>;
  async readFile(file: File, readAs?: 'binary'): Promise<ArrayBuffer | null>;
  async readFile(file: File, readAs?: 'text' | 'binary', encoding?: string): Promise<string | ArrayBuffer | null>;
  async readFile(file: File, readAs: 'text' | 'binary' = 'text', encoding: string = 'UTF-8'): Promise<string | ArrayBuffer | null> {
    if (readAs == 'text') {
      return await new Promise<string | null>(resolve => {
        const reader = new FileReader();
        reader.readAsText(file, encoding);
        reader.onload = function (e) {
          resolve(e.target!.result as string | null);
        };
      });
    }
    return await new Promise<ArrayBuffer | null>(resolve => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = function (e) {
        resolve(e.target!.result as ArrayBuffer | null);
      };
    });
  }
}
