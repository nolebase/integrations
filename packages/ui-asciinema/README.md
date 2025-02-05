# `@nolebase/ui-asciinema`

Wrapper of `asciinema-player` for VitePress documentation sites.

> [!CAUTION]
>
> This package is in Alpha stage.
>
> This package is still in the Alpha stage, and it is not recommended to use it in production. The API may change in the future, and there may be bugs in the current version. Please use it with caution.

> [!IMPORTANT]
>
> ## For users who imported VitePress related components
>
> If you are using VitePress, you will need to add the following configurations to your `vite.config.ts` file like this:
>
> ```typescript
> // vite.config.ts
> export default defineConfig({
>   vite: {
>     ssr: {
>       noExternal: [
>         "@nolebase/ui-asciinema",
>       ],
>     },
>   },
> })
> ```

[^1]: Vite's `ssr.noExternal` config docs: https://vitejs.dev/guide/ssr.html#ssr-externals.

## Install

### Npm

```shell
npm i @nolebase/ui-asciinema -D
```

### Yarn

```shell
yarn add @nolebase/ui-asciinema -D
```

### Pnpm

```shell
pnpm add @nolebase/ui-asciinema -D
```

## Documentation

Please refer to [Asciinema Player](https://nolebase-integrations.ayaka.io/pages/en/ui/asciinema-player/) for more information.
