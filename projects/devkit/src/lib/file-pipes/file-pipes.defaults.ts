import { InjectionToken, Provider } from '@angular/core';

export interface ArdFilePipesDefaults {
  extensionWithDot: boolean;
  sizePrecision: number;
  sizeUseSpace: boolean;
}

const _filePipesDefaults: ArdFilePipesDefaults = {
  extensionWithDot: true,
  sizePrecision: 2,
  sizeUseSpace: true,
};

export const ARD_FILE_PIPES_DEFAULTS = new InjectionToken<ArdFilePipesDefaults>(
  'ard-file-pipes-defaults',
  {
    factory: () => ({
      ..._filePipesDefaults,
    }),
  },
);

export function provideFilePipesDefaults(
  config: Partial<ArdFilePipesDefaults>,
): Provider {
  return {
    provide: ARD_FILE_PIPES_DEFAULTS,
    useValue: { ..._filePipesDefaults, ...config },
  };
}
