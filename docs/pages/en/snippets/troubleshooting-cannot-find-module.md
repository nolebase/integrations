If you are encountering this error with Nolebase Integrations packages inside of `.ts` or `.vue` files, you may need to configure the `moduleResolution` option in your `tsconfig.json` file.

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

If the error persists, please submit a [GitHub issue](https://github.com/nolebase/integrations/issues) for further assistance and troubleshooting.
