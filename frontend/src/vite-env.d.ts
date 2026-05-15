/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL path for externally-served images. Default: /Uploads/images */
  readonly VITE_IMAGE_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
