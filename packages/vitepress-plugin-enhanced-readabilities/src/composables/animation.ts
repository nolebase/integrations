import { useMounted } from '@vueuse/core'

export function useLayoutAppearanceChangeAnimation() {
  const mounted = useMounted()

  return {
    trigger: (animateElement: HTMLElement) => {
      animateElement.classList.add('VPNolebaseEnhancedReadabilitiesLayoutSwitchAnimated')
      setTimeout(() => {
        if (!(mounted.value && animateElement))
          return

        animateElement.classList.remove('VPNolebaseEnhancedReadabilitiesLayoutSwitchAnimated')
      }, 600)
    },
  }
}
