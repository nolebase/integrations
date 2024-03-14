// vitepress/src/node/utils/task.ts at df8753bd927c2b57b9188fb292c1429e9c3c8ab6 · vuejs/vitepress
// https://github.com/vuejs/vitepress/blob/df8753bd927c2b57b9188fb292c1429e9c3c8ab6/src/node/utils/task.ts

import ora from 'ora'
import { green, red } from 'colorette'

export const okMark = green('✓')
export const failMark = red('✖')

export async function task(taskName: string, task: () => Promise<string | undefined>) {
  const spinner = ora({ discardStdin: false })
  spinner.start(`${taskName}...`)

  let result: string | undefined

  try {
    result = await task()
  }
  catch (e) {
    spinner.stopAndPersist({ symbol: failMark })
    throw e
  }

  spinner.stopAndPersist({ symbol: okMark, suffixText: result ?? '' })
}
