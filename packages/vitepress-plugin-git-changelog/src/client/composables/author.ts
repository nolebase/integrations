import { type Ref, computed, ref } from 'vue'
import Changelog from 'virtual:nolebase-git-changelog'
import type { Commit, CommitAuthor } from '../../types'

export interface AuthorInfo extends CommitAuthor {
  commitsCount: number
}

export function useAuthors(commits: Ref<Commit[]>) {
  const changelog = ref<{ authors: CommitAuthor[] }>(Changelog)
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
          ...changelog.value.authors.find(item => item.name === a.name),

        }
      })
  })

  return {
    authors,
  }
}
