import { computed } from 'vue'

export function useInIframe() {
  return {
    livesInIframe: computed<boolean>(() => {
      try {
        return window.self !== window.top && window.top !== undefined && window.top !== null && 'location' in window.top
      }
      catch {
        return false
      }
    }),
  }
}
