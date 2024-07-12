import { type Ref, computed, ref, toValue } from 'vue'

import type { PageData } from 'vitepress'
import Changelog from 'virtual:nolebase-git-changelog'
import type { Commit } from '../../types'

export function useCommits(pageData: Ref<PageData>) {
  const gitChangelog = ref<{ commits: Commit[] }>(Changelog)
  if (!gitChangelog.value)
    gitChangelog.value = { commits: [] }

  return {
    commits: computed<Commit[]>(() => {
      const currentPath = toValue(pageData.value.filePath)

      const preCommits = gitChangelog.value.commits
      // filter the commits that either have a tag, or directly equal the current path, or renamed to the current path
      const commits = preCommits.filter(c => c.path === currentPath) || []

      return commits.filter((commit, index) => {
        if (commit.tag && (!commits[index + 1] || commits[index + 1]?.tag))
          return false

        return true
      })
    }),
    update(data: Commit[]) {
      gitChangelog.value = { commits: data }
    },
  }
}
