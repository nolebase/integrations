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
> export default defineConfig(() => {
>   return {
>     ssr: {
>       noExternal: [
>         // Add this line to your vite.config.ts
>         '@nolebase/ui-asciinema',
>       ],
>     },
>   }
> })
> ```
>
> For more information about why configure this, please refer to the [Server-Side Rendering | Vite](https://vitejs.dev/guide/ssr.html#ssr-externals) documentation.

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
