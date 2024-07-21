import { type Ref, computed, ref, toValue } from 'vue'

import type { PageData } from 'vitepress'
import changelog from 'virtual:nolebase-git-changelog'
import type { Changelog, Commit, CommitAuthor } from '../../types'

export interface AuthorInfo extends CommitAuthor {
  commitsCount: number
}

export function useChangelog(pageData: Ref<PageData>) {
  const gitChangelog = ref<Changelog>(changelog)
  if (!gitChangelog.value)
    gitChangelog.value = { commits: [], authors: [] }

  const commits = computed<Commit[]>(() => {
    const currentPath = toValue(pageData.value.filePath)

    const allCommits = gitChangelog.value.commits
    // filter the commits that either have a tag, or directly equal the current path, or renamed to the current path
    const commits = allCommits.filter(c => c.paths.includes(currentPath)) || []

    return commits.filter((commit, index) => {
      if (commit.tag && (!commits[index + 1] || commits[index + 1]?.tag))
        return false

      return true
    })
  })

  const authors = computed(() => {
    const uniq = new Map<string, AuthorInfo>()

    commits.value.map(c => c.authors)
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
      .sort((a, b) => a.commitsCount - b.commitsCount)
      .map((a) => {
        return {
          ...a,
          ...gitChangelog.value.authors.find(item => item.name === a.name),

        }
      })
  })

  return {
    commits,
    authors,
    update(data: Changelog) {
      gitChangelog.value = data
    },
  }
}
