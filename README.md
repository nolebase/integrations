<p align="center">
  <img width="350" src="https://user-images.githubusercontent.com/19204772/193437443-b5e04990-9957-4339-a83c-72b33307dbff.png">
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-green.svg" /></a>
</p>

# [Nólëbase](https://github.com/nolebase/nolebase) Plugins

[简体中文](./README.zh-CN.md)

---

A collection of diverse documentation engineering tools.

> [Nólëbase](https://github.com/nolebase/nolebase) is an open-source knowledge base named after Nólëbase, pronounced as nole-base, derived from the Quenya word 'nólë' meaning 'knowledge' and the English word 'base', hence 'knowledge base'.

## Features

- 🚀 Documentation Engineering First
  - From the perspective of documentation engineering, solve and simplify some UX/DX problems, aiming to let creators focus on writing documents, notes, making cards and GTD!
- ⚖️ Compatible and Easy to Use
  - Whether it is static-first like VitePress, Astro, or client-first like Obsidian and Logseq, the "Nólëbase Plugins" project hopes to provide a similar or even better experience across different platforms.
- 🧩 Rich Features
  - Each platform has its own advantages and missing functions, but the documentation engineering is already time-consuming and labor-intensive. These issues should not be obstacles to restrict the writing and sharing of documents and knowledge. Expand your imagination far beyond with Nólëbase Plugins.

## How to Develop

The project uses [`unbuild`](https://github.com/unjs/unbuild) for construction. With the powerful functions of [`jiti`](https://github.com/unjs/jiti), we no longer need to use [Rollup](https://rollupjs.org/) for tedious configuration and then listen to local file changes for development. We can directly run the following command to output our plugin:

```shell
pnpm run packages:stub
```

If you use [`@antfu/ni`](https://github.com/antfu/ni), you can also use the following command:

```shell
nr packages:stub
```

Next, you need to start the VitePress documentation of the project for preview and development. You can use the following command:

```shell
pnpm run docs:dev
```

If you use [`@antfu/ni`](https://github.com/antfu/ni), you can also use the following command:

```shell
nr docs:dev
```

### Written with ♥
