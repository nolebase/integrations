import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

import type { Commit } from '../../types'

export function useCommits(allCommits: Commit[], path: MaybeRefOrGetter<string>) {
  return computed<Commit[]>(() => {
    let currentPath = toValue(path)

    // filter the commits that either have a tag, or directly equal the current path, or renamed to the current path
    const commits = allCommits.filter((c) => {
      return c.tag || c.path?.find((p) => {
        const action = p[0]
        const path1 = p[1]?.toLowerCase()
        const path2 = p[2]?.toLowerCase()

        const res = currentPath === path1 || currentPath === path2
        if (res && action.startsWith('R'))
          currentPath = path1

        return res
      })
    })

    return commits.filter((i, idx) => {
      if (i.tag && (!commits[idx + 1] || commits[idx + 1]?.tag))
        return false

      return true
    })
  })
}
