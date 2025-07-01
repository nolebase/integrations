import { describe, expect, it } from 'vitest'

import { mergeSidebar } from './sidebar'

describe('processSidebar', () => {
  it('should process sidebar correctly', () => {
    const sidebar = mergeSidebar(
      [
        'Note',
        { folderName: 'Catalog', separate: true },
        'Cards',
      ],
      [
        'Note/index.md',
        'Note/Folder 1/index.md',
        'Note/Folder 1/Note 1.md',
        'Note/Folder 2/index.md',
        'Note/Folder 2/Note 2.md',
        'Catalog/index.md',
        'Catalog/Folder 1/index.md',
        'Catalog/Folder 1/Catalog 1.md',
        'Catalog/Folder 2/index.md',
        'Catalog/Folder 2/Catalog 2.md',
        'Cards/index.md',
        'Cards/Folder 1/index.md',
        'Cards/Folder 1/Card 1.md',
        'Cards/Folder 2/index.md',
        'Cards/Folder 2/Card 1.md',
        'Cards/Folder 2/Card 2.md',
      ],
    )
    expect(sidebar).toMatchObject({
      '/': [
        {
          collapsed: true,
          text: 'Cards',
          index: 'Cards',
          link: '/Cards/index',
          items: [
            {
              collapsed: true,
              index: 'Folder 1',
              text: 'Folder 1',
              link: '/Cards/Folder 1/index',
              items: [
                {
                  index: 'Card 1',
                  text: 'Card 1',
                  link: '/Cards/Folder 1/Card 1',
                },
              ],
            },
            {
              collapsed: true,
              index: 'Folder 2',
              text: 'Folder 2',
              link: '/Cards/Folder 2/index',
              items: [
                {
                  index: 'Card 1',
                  text: 'Card 1',
                  link: '/Cards/Folder 2/Card 1',
                },
                {
                  index: 'Card 2',
                  text: 'Card 2',
                  link: '/Cards/Folder 2/Card 2',
                },
              ],
            },
          ],
        },
        {
          collapsed: true,
          index: 'Note',
          text: 'Note',
          link: '/Note/index',
          items: [
            {
              collapsed: true,
              index: 'Folder 1',
              text: 'Folder 1',
              link: '/Note/Folder 1/index',
              items: [
                {
                  index: 'Note 1',
                  text: 'Note 1',
                  link: '/Note/Folder 1/Note 1',
                },
              ],
            },
            {
              collapsed: true,
              index: 'Folder 2',
              text: 'Folder 2',
              link: '/Note/Folder 2/index',
              items: [
                {
                  index: 'Note 2',
                  text: 'Note 2',
                  link: '/Note/Folder 2/Note 2',
                },
              ],
            },
          ],
        },
      ],
      '/Catalog/': [
        {
          collapsed: true,
          index: 'Folder 1',
          text: 'Folder 1',
          link: '/Catalog/Folder 1/index',
          items: [
            {
              index: 'Catalog 1',
              text: 'Catalog 1',
              link: '/Catalog/Folder 1/Catalog 1',
            },
          ],
        },
        {
          collapsed: true,
          index: 'Folder 2',
          text: 'Folder 2',
          link: '/Catalog/Folder 2/index',
          items: [
            {
              index: 'Catalog 2',
              text: 'Catalog 2',
              link: '/Catalog/Folder 2/Catalog 2',
            },
          ],
        },
      ],
    })
  })

  it('should process sidebar correctly with base', () => {
    const sidebar = mergeSidebar(
      [
        'en/Note',
        { folderName: 'en/Catalog', separate: true },
        'en/Cards',
      ],
      [
        'en/Note/index.md',
        'en/Note/Folder 1/index.md',
        'en/Note/Folder 1/Note 1.md',
        'en/Note/Folder 2/index.md',
        'en/Note/Folder 2/Note 2.md',
        'en/Catalog/index.md',
        'en/Catalog/Folder 1/index.md',
        'en/Catalog/Folder 1/Catalog 1.md',
        'en/Catalog/Folder 2/index.md',
        'en/Catalog/Folder 2/Catalog 2.md',
        'en/Cards/index.md',
        'en/Cards/Folder 1/index.md',
        'en/Cards/Folder 1/Card 1.md',
        'en/Cards/Folder 2/index.md',
        'en/Cards/Folder 2/Card 1.md',
        'en/Cards/Folder 2/Card 2.md',
      ],
      'en',
    )
    expect(sidebar).toMatchObject({
      '/en/': [
        {
          collapsed: true,
          text: 'Cards',
          index: 'Cards',
          link: '/en/Cards/index',
          items: [
            {
              collapsed: true,
              index: 'Folder 1',
              text: 'Folder 1',
              link: '/en/Cards/Folder 1/index',
              items: [
                {
                  index: 'Card 1',
                  text: 'Card 1',
                  link: '/en/Cards/Folder 1/Card 1',
                },
              ],
            },
            {
              collapsed: true,
              index: 'Folder 2',
              text: 'Folder 2',
              link: '/en/Cards/Folder 2/index',
              items: [
                {
                  index: 'Card 1',
                  text: 'Card 1',
                  link: '/en/Cards/Folder 2/Card 1',
                },
                {
                  index: 'Card 2',
                  text: 'Card 2',
                  link: '/en/Cards/Folder 2/Card 2',
                },
              ],
            },
          ],
        },
        {
          collapsed: true,
          index: 'Note',
          text: 'Note',
          link: '/en/Note/index',
          items: [
            {
              collapsed: true,
              index: 'Folder 1',
              text: 'Folder 1',
              link: '/en/Note/Folder 1/index',
              items: [
                {
                  index: 'Note 1',
                  text: 'Note 1',
                  link: '/en/Note/Folder 1/Note 1',
                },
              ],
            },
            {
              collapsed: true,
              index: 'Folder 2',
              text: 'Folder 2',
              link: '/en/Note/Folder 2/index',
              items: [
                {
                  index: 'Note 2',
                  text: 'Note 2',
                  link: '/en/Note/Folder 2/Note 2',
                },
              ],
            },
          ],
        },
      ],
      '/en/Catalog/': [
        {
          collapsed: true,
          index: 'Folder 1',
          text: 'Folder 1',
          link: '/en/Catalog/Folder 1/index',
          items: [
            {
              index: 'Catalog 1',
              text: 'Catalog 1',
              link: '/en/Catalog/Folder 1/Catalog 1',
            },
          ],
        },
        {
          collapsed: true,
          index: 'Folder 2',
          text: 'Folder 2',
          link: '/en/Catalog/Folder 2/index',
          items: [
            {
              index: 'Catalog 2',
              text: 'Catalog 2',
              link: '/en/Catalog/Folder 2/Catalog 2',
            },
          ],
        },
      ],
    })
  })
})
