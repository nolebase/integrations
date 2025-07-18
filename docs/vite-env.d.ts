// Env Variables and Modes | Vite
// https://vitejs.dev/guide/env-and-mode#intellisense-for-typescript

/// <reference types="vite/client" />
/// <reference types="@nolebase/vitepress-plugin-git-changelog/types/virtual.d.ts" />
/// <reference types="@nolebase/vitepress-plugin-page-properties/client/virtual.d.ts" />

interface ImportMetaEnv {
  readonly VUE_PROD_HYDRATION_MISMATCH_DETAILS_FLAG?: '1'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
