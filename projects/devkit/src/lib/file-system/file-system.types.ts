/**
 * Enumeration of file system methods.
 */
export const FileSystemMethod = {
  /**
   * Prefer using the File System Access API, or if not supported, use a cross-browser compatible method.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API File System Access API}
   */
  PreferFileSystem: 'preferFileSystem',
  /**
   * Always use a cross-browser compatible method.
   */
  CrossBrowser: 'crossBrowser',
} as const;

/**
 * Type representing file system methods.
 */
export type FileSystemMethod =
  (typeof FileSystemMethod)[keyof typeof FileSystemMethod];

/**
 * Enumeration of file system start directories.
 */
export const FileSystemStartDirectory = {
  /**
   * Always start in the Desktop directory.
   */
  Desktop: 'desktop',
  /**
   * Always start in the Documents directory.
   */
  Documents: 'documents',
  /**
   * Always start in the Downloads directory.
   */
  Downloads: 'downloads',
  /**
   * Always start in the Music directory.
   */
  Music: 'music',
  /**
   * Always start in the Pictures directory.
   */
  Pictures: 'pictures',
  /**
   * Always start in the Videos directory.
   */
  Videos: 'videos',
} as const;

/**
 * Type representing file system start directories.
 */
export type FileSystemStartDirectory =
  (typeof FileSystemStartDirectory)[keyof typeof FileSystemStartDirectory];

/**
 * Base type for file system save options.
 *
 * @property {string} [fileName] - The name of the file to be saved.
 */
type _FileSystemSaveOptionsBase = {
  fileName?: string;
};

/**
 * Type representing file system save options
 */
export type FileSystemSaveOptions = _FileSystemSaveOptionsBase &
  (
    | {
        /**
         * Prefer using the File System Access API, or if not supported, use a cross-browser compatible method.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API File System Access API}
         */
        method: 'preferFileSystem';
        /**
         * By specifying an ID, the browser can remember different directories for different IDs. If the same ID is used for another picker, the picker opens in the same directory.
         */
        directoryId?: string;
        /**
         * The directory to open the dialog in. Leaving this undefined results in the dialog being opened in the last known directory.
         */
        startDirectory?: FileSystemStartDirectory;
        /**
         * An array of allowed file types to save. Each item is an object with the following options:
         * - `description?` - An optional desciption of the category of file types allowed. Default to be an empty string.
         * - `accept` - An object with the keys set to the MIME type and the values an array of file extensions (see below for an example).
         * ```ts
         * const opts = {
         *   types: [
         *     {
         *       description: "Text file",
         *       accept: { "text/plain": [".txt"] },
         *     },
         *   ],
         * };
         * ```
         */
        types?: {
          /**
           * An optional desciption of the category of file types allowed. Default to be an empty string.
           */
          description?: string;
          /**
           * An object with the keys set to the MIME type and the values an array of file extensions (see below for an example).
           * ```ts
           * const opts = {
           *   types: [
           *     {
           *       description: "Text file",
           *       accept: { "text/plain": [".txt"] },
           *     },
           *   ],
           * };
           * ```
           */
          accept: Record<string, string[]>;
        }[];
      }
    | {
        /**
         * Always use a cross-browser compatible method.
         */
        method?: 'crossBrowser';
      }
  );

/**
 * Base type for file system request options.
 */
type _FileSystemRequestOptionsBase = {
  accept?: string | string[];
  multiple?: boolean;
};

/**
 * Type representing file system request options.
 */
export type FileSystemRequestOptions = _FileSystemRequestOptionsBase &
  (
    | {
        /**
         * Prefer using the File System Access API, or if not supported, use a cross-browser compatible method.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API File System Access API}
         */
        method: 'preferFileSystem';
        /**
         * By specifying an ID, the browser can remember different directories for different IDs. If the same ID is used for another picker, the picker opens in the same directory.
         */
        directoryId?: string;
        /**
         * The directory to open the dialog in. Leaving this undefined results in the dialog being opened in the last known directory.
         */
        startDirectory?: FileSystemStartDirectory;
        /**
         * An array of allowed file types to request. Each item is an object with the following options:
         * - `description?` - An optional desciption of the category of file types allowed. Default to be an empty string.
         * - `accept` - An object with the keys set to the MIME type and the values an array of file extensions (see below for an example).
         * ```ts
         * const opts = {
         *   types: [
         *     {
         *       description: "Text file",
         *       accept: { "text/plain": [".txt"] },
         *     },
         *   ],
         * };
         * ```
         */
        types?: {
          /**
           * An optional desciption of the category of file types allowed. Default to be an empty string.
           */
          description?: string;
          /**
           * An object with the keys set to the MIME type and the values an array of file extensions (see below for an example).
           * ```ts
           * const opts = {
           *   types: [
           *     {
           *       description: "Text file",
           *       accept: { "text/plain": [".txt"] },
           *     },
           *   ],
           * };
           * ```
           */
          accept: Record<string, string[]>;
        }[];
      }
    | {
        /**
         * Always use a cross-browser compatible method.
         */
        method?: 'crossBrowser';
      }
  );
