import type { DefaultTheme, LocaleConfig } from 'vitepress'

import type { Helpers } from './helpers'
import type { GitChangelogMarkdownSectionOptions } from './types'
import { type Locale, defaultEnLocale, defaultLocales } from './locales'

export type I18nTHandler = (key: keyof Locale) => string | undefined
export interface LinksPair { language?: string, linkPrefix?: string }

export interface Options {
  getChangelogTitle?: GitChangelogMarkdownSectionOptions['getChangelogTitle']
  getContributorsTitle?: GitChangelogMarkdownSectionOptions['getContributorsTitle']
}

interface VitePressConfigLike {
  site: {
    locales: Record<string, LocaleConfig<DefaultTheme.Config> | any>
  }
}

function getValueByPropertyPaths<T extends PropertyKey>(path: T, obj?: Record<string, any>): string | undefined {
  if (!obj)
    return undefined

  const properties = String(path).split('.')
  let value = obj

  for (const property of properties) {
    value = value?.[property]
    if (!value)
      return undefined
  }

  if (typeof value === 'string')
    return value

  return String(value)
}

export function createI18nWithLinksPairs(localesLinksPairs: Array<LinksPair>, helpers: Helpers, locales: Record<string, Locale>) {
  function t(key: keyof Locale): string | undefined {
    const foundLocales = localesLinksPairs
      .filter(({ linkPrefix }) => {
        if (!linkPrefix)
          return false

        const startsWith = helpers.idStartsWith(linkPrefix)
        if (startsWith)
          return true

        return helpers.idStartsWith(linkPrefix.slice(1))
      })

    if (foundLocales.length === 0)
      return

    const language = foundLocales[0].language
    if (!language)
      return

    const locale = locales?.[language]
    if (!locale)
      return

    return getValueByPropertyPaths(key, locale)
  }

  return { t }
}

export function tChangelogTitle(t: I18nTHandler, code: string, id: string, helpers: Helpers, options?: Options) {
  const defaultValue = defaultEnLocale!.gitChangelogMarkdownSectionTitles!.changelog!

  if (typeof options?.getChangelogTitle === 'function') {
    const changelogTitle = options?.getChangelogTitle(code, id, { helpers })
    if (changelogTitle)
      return changelogTitle
  }

  return t('gitChangelogMarkdownSectionTitles.changelog') ?? defaultValue
}

export function tContributorsTitle(t: I18nTHandler, code: string, id: string, helpers: Helpers, options?: Options) {
  const defaultValue = defaultEnLocale!.gitChangelogMarkdownSectionTitles!.contributors!

  if (typeof options?.getContributorsTitle === 'function') {
    const contributorsTitle = options?.getContributorsTitle(code, id, { helpers })
    if (contributorsTitle)
      return contributorsTitle
  }

  return t('gitChangelogMarkdownSectionTitles.contributors') ?? defaultValue
}

export function tTitles(
  vitepressConfig: VitePressConfigLike,
  options: GitChangelogMarkdownSectionOptions | undefined,
  code: string,
  id: string,
  helpers: Helpers,
) {
  const localesLinksPairs = Object
    .entries((vitepressConfig.site.locales))
    .map(([_, config]) => ({ language: config.lang, linkPrefix: config.link }))

  let locales: Record<string, Locale> = {}

  if (typeof options?.locales !== 'undefined' && Object.keys(options.locales).length > 0)
    locales = options.locales
  else
    locales = defaultLocales

  const { t } = createI18nWithLinksPairs(localesLinksPairs, helpers, locales)
  return {
    changelogTitle: tChangelogTitle(t, code, id, helpers, options),
    contributorsTitle: tContributorsTitle(t, code, id, helpers, options),
  }
}
