import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

import type { Commit } from '../../types'

export function useCommits(allCommits: Commit[], path: MaybeRefOrGetter<string>) {
  return computed<Commit[]>(() => {
    const currentPath = toValue(path)

    // filter the commits that either have a tag, or directly equal the current path, or renamed to the current path
    const commits = allCommits.filter(c => c.path === currentPath) || []

    return commits.filter((commit, index) => {
      if (commit.tag && (!commits[index + 1] || commits[index + 1]?.tag))
        return false

      return true
    })
  })
}
