# `@nolebase/integrations`

All-in-one package for VitePress plugins and VitePress theme extensions.

Supporting all Nólëbase Integrations with default theme.

## Install

### Npm

```shell
npm i @nolebase/integrations -D
```

### Yarn

```shell
yarn add @nolebase/integrations -D
```

### Pnpm

```shell
pnpm add @nolebase/integrations -D
```

## Documentation

Please refer to [Integrations](https://nolebase-integrations.ayaka.io/pages/en/integrations/) for more information.

## Theme CSS

`presetClient()` registers runtime components and Vue plugins only. Import one CSS entry that matches your VitePress theme:

```ts
// Default VitePress theme adapter.
import '@nolebase/integrations/vitepress/client/style.css'

// Or import a specific adapter explicitly.
import '@nolebase/integrations/vitepress/client/theme/vitepress.css'
import '@nolebase/integrations/vitepress/client/theme/voidzero.css'
import '@nolebase/integrations/vitepress/client/theme/proj-airi.css'
```

For custom themes, import the shared structural styles and provide your own theme adapter:

```ts
import '@nolebase/integrations/vitepress/client/common.css'
```
