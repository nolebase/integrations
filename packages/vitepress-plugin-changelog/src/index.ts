import type { Plugin } from 'vite'
import simpleGit from 'simple-git'
import type { SimpleGit } from 'simple-git'
import md5 from 'md5'
import type { CommitInfo, ContributorInfo } from './types'

let changeLogs: CommitInfo[] | undefined
let git: SimpleGit

const VirtualModuleID = 'virtual:nolebase-changelog'
const ResolvedVirtualModuleId = `\0${VirtualModuleID}`

export function ChangeLog({
  maxGitLogCount = 200,
  rootDir = 'docs',
  include = [],
} = {}): Plugin {
  return {
    name: '@nolebase/vitepress-plugin-changelog',
    resolveId(id) {
      if (id === VirtualModuleID)
        return ResolvedVirtualModuleId
    },
    load(id) {
      if (id !== ResolvedVirtualModuleId)
        return null

      return `export default ${JSON.stringify(changeLogs)}`
    },

    async buildStart() {
      if (changeLogs)
        return
      git ??= simpleGit({
        maxConcurrentProcesses: 200,
      })

      // 设置 git 正常展示中文路径
      await git.raw(['config', '--global', 'core.quotepath', 'false'])

      const logs = (await git.log({ maxCount: maxGitLogCount })).all as CommitInfo[]

      for (const log of logs) {
        /** 发版日志 */
        if (log.message.includes('release: ')) {
          log.version = log.message.split(' ')[1].trim()
          continue
        }

        /**
         * get change log of each file
         */
        // const raw = await git.raw(['diff-tree', '--no-commit-id', '--name-only', '-r', log.hash])
        const raw = await git.raw(['diff-tree', '--no-commit-id', '--name-status', '-r', '-M', log.hash])
        delete log.body

        const files = raw
          .replace(/\\/g, '/')
          .trim()
          .split('\n')
          .map(str => str.split('\t'))

        log.path = Array.from(new Set(
          files
            .filter(i => !!i[1]?.match(RegExp(`^${rootDir ? `${rootDir}\\/` : ''}(${include.join('|')})\\/.+\\.md$`))?.[0]),
        ))

        log.authorAvatar = md5(log.author_email) as string
      }

      const result = logs.filter(i => i.path?.length || i.version)
      changeLogs = result
    },
  }
}

export async function getContributorsAt(path: string) {
  try {
    const list = (await git.raw(['log', '--pretty=format:"%an|%ae"', '--', path]))
      .split('\n')
      .map(i => i
        .slice(1, -1)
        .split('|') as [string, string],
      )
    const map: Record<string, ContributorInfo> = {}

    list
      .filter(i => i[1])
      .forEach((i) => {
        if (!map[i[1]]) {
          map[i[1]] = {
            name: i[0],
            count: 0,
            hash: md5(i[1]) as string,
          }
        }
        map[i[1]].count++
      })

    return Object.values(map).sort((a, b) => b.count - a.count)
  }
  catch (e) {
    console.error(e)
    return []
  }
}
