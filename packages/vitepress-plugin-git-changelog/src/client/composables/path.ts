import { useData } from 'vitepress'

export function useRawPath() {
  return useData().page.value.filePath
}
