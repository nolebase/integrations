import type { DefaultTheme, SiteData } from 'vitepress'

export function getLocales(siteData: SiteData<DefaultTheme.Config>) {
  const locales: string[] = []
  locales.push(siteData.lang ?? 'root')

  if (Object.keys(siteData.locales).length === 0)
    return locales

  for (const locale in siteData.locales) {
    if (locale !== siteData.lang)
      locales.push(locale)
  }

  return locales
}

export function getTitleWithLocales(siteData: SiteData<DefaultTheme.Config>, locale: string): string {
  if (Object.keys(siteData.locales).length > 0) {
    const title = siteData.locales[locale]?.title
    if (title)
      return title
    if (siteData.locales.root.title)
      return siteData.locales.root.title
    return siteData.title
  }

  return siteData.title
}

export function getDescriptionWithLocales(siteData: SiteData<DefaultTheme.Config>, locale: string): string {
  if (Object.keys(siteData.locales).length > 0) {
    const description = siteData.locales[locale]?.description
    if (description)
      return description
    if (siteData.locales.root.description)
      return siteData.locales.root.description
    return siteData.description
  }

  return siteData.description
}
