import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${resolve(__dirname, "src")}/`,
      "@nolebase/shared": `${resolve(__dirname, "../../packages/shared/src")}/`,
    },
    dedupe: ["vue", "@vue/runtime-core"],
  },
});
