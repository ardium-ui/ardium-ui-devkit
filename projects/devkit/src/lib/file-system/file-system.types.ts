export const FileSystemMethod = {
  PreferFileSystem: 'preferFileSystem',
  CrossBrowser: 'crossBrowser',
} as const;
export type FileSystemMethod = (typeof FileSystemMethod)[keyof typeof FileSystemMethod];

export const FileSystemStartDirectory = {
  Desktop: 'desktop',
  Documents: 'documents',
  Downloads: 'downloads',
  Music: 'music',
  Pictures: 'pictures',
  Videos: 'videos',
} as const;
export type FileSystemStartDirectory = (typeof FileSystemStartDirectory)[keyof typeof FileSystemStartDirectory];

type _FileSystemSaveOptionsBase = {
  fileName?: string;
};
export type FileSystemSaveOptions = _FileSystemSaveOptionsBase &
  (
    | {
        method: 'preferFileSystem';
        directoryId?: string;
        startDirectory?: FileSystemStartDirectory;
        types?: {
          description?: string;
          accept: Record<string, string[]>;
        }[];
        accept?: string | string[];
      }
    | {
        method?: 'crossBrowser';
      }
  );

type _FileSystemRequestOptionsBase = {
  accept?: string | string[];
  multiple?: boolean;
};
export type FileSystemRequestOptions = _FileSystemRequestOptionsBase &
  (
    | {
        method: 'preferFileSystem';
        directoryId?: string;
        startDirectory?: FileSystemStartDirectory;
        types?: {
          description?: string;
          accept: Record<string, string[]>;
        }[];
      }
    | {
        method?: 'crossBrowser';
      }
  );
