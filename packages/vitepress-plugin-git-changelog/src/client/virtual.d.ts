declare module 'virtual:nolebase-git-changelog' {
  import type Commit from '../types'

  export type { Commit }

  interface Changelog {
    commits: Commit[]
  }

  const changelog: Changelog
  export default changelog
}
