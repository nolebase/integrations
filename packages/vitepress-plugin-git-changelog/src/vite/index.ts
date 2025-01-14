import type { Options } from '../client'

export type { Commit } from '../types'
export * from './git'
export * from './markdownSection'

let globalOptions: Options = {}

export function setOptions(options: Options) {
  globalOptions = options
}

export function getOptions(): Options {
  return globalOptions
}
