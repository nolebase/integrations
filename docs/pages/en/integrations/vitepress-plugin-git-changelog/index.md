# Changelog & File history <Badge type="danger" text="Alpha" />

This vitepress plugin read the git log as file history and renders through components with both Contributors section and Changelog section available in Markdown file.

The reason why we haven't made a documentation for it is because we have another pending issue #45 to improve the overall performance and user experience, we might change the API in the nearby future when refactoring.

This is roughly the most complex one to configure with.

First, you need a `vite.config.ts` or vite option in config property of `vitepress`, and then configure these two Vite plugins to read, prepare the git log data for components to render with, transform the Markdown file with the two new additional sections:

```ts
 GitChangelog({
   repoURL: () => 'https://github.com/nolebase/integrations',
   rewritePaths: {
     'docs/': '',
   },
 }),
 GitChangelogMarkdownSection({
   getChangelogTitle: (_, __, { helpers }): string => {
     if (helpers.idStartsWith(join('pages', 'en')))
       return 'File History'
     if (helpers.idStartsWith(join('pages', 'zh-CN')))
       return '文件历史'

     return 'File History'
   },
   excludes: [],
   exclude: (_, { helpers }): boolean => {
     if (helpers.idEquals(join('pages', 'en', 'index.md')))
       return true
     if (helpers.idEquals(join('pages', 'zh-CN', 'index.md')))
       return true

     return false
   },
 }),
```

And use the components as follows:

```ts
 app.provide(NolebaseGitChangelogInjectionKey, {
   mapContributors: [
     {
       name: 'Neko',
       avatar: 'https://github.com/nekomeowww.png',
       nameAliases: ['Neko Ayaka', 'Ayaka Neko'],
       emailAliases: ['neko@ayaka.moe'],
     },
     {
       name: 'Rizumu',
       avatar: 'https://github.com/LittleSound.png',
       nameAliases: ['Rizumu Ayaka', 'Ayaka Rizumu'],
       emailAliases: ['rizumu@ayaka.moe'],
     },
   ],
 })
```

Don't forget to include the stylesheets as well:

```ts
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'
```
