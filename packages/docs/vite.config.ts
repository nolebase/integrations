import { defineConfig } from "vite";
import { resolve } from "path";
import { EasyTag } from "@nolebase/vite-plugin-vitepress-easytag/src/vite";
import { Metadata } from "@nolebase/vite-plugin-vitepress-metadata/src";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${resolve(__dirname, "src")}/`,
      "@nolebase/shared": `${resolve(__dirname, "../../packages/shared/src")}/`,
      "@nolebase/vite-plugin-vitepress-easytag": `${resolve(
        __dirname,
        "../../packages/vite-plugin-vitepress-easytag"
      )}/`,
      "@nolebase/vite-plugin-vitepress-metadata": `${resolve(
        __dirname,
        "../../packages/vite-plugin-vitepress-metadata"
      )}/`,
    },
    dedupe: ["vue", "@vue/runtime-core"],
  },
  plugins: [
    // custom
    Metadata({
      target: "/笔记",
      tagsAlias: [
        {
          name: "数据库",
          aliases: ["database", "Database", "db"],
        },
        {
          name: "sql",
          aliases: ["SQL"],
        },
        {
          name: "postgres",
          aliases: ["postgresql", "PostgreSQL", "Postgres", "pgsql", "PgSQL"],
        },
      ],
    }),
    EasyTag({
      target: "/笔记",
      includes: ["笔记", "生活"],
      openAIAPISecret: process.env.OPENAI_API_SECRET!,
      openAIAPIHost: process.env.OPENAI_API_HOST!,
    }),
  ],
});
