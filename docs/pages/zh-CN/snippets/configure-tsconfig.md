::: details 是 TypeScript 用户吗？

至少需要配置下面的几个选项：

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

其中的

 - `module` 选项指定了 JavaScript/TypeScript 的模块格式，Nolebase Integrations 默认使用与 `ESNext` 相兼容的模块格式。
 - `moduleResolution` 选项指定了模块解析策略，因为所有的 Nolebase Integrations 插件都遵循最新的 ECMAScript 规范与导出声明，如果你遇到了 `Cannot find module ... or its corresponding type declarations` 的错误，你可能需要将 `moduleResolution` 设置为 `Bundler`。

如果你想要更多的配置，可以参考下面的示例：

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
