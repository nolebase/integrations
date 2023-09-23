import type { InjectionKey as VueInjectionKey } from 'vue'

import type { Options } from './types'

export const InjectionKey: VueInjectionKey<Options> = Symbol('VPNolebaseInlineLinkPreview')
export const ComponentName = 'VPNolebaseInlineLinkPreview'

export const defaultLinkPreviewPopupOptions: Options = {
  popupWidth: 600,
  popupHeight: 480,
  previewLocalHostName: true,
  selectorsToBeHided: ['.VPNav', '.VPFooter', '.VPLocalNav', '.VPSidebar', '.VPDocFooter > .prev-next'],
  popupTeleportTargetSelector: 'body',
}
