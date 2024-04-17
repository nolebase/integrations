如果有任何的 Nolebase Integrations 插件在 `.ts` 或 `.vue` 文件中出现此错误，你可能需要在 `tsconfig.json` 文件中配置 `moduleResolution` 选项：

```jsonc
{
  "compilerOptions": {
    "module": "ESNext", // [!code focus]
    "moduleResolution": "Bundler", // [!code focus]
  },
  "include": [
    "**/.vitepress/**/*.ts",
    "**/.vitepress/**/*.mts",
    "**/.vitepress/**/*.vue"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

如果错误仍然存在，请提交 [GitHub issue](https://github.com/nolebase/integrations/issues) 以获得进一步帮助并排除故障。
