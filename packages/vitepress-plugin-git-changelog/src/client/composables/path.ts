import { computed } from 'vue'
import { useRoute } from 'vitepress'

export function useRawPath() {
  const route = useRoute()

  return computed(() => {
    let path = decodeURIComponent(route.path).toLowerCase()
    if (path.startsWith('/'))
      path = path.slice(1)

    if (path.endsWith('/'))
      path += 'index.md'
    else
      path = path.replace(/^(.+?)(\.html)?$/s, '$1.md')

    return path.toLowerCase()
  })
}
