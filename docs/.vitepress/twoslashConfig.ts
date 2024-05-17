import { cwd } from 'node:process'

export const compilerOptions = {
  cache: true,
  compilerOptions: {
    baseUrl: cwd(),
    target: 99,
    module: 99,
    moduleResolution: 100,
    paths: {
      '@nolebase/ui': [
        '../packages/ui/src/index.ts',
      ],
      '@nolebase/unconfig-vitepress/*': [
        '../packages/unconfig-vitepress/src/*',
      ],
      '@nolebase/vitepress-plugin-enhanced-readabilities/*': [
        '../packages/vitepress-plugin-enhanced-readabilities/src/*',
      ],
      '@nolebase/vitepress-plugin-highlight-targeted-heading/*': [
        '../packages/vitepress-plugin-highlight-targeted-heading/src/*',
      ],
      '@nolebase/vitepress-plugin-inline-link-preview/*': [
        '../packages/vitepress-plugin-inline-link-preview/src/*',
      ],
      '@nolebase/vitepress-plugin-git-changelog/*': [
        '../packages/vitepress-plugin-git-changelog/src/*',
      ],
      '@nolebase/vitepress-plugin-page-properties/*': [
        '../packages/vitepress-plugin-page-properties/src/*',
      ],
      '@nolebase/vitepress-plugin-thumbnail-hash/*': [
        '../packages/vitepress-plugin-thumbnail-hash/src/*',
      ],
    },
    resolveJsonModule: true,
    types: [
      'node',
      'vite/client',
    ],
    esModuleInterop: true,
    isolatedModules: true,
    verbatimModuleSyntax: true,
    skipLibCheck: true,
    skipDefaultLibCheck: true,
  },
}
