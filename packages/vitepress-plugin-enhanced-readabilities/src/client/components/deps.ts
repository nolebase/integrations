import { defineAsyncComponent } from 'vue'

const _VPFlyout = defineAsyncComponent(() => import('vitepress/dist/client/theme-default/components/VPFlyout.vue'));
// Isolate the types of Vitepress internal components to avoid typecheck errors
export const VPFlyout: any = _VPFlyout
