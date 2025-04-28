---
title: Git-based page histories
category: Git-based page histories
sidebarTitle: Getting Started
---

# Getting started

## Installation

Install `@nolebase/vitepress-plugin-git-changelog` to your project dependencies by running the following command:

::: code-group

```shell [@antfu/ni]
ni @nolebase/vitepress-plugin-git-changelog -D
```

```shell [pnpm]
pnpm add @nolebase/vitepress-plugin-git-changelog -D
```

```shell [npm]
npm install @nolebase/vitepress-plugin-git-changelog -D
```

```shell [yarn]
yarn add @nolebase/vitepress-plugin-git-changelog -D
```

:::

## Usage

::: warning This is roughly the most complex one to configure with!

Please pay attentions to the following configurations and steps to get started with the Git-based page histories plugin. It is not quite simple as other plugins.

:::

It consists two major steps to integrate the Inline Links Previewing plugin into your VitePress project:

- [Configure Vite plugin](#configure-vite-plugin) (data fetching, logs aggregation)
- [Integrate with VitePress](#integrate-with-vitepress-theme) (UI and components)

### Configure Vite plugin

There are two ways to integrate the Git-based page histories Vite plugin into your VitePress project:

1. [**Recommended**: Use the `vite` option in VitePress's primary configuration file (usually located at `docs/.vitepress/config.ts`, file paths and extensions may be vary)](#configure-vite-plugin-in-vitepresss-config-file)
2. [Create a separated Vite configuration file (e.g. `vite.config.ts`) in the root directory of your VitePress project](#configure-vite-plugin-in-a-separated-vite-configuration-file)

#### Configure Vite plugin in VitePress's config file

In VitePress's [**primary configuration file**](https://vitepress.dev/reference/site-config#config-resolution) (not this is not a **theme configuration file**, it's usually located at `docs/.vitepress/config.ts`, file paths and extensions may be vary), we need to import both `GitChangelog` (data fetcher), and `GitChangelogMarkdownSection` (widget embedder) the plugins and configure it properly:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

<!--@include: @/pages/en/snippets/configure-tsconfig.md-->

```typescript twoslash
import { defineConfig } from 'vitepress'
import { // [!code ++]
  GitChangelog, // [!code ++]
  GitChangelogMarkdownSection, // [!code ++]
} from '@nolebase/vitepress-plugin-git-changelog/vite' // [!code ++]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: { // [!code ++]
    plugins: [ // [!code ++]
      GitChangelog({ // [!code ++]
        // Fill in your repository URL here
        repoURL: () => 'https://github.com/nolebase/integrations', // [!code ++]
      }), // [!code ++]
      GitChangelogMarkdownSection(), // [!code ++]
    ],
  }, // [!code ++]
  lang: 'en',
  title: 'Site Name',
  themeConfig: {
    // rest of the options...
  }
  // rest of the options...
})
```

#### Configure Vite plugin in a separated Vite configuration file

##### Ensure `vite.config.ts` is created

If you understand what `vite.config.ts` is already and have created it, you can skip this preparation step and jump to the next step [Configure plugin in `vite.config.ts`](#configure-plugin-in-viteconfigts).

::: tip New to `vite.config.ts` is?

First of all, `vite.config.ts` is a configuration file for [Vite](https://vitejs.org), the build tool that VitePress is built on. It allows developers to build and transform the assets, content and data in the project.

Even though VitePress itself contains entire set of Vite options in its [**primary configuration file**](https://vitepress.dev/reference/site-config#config-resolution) (not this is not a **theme configuration file**, it's usually located at `docs/.vitepress/config.ts`, file paths and extensions may be vary), these options, and yet, the `vite.config.ts` are identical in terms of configurations.

However, due to the order of plugins it registered, it's not enough to transform the needed data and logs if we install the Git-based page histories plugin in this way.

:::

Therefore, please create a separated `vite.config.ts` file in the root directory of your VitePress project:

::: tip Where is the root directory of VitePress project?

VitePress project's root directory is where the parent directory of `.vitepress` directory is.

For example:

```shell
.
├── docs
│   ├── .vitepress
│   │   ├── config.ts
│   │   └── theme
│   │       └── index.ts
│   └── README.md
```

In this case, the root directory is `docs`.

```shell
.
├── .vitepress
│   ├── config.ts
│   └── theme
│       └── index.ts
└── README.md
```

In this case, the root directory is `./`.

:::

```shell
touch vite.config.ts
```

##### Configure plugin in `vite.config.ts`

In the standalone [Vite configuration file](https://vitejs.dev/config/) (e.g. `vite.config.ts`) file we have under our root directory, we need to import both `GitChangelog` (data fetcher), and `GitChangelogMarkdownSection` (widget embedder) the plugins and configure it properly:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

<!--@include: @/pages/en/snippets/configure-tsconfig.md-->

```typescript twoslash
import { join } from 'node:path'
import { defineConfig } from 'vite'
import { // [!code ++]
  GitChangelog, // [!code ++]
  GitChangelogMarkdownSection, // [!code ++]
} from '@nolebase/vitepress-plugin-git-changelog/vite' // [!code ++]

export default defineConfig(() => {
  return {
    plugins: [ // [!code ++]
      GitChangelog({ // [!code ++]
        // Fill in your repository URL here
        repoURL: () => 'https://github.com/nolebase/integrations', // [!code ++]
      }), // [!code ++]
      GitChangelogMarkdownSection(), // [!code ++]
    ]
    // other vite configurations...
  }
})
```

### Integrate with VitePress theme

Now, let's integrate the Git-based page histories UI widgets into your VitePress project.

In VitePress's [**theme configuration file**](https://vitepress.dev/reference/default-theme-config#default-theme-config) (note that it's not a **configuration file**, it's usually located at `docs/.vitepress/theme/index.ts`, file paths and extensions may be vary), install the Vue plugin and use the components:

<!--@include: @/pages/en/snippets/details-colored-diff.md-->

<!--@include: @/pages/en/snippets/configure-tsconfig.md-->

::: code-group

```typescript twoslash [docs/.vitepress/theme/index.ts]
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeConfig } from 'vitepress'
import { // [!code ++]
  NolebaseGitChangelogPlugin // [!code ++]
} from '@nolebase/vitepress-plugin-git-changelog/client' // [!code ++]

import '@nolebase/vitepress-plugin-git-changelog/client/style.css' // [!code ++]

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    // other configurations...
  },
  enhanceApp({ app }) {
    app.use(NolebaseGitChangelogPlugin)  // [!code ++]
  },
}

export default Theme
```

:::

### When will the Git page history information be generated? Configure deployment tools and CI/CD

::: tip What is CI/CD?

Usually, documents using Git-based page history plugin will integrate with [GitHub Actions](https://github.com/features/actions) or [GitLab's CI/CD Pipelines](https://docs.gitlab.com/ee/ci/yaml/) to automate the building process against documentations in the dedicated environment after pushing change commits instead of asking users to execute commands manually and carry out complex construction processes when needed to deploy. You can read more here: [Platform Guides - VitePress](https://vitepress.dev/guide/deploy#platform-guides)

Tools like [GitHub Actions](https://github.com/features/actions) and [GitLab's CI/CD Pipelines](https://docs.gitlab.com/ee/ci/yaml/) provided by GitHub and GitLab to automate the process of building sites, artifacts are one of the step called [CD (Continuous Deployment)]([Continuous deployment - Wikipedia](https://en.wikipedia.org/wiki/Continuous_deployment)) and is part of the larger concept called [CI/CD (continuous integration/continuous deployment](https://en.wikipedia.org/wiki/CI/CD) .

Of course, the CI/CD capabilities of the two Git code hosting platforms listed above are only the tip of the iceberg. In fact, there are other tools out there:

- [Netlify's build hook] (https://docs.netlify.com/configure-builds/build-hooks/)
- [Git integration of Cloudflare Pages] (https://developers.cloudflare.com/pages/configuration/git-integration/ )
- [Vercel's GitHub integration] (https://vercel.com/docs/deployments/git/vercel-for-github)
- [CircleCI](https://circleci.com/)

These are platforms that provide static site hosting plus CI/CD pipeline features. In summary, they allows users to automatically generate static sites according to pre-configured commands and processing pipelines after pushing commits against files.

CI/CD will be run in an dedicated server environment, therefore all the building processes, building commands, and environments are  and reprodusable environment.

Whenever contributors / authors commit a file through the `git` command or Git client, or merge the committed files modified from Pull Request, a "commit" event will be triggered. Generally, CI/CD will be based on such "commit" event where a new, dedicated build environment got created.

:::

CI/CD is triggered by Git commits, and Git-based page history relies on Git commits, so when using a tool like CI/CD, we need to check and configure it before using it to make sure that Git logs are fetched in full or quantitatively, or else there will be no way to fetch Git logs correctly.

#### Build on [GitHub Actions](https://github.com/features/actions)

When using it with Github Actions, we only need to add the configuration of `fetch-depth: 0` to the `with` parameter of `actions/checkout` to ensure that it is in CI/CD The Git log obtained in the environment contains all the information:

```yaml
name: Build Docs

on:
  push:
    branches:
      - 'main'

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout codes # [!code focus]
        uses: actions/checkout@v4 # [!code focus]
        with: # [!code focus]
          fetch-depth: 0 # [!code focus]

      # ... other steps
```

#### Contributor information

The contributor information (such as name and email address) is resolved from the commit author information.

If the commit email address is a GitHub-provided no-reply email (like `<user>@users.noreply.github.com`), then it is used for determaining the GitHub username, which is then used for getting the profile picture from GitHub, as well as linking to the GitHub profile (unless overriden by the [`mapAuthors` option](./configure-vite-plugins#option-mapauthors-map-contributors-information)).

By default, [Gravatar](https://gravatar.com/) is used for getting a profile picture based on an email address.

#### Build on Netlify

By default, Netlify can get all Git logs during the CI/CD build.

#### Build on Cloudflare Pages

The CI/CD pipeline feature of Cloudflare Pages does not provide a way to fetch all Git logs. The only solution is building sites in a controlled environment like GitHub Actions or GitLab CI/CD Pipeline then deploy the artifacts through Cloudflare's official [`wrangler`](https://developers.cloudflare.com/workers/wrangler/install-and-update/) CLI tool.

For example, you can use the GitHub Actions plugin [`pages-action`](https://github.com/cloudflare/pages-action) with the `fetch-depth: 0` parameter described in [build on GitHub Actions](#build on -github -actions-) with the `fetch-depth: 0` parameter described in [Build on GitHub Actions](#build-on-github-actions).

#### Build on Vercel

In Vercel's built-in CI/CD environment, by default, you cannot access the complete Git log information[^1]. You can obtain full Git commit information by setting the environment variable `VERCEL_DEEP_CLONE=true`. *Note that this environment variable is not a stable public API and will be removed at some point in the future[^2].*

A more stable but slightly complex solution is to first build in a controlled environment such as GitHub Actions or GitLab CI/CD Pipelines, and then deploy using Vercel's official [`vercel` CLI tool](https://vercel.com/docs/cli).

## Troubleshooting

### Encountered `Cannot find module ... or its corresponding type declarations` error?

<!--@include: @/pages/en/snippets/troubleshooting-cannot-find-module.md-->

[^1]: [Access git logs in build process · vercel/vercel · Discussion #4101](https://github.com/vercel/vercel/discussions/4101)

[^2]: [To tell Vercel to deep clone by setting an env var to VERCEL_DEEP_CLONE=1 · vercel/turborepo · Discussion #800](https://github.com/vercel/turborepo/discussions/800#discussioncomment-2730849)
