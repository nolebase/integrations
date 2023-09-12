<p align="center">
  <img width="350" src="https://user-images.githubusercontent.com/19204772/193437443-b5e04990-9957-4339-a83c-72b33307dbff.png">
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-green.svg" /></a>
</p>

# [Nólëbase](https://github.com/nolebase/nolebase) Plugins

[简体中文](./README.zh-CN.md)

> [Nólëbase](https://github.com/nolebase/nolebase) is an open-source knowledge base named after Nólëbase, pronounced as nole-base, derived from the Quenya word 'nólë' meaning 'knowledge' and the English word 'base', hence 'knowledge base'.

## Features

- Comprehensive Documentation
  - Accompanied by usage and example documents, along with detailed descriptions, focusing on user experience and developer experience to get your things done faster.
- Multi-platform Compatibility
  - Whether it's VitePress, Astro, Obsidian, or Logseq, we hope that our document engineering can have a similar experience on multiple platforms.
- Rich Features
  - Every platform has its advantages and missing features. We hope to expand their functions, make them more powerful, and easier to use.

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
