/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOLID_AUTH0_VER: string;
  readonly VITE_SOLID_AUTH0_NAME: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
