#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { argv, env, execPath, exit } from 'node:process'

const [theme, command, ...args] = argv.slice(2)
const require = createRequire(import.meta.url)
let vitepressBin

try {
  vitepressBin = require.resolve('vitepress/bin/vitepress.js')
}
catch (error) {
  if (error?.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED')
    throw error

  const vitepressPackageJsonPath = require.resolve('vitepress/package.json')
  const vitepressPackageJson = require('vitepress/package.json')
  vitepressBin = resolve(dirname(vitepressPackageJsonPath), vitepressPackageJson.bin.vitepress)
}

const allowedThemes = new Set(['vitepress', 'voidzero'])
const allowedCommands = new Set(['build', 'dev', 'preview'])

if (!allowedThemes.has(theme) || !allowedCommands.has(command)) {
  console.error('Usage: node scripts/run-vitepress-theme.mjs <vitepress|voidzero> <build|dev|preview> [...args]')
  exit(1)
}

const result = spawnSync(
  execPath,
  [vitepressBin, command, '.', ...args],
  {
    stdio: 'inherit',
    env: {
      ...env,
      NOLEBASE_DOCS_THEME: theme,
    },
  },
)

if (typeof result.status === 'number')
  exit(result.status)

if (result.error)
  throw result.error

exit(1)
