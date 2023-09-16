<p align="center">
  <img width="350" src="https://user-images.githubusercontent.com/19204772/193437443-b5e04990-9957-4339-a83c-72b33307dbff.png">
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-green.svg" /></a>
</p>

# [Nólëbase](https://github.com/nolebase/nolebase) Integrations

[简体中文](./README.zh-CN.md)

---

A collection of diverse documentation engineering tools.

> [Nólëbase](https://github.com/nolebase/nolebase) is an open-source knowledge base named after Nólëbase, pronounced as nole-base, derived from the Quenya word 'nólë' meaning 'knowledge' and the English word 'base', hence 'knowledge base'.

## Features

- 🚀 Documentation Engineering First
  - From the perspective of documentation engineering, solve and simplify some UX/DX problems, aiming to let creators focus on writing documents, notes, making cards and GTD!
- ⚖️ Compatible and Easy to Use
  - Whether it is static-first like VitePress, or client-first like Obsidian, the "Nólëbase Integrations" project hopes to provide a similar or even better experience across different platforms.
- 🧩 Rich Features
  - Each platform has its own advantages and missing features, but the documentation engineering is already time-consuming and labor-intensive. These issues should not be obstacles to restrict the writing and sharing of documents and knowledge. Expand your imagination far beyond with Nólëbase Integrations.

## How to develop

The project uses [`unbuild`](https://github.com/unjs/unbuild) and [`vite`](https://github.com/vitejs/vite) to develop and build. With the powerful features offered from [`jiti`](https://github.com/unjs/jiti), we no longer need to use [Rollup](https://rollupjs.org/) for tedious configuration and then watch the local file changes and bundle the modified and developed the modules without [`vite`](https://github.com/vitejs/vite) for hot-reload. We can directly run the following command to output the bundled file and get started on development:

```shell
pnpm run packages:stub
```

If you use [`@antfu/ni`](https://github.com/antfu/ni), you can also use the following command:

```shell
nr packages:stub
```

Next, you need to start the the documentation site (with VitePress) for previewing and development. You can use the following command:

```shell
pnpm run docs:dev
```

If you use [`@antfu/ni`](https://github.com/antfu/ni), you can also use the following command:

```shell
nr docs:dev
```

## How to build

```shell
pnpm run packages:build
```

If you use [`@antfu/ni`](https://github.com/antfu/ni), you can also use the following command:

```shell
nr packages:build
```

To build the documentation and preview site, you can use the following command:

```shell
pnpm run docs:build
```

If you use [`@antfu/ni`](https://github.com/antfu/ni), you can also use the following command:

```shell
nr docs:build
```

### Written with ♥
