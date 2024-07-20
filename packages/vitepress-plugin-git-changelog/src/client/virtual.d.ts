declare module 'virtual:nolebase-git-changelog' {
  import type { Changelog, Commit } from '../types'

  export type { Commit }

  const changelog: Changelog
  export default changelog
}
