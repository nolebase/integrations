import type { DefaultTheme, SiteData } from 'vitepress'

import { getLocales } from './locales'

interface AggregatedSidebar {
  defaultLocale: string
  locales: string[]
  sidebar: Record<string, DefaultTheme.SidebarItem[]>
}

/**
 * Search for available sidebars in both the default locale and other locales over the site data and theme config.
 *
 * @param {SiteConfig<DefaultTheme.Config>} siteData Site data
 * @param {DefaultTheme.Config} themeConfig Theme config
 * @returns {AggregatedSidebar} Aggregated sidebar
 */
export function getSidebar(siteData: SiteData<DefaultTheme.Config>, themeConfig: DefaultTheme.Config): AggregatedSidebar {
  const locales = getLocales(siteData)

  if (locales.length === 0) {
    return {
      defaultLocale: siteData.lang,
      locales: locales || [],
      sidebar: {
        [siteData.lang]: flattenThemeConfigSidebar(themeConfig.sidebar) || [],
      },
    }
  }

  const sidebar: AggregatedSidebar = {
    defaultLocale: siteData.lang,
    locales,
    sidebar: {},
  }

  for (const locale of locales) {
    let themeConfigSidebar: DefaultTheme.Sidebar = []
    if (typeof siteData.locales[locale]?.themeConfig?.sidebar !== 'undefined') {
      if (Array.isArray(siteData.locales[locale]?.themeConfig?.sidebar)) {
        themeConfigSidebar = siteData.locales[locale]?.themeConfig?.sidebar || []
      }
      else {
        themeConfigSidebar = siteData.locales[locale]?.themeConfig?.sidebar as DefaultTheme.Sidebar
      }
    }
    else if (typeof siteData.themeConfig?.sidebar !== 'undefined') {
      themeConfigSidebar = siteData.themeConfig?.sidebar || []
    }
    else if (typeof themeConfig.sidebar !== 'undefined') {
      themeConfigSidebar = themeConfig.sidebar
    }
    else {
      themeConfigSidebar = []
    }

    sidebar.sidebar[locale] = flattenThemeConfigSidebar(themeConfigSidebar) || []
  }

  return sidebar
}

/**
 * Since sidebar is possible to be either items or multi-sidebars, we need to flatten it to a single array.
 * @param {DefaultTheme.Sidebar} sidebar
 * @returns {DefaultTheme.Sidebar} Flattened sidebar
 */
function flattenThemeConfigSidebar(sidebar?: DefaultTheme.Sidebar): DefaultTheme.SidebarItem[] {
  if (!sidebar)
    return []

  if (Array.isArray(sidebar))
    return sidebar

  return Object.keys(sidebar).reduce((prev, curr) => {
    const items = sidebar[curr]
    return prev.concat(items)
  }, [] as DefaultTheme.SidebarItem[])
}

export function flattenSidebar(sidebar: DefaultTheme.SidebarItem[], base?: string): DefaultTheme.SidebarItem[] {
  return sidebar.reduce((prev, curr) => {
    if (curr.items) {
      return prev.concat(
        flattenSidebar(
          curr.items.map(item => addBaseToItem(item, curr.base ?? base)),
          curr.base ?? base,
        )
          .concat(
            curr.link == null
              ? []
              : [{
                  ...curr,
                  items: undefined,
                  link: curr.link != null
                    ? ((curr.base ?? '') + curr.link)
                    : curr.link,
                }],
          ),
      )
    }

    return prev.concat(curr)
  }, [] as DefaultTheme.SidebarItem[])
}

function addBaseToItem(item: DefaultTheme.SidebarItem, base?: string) {
  if (base == null || base === '')
    return item

  return {
    ...item,
    link: item.link != null
      ? (base + item.link)
      : item.link,
  }
}
