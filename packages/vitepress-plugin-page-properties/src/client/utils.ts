import { formatDistanceToNow, formatDuration, toDate } from 'date-fns'
import * as DateFnsLocales from 'date-fns/locale'

export function formatDistanceToNowFromValue(value: string | number | Date, localeName = 'enUS') {
  try {
    return formatDistanceToNow(toDate(value), {
      locale: DateFnsLocales[localeName] || 'enUS',
      addSuffix: true,
    })
  }
  catch {
    return value
  }
}

export function formatDurationFromValue(value: number, localeName = 'enUS') {
  const parsedValue = Number.parseInt(String(value))

  try {
    return formatDuration({
      minutes: Number.isNaN(parsedValue) ? 0 : parsedValue,
    }, {
      locale: DateFnsLocales[localeName] || 'enUS',
    })
  }
  catch {
    return value
  }
}
