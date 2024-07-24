import { computed, ref, toValue } from 'vue'

import { useData } from 'vitepress'

import changelog from 'virtual:nolebase-git-changelog'
import type { Changelog, Commit, CommitAuthor } from '../../types'
import { isStringArray } from '../utils'

export interface AuthorInfo extends CommitAuthor {
  commitsCount: number
}

export function useChangelog() {
  const { page } = useData()

  const gitChangelog = ref<Changelog>(changelog)
  if (!gitChangelog.value)
    gitChangelog.value = { commits: [], authors: [] }

  const commits = computed<Commit[]>(() => {
    const currentPath = toValue(page.value.filePath)

    const allCommits = gitChangelog.value.commits
    // filter the commits that either have a tag, or directly equal the current path, or renamed to the current path
    const commits = allCommits.filter(c => c.paths.includes(currentPath)) || []

    return commits.filter((commit, index) => {
      if (commit.tag && (!commits[index + 1] || commits[index + 1]?.tag))
        return false

      return true
    })
  })

  const authors = computed<AuthorInfo[]>(() => {
    const uniq = new Map<string, AuthorInfo>()

    const authorsFromFrontMatter: string[] = isStringArray(page.value.frontmatter.authors)
      ? page.value.frontmatter.authors
      : [];

    [...commits.value.map(c => c.authors), ...authorsFromFrontMatter]
      .flat()
      .map((name) => {
        if (!uniq.has(name)) {
          uniq.set(name, {
            name,
            commitsCount: 1,
          })
          return true
        }
        else {
          uniq.get(name)!.commitsCount++
          return false
        }
      })

    return Array.from(uniq.values())
      .sort((a, b) => b.commitsCount - a.commitsCount)
      .map((a) => {
        return {
          ...a,
          ...gitChangelog.value.authors.find(item => item.name === a.name) ?? {
            // a avatarUrl fallback for authors in frontmatter
            avatarUrl: `https://gravatar.com/avatar/${a.name}?d=retro`,
          },
        }
      })
  })

  const getAuthorsForOneCommit = (commit: Commit) => {
    return commit.authors.map((name) => {
      return authors.value.find(a => a.name === name)!
    })
  }

  const update = (data: Changelog) => {
    gitChangelog.value = data
  }

  const useHmr = () => {
    if (import.meta.hot) {
      import.meta.hot.send('nolebase-git-changelog:client-mounted', {
        page: {
          filePath: page.value.filePath,
        },
      })

      // Plugin API | Vite
      // https://vitejs.dev/guide/api-plugin.html#handlehotupdate
      import.meta.hot.on('nolebase-git-changelog:updated', (data) => {
        if (!data || typeof data !== 'object')
          return

        if (data)
          update(data)
      })

      // HMR API | Vite
      // https://vitejs.dev/guide/api-hmr.html
      import.meta.hot.accept('virtual:nolebase-git-changelog', (newModule) => {
        if (!newModule)
          return
        if (!('default' in newModule))
          return
        if (!newModule.default || typeof newModule.default !== 'object')
          return

        if (newModule.default)
          update(newModule.default)
      })
    }
  }

  return {
    commits,
    authors,
    useHmr,
    getAuthorsForOneCommit,
  }
}
