::: details A TypeScript User?

You need to configure at least the following options:

```jsonc
{
  "compilerOptions": {
    "module": "ESNext", // [!code hl]
    "moduleResolution": "Bundler", // [!code hl]
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

And the options

 - `module` option specifies the JavaScript/TypeScript module format, and Nolebase Integrations uses the `ESNext`-compatible module format by default.
 - `moduleResolution` option specifies the module resolution policy, since all Nolebase Integrations plugins follow the latest ECMAScript specifications and export declarations, if you encounter a `Cannot find module ... or its corresponding type declarations` error you may need to set `moduleResolution` to `Bundler`.

If you want more configurations, you can refer to the following example:

```jsonc
{
  "compilerOptions": {
    "jsx": "preserve",
    "lib": [
      "DOM",
      "ESNext"
    ],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "strict": true,
    "strictNullChecks": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true,
    "removeComments": false,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
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

:::
