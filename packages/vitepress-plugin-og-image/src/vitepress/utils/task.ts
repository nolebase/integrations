// vitepress/src/node/utils/task.ts at df8753bd927c2b57b9188fb292c1429e9c3c8ab6 · vuejs/vitepress
// https://github.com/vuejs/vitepress/blob/df8753bd927c2b57b9188fb292c1429e9c3c8ab6/src/node/utils/task.ts

import type { SiteConfig } from 'vitepress'

import { relative } from 'node:path'

import ora from 'ora'

import { cyan, gray, green, red, yellow } from 'colorette'

interface TaskResultSuccess {
  status: 'success'
  filePath: string
}

interface TaskResultSkipped {
  status: 'skipped'
  reason: string
  filePath: string
}

interface TaskResultErrored {
  status: 'errored'
  reason: string
  filePath: string
}

export type TaskResult = TaskResultSuccess | TaskResultSkipped | TaskResultErrored

export const okMark = green('✓')
export const failMark = red('✖')

export async function task(taskName: string, task: () => Promise<string | undefined>) {
  const startsAt = Date.now()

  const moduleNamePrefix = cyan('@nolebase/vitepress-plugin-og-image')
  const grayPrefix = gray(':')
  const spinnerPrefix = `${moduleNamePrefix}${grayPrefix}`

  const spinner = ora({ discardStdin: false })
  spinner.start(`${spinnerPrefix} ${taskName}...`)

  let result: string | undefined

  try {
    result = await task()
  }
  catch (e) {
    spinner.stopAndPersist({ symbol: failMark })
    throw e
  }

  const elapsed = Date.now() - startsAt
  const suffixText = `${gray(`(${elapsed}ms)`)} ${result || ''}`

  spinner.stopAndPersist({ symbol: okMark, suffixText })
}

export function renderTaskResultsSummary(results: TaskResult[], siteConfig: SiteConfig) {
  const successCount = results.filter(item => item.status === 'success') as TaskResultSuccess[]
  const skippedCount = results.filter(item => item.status === 'skipped') as TaskResultSkipped[]
  const erroredCount = results.filter(item => item.status === 'errored') as TaskResultErrored[]

  const stats = `${green(`${successCount.length} generated`)}, ${yellow(`${skippedCount.length} skipped`)}, ${red(`${erroredCount.length} errored`)}`
  const skippedList = ` - ${yellow('Following files were skipped')}:\n\n${skippedCount.map((item) => {
    return gray(`    - ${relative(siteConfig.root, item.filePath)}: ${item.reason}`)
  }).join('\n')}`
  const erroredList = ` - ${red('Following files encountered errors')}\n\n${erroredCount.map((item) => {
    return gray(`    - ${relative(siteConfig.root, item.filePath)}: ${item.reason}`)
  }).join('\n')}`

  const overallResults = [stats]

  if (skippedCount.length > 0)
    overallResults.push(skippedList)
  if (erroredCount.length > 0)
    overallResults.push(erroredList)

  return overallResults.join('\n\n')
}
