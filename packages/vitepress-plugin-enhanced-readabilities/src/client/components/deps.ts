// eslint-disable-next-line ts/ban-ts-comment
// @ts-nocheck - VitePress doesn't have types for its internal components

import _VPFlyout from 'vitepress/dist/client/theme-default/components/VPFlyout.vue'

// Isolate the types of Vitepress internal components to avoid typecheck errors
export const VPFlyout: any = _VPFlyout
