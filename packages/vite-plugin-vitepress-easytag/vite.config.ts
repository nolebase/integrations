import { defineConfig } from "vite"
import { resolve } from "path"
import UnoCSS from "unocss/vite"

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${resolve(__dirname, "src")}/`,
      "@nolebase/shared": `${resolve(__dirname, "../../packages/shared/src")}/`,
    },
    dedupe: ["vue", "@vue/runtime-core"],
  },
  plugins: [
    UnoCSS(),
  ],
});
