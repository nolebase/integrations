// Env Variables and Modes | Vite
// https://vitejs.dev/guide/env-and-mode#intellisense-for-typescript

interface ImportMetaEnv {
  readonly VUE_PROD_HYDRATION_MISMATCH_DETAILS_FLAG?: '1'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
