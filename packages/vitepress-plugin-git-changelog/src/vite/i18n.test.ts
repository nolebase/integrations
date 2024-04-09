import { describe, expect, it } from 'vitest'
import { createI18nWithLinksPairs, tChangelogTitle, tContributorsTitle, tTitles } from './i18n'
import { createHelpers } from './helpers'

describe('vite/i18n', () => {
  describe('createI18nWithLinksPairs', () => {
    it('should return t', () => {
      const localeLinksPairs = [{ language: 'en', linkPrefix: '/pages/en' }]
      const helpers = createHelpers('/some/dir', '/some/dir/pages/en/index.md')

      const { t } = createI18nWithLinksPairs(localeLinksPairs, helpers, {})

      expect(typeof t).toBe('function')
    })
  })

  describe('t', () => {
    it('should translate test', () => {
      const localeLinksPairs = [{ language: 'en', linkPrefix: '/pages/en' }]
      const helpers = createHelpers('/some/dir', '/some/dir/pages/en/index.md')

      const { t } = createI18nWithLinksPairs(localeLinksPairs, helpers, {
        en: {
          test: 'Test',
        },
      })

      expect(t('test')).toBe('Test')
    })
  })

  describe('tChangelogTitle', () => {
    it('should be able to translate', () => {
      const localeLinksPairs = [{ language: 'en', linkPrefix: '/pages/en' }]
      const helpers = createHelpers('/some/dir', '/some/dir/pages/en/index.md')

      const { t } = createI18nWithLinksPairs(localeLinksPairs, helpers, {})
      expect(tChangelogTitle(t, 'test content', '/some/dir/pages/en/index.md', helpers, {})).toBe('Changelog')
    })

    it('should be able to translate if locales defined when create', () => {
      const localeLinksPairs = [{ language: 'en', linkPrefix: '/pages/en' }]
      const helpers = createHelpers('/some/dir', '/some/dir/pages/en/index.md')

      const { t } = createI18nWithLinksPairs(localeLinksPairs, helpers, {
        en: {
          gitChangelogMarkdownSectionTitles: {
            changelog: 'Test',
          },
        },
      })

      expect(tChangelogTitle(t, 'test content', '/some/dir/pages/en/index.md', helpers, {})).toBe('Test')
    })

    it('should not be able to translate if getter passed', () => {
      const localeLinksPairs = [{ language: 'en', linkPrefix: '/pages/en' }]
      const helpers = createHelpers('/some/dir', '/some/dir/pages/en/index.md')

      const { t } = createI18nWithLinksPairs(localeLinksPairs, helpers, {})

      expect(tChangelogTitle(t, 'test content', '/some/dir/pages/en/index.md', helpers, {
        getChangelogTitle: () => 'Changelog Test',
      })).toBe('Changelog Test')
    })
  })

  describe('tContributorsTitle', () => {
    it('should be able to translate', () => {
      const localeLinksPairs = [{ language: 'en', linkPrefix: '/pages/en' }]
      const helpers = createHelpers('/some/dir', '/some/dir/pages/en/index.md')

      const { t } = createI18nWithLinksPairs(localeLinksPairs, helpers, {})
      expect(tContributorsTitle(t, 'test content', '/some/dir/pages/en/index.md', helpers, {})).toBe('Contributors')
    })

    it('should be able to translate if locales defined when create', () => {
      const localeLinksPairs = [{ language: 'en', linkPrefix: '/pages/en' }]
      const helpers = createHelpers('/some/dir', '/some/dir/pages/en/index.md')

      const { t } = createI18nWithLinksPairs(localeLinksPairs, helpers, {
        en: {
          gitChangelogMarkdownSectionTitles: {
            contributors: 'Test',
          },
        },
      })

      expect(tContributorsTitle(t, 'test content', '/some/dir/pages/en/index.md', helpers, {})).toBe('Test')
    })

    it('should not be able to translate if getter passed', () => {
      const localeLinksPairs = [{ language: 'en', linkPrefix: '/pages/en' }]
      const helpers = createHelpers('/some/dir', '/some/dir/pages/en/index.md')

      const { t } = createI18nWithLinksPairs(localeLinksPairs, helpers, {})

      expect(tContributorsTitle(t, 'test content', '/some/dir/pages/en/index.md', helpers, {
        getContributorsTitle: () => 'Contributors Test',
      })).toBe('Contributors Test')
    })
  })

  describe('tTitles', () => {
    it('should be able to translate', () => {
      const helpers = createHelpers('/some/dir', '/some/dir/pages/en/index.md')
      const mockVitePressConfig = {
        site: {
          locales: {
            en: {
              lang: 'en',
              link: '/pages/en',
            },
          },
        },
      }
      const { changelogTitle, contributorsTitle } = tTitles(mockVitePressConfig, {}, 'test content', '/some/dir/pages/en/index.md', helpers)

      expect(changelogTitle).toBe('Changelog')
      expect(contributorsTitle).toBe('Contributors')
    })

    it('should be able to translate if locales defined', () => {
      const helpers = createHelpers('/some/dir', '/some/dir/pages/en/index.md')
      const mockVitePressConfig = {
        site: {
          locales: {
            en: {
              lang: 'en',
              link: '/pages/en',
            },
          },
        },
      }
      const { changelogTitle, contributorsTitle } = tTitles(mockVitePressConfig, {
        locales: {
          en: {
            gitChangelogMarkdownSectionTitles: {
              changelog: 'Changelog Test',
              contributors: 'Contributors Test',
            },
          },
        },
      }, 'test content', '/some/dir/pages/en/index.md', helpers)

      expect(changelogTitle).toBe('Changelog Test')
      expect(contributorsTitle).toBe('Contributors Test')
    })
  })
})
