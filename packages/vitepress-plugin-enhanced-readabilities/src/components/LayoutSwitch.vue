<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue'
import { useLocalStorage, useMediaQuery, useMounted } from '@vueuse/core'

import { InjectionKey, LayoutMode, LayoutSwitchModeStorageKey, supportedLayoutModes } from '../constants'
import { useLayoutAppearanceChangeAnimation } from '../composables/animation'
import { useI18n } from '../composables/i18n'

import MenuOptions from './MenuOptions.vue'
import MenuTitle from './MenuTitle.vue'
import MenuHelp from './MenuHelp.vue'

const options = inject(InjectionKey, {})

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)
const disabled = ref(false)

const mounted = useMounted()
const isLargerThanMobile = useMediaQuery('(min-width: 768px)')
const layoutMode = useLocalStorage<LayoutMode>(LayoutSwitchModeStorageKey, options.layoutSwitch?.defaultMode || LayoutMode.Original)
const { t } = useI18n()
const { trigger: triggerAnimation } = useLayoutAppearanceChangeAnimation()

const fieldOptions = computed(() => [
  {
    value: LayoutMode.FullWidth,
    title: t('layoutSwitch.optionFullWidth'),
    ariaLabel: t('layoutSwitch.optionFullWidthAriaLabel'),
    icon: 'i-icon-park-outline:full-screen-one',
    name: 'VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox',
  },
  {
    value: LayoutMode.SidebarWidthAdjustableOnly,
    title: t('layoutSwitch.optionSidebarWidthAdjustableOnly'),
    ariaLabel: t('layoutSwitch.optionSidebarWidthAdjustableOnlyAriaLabel'),
    icon: 'i-icon-park-outline:full-screen-two',
    name: 'VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox',
  },
  {
    value: LayoutMode.BothWidthAdjustable,
    title: t('layoutSwitch.optionBothWidthAdjustable'),
    ariaLabel: t('layoutSwitch.optionBothWidthAdjustableAriaLabel'),
    icon: 'i-icon-park-outline:full-screen',
    name: 'VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox',
  },
  {
    value: LayoutMode.Original,
    title: t('layoutSwitch.optionOriginalWidth'),
    ariaLabel: t('layoutSwitch.optionOriginalWidthAriaLabel'),
    icon: 'i-icon-park-outline:off-screen',
    name: 'VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox',
  },
])

function setClasses(val: LayoutMode, animated: boolean) {
  switch (val) {
    case LayoutMode.FullWidth:
      animated && triggerAnimation(document.body)
      document.body.classList.add('VPNolebaseEnhancedReadabilitiesLayoutSwitchFullWidth')
      document.body.classList.remove('VPNolebaseEnhancedReadabilitiesLayoutSwitchSidebarWidthAdjustableOnly')
      document.body.classList.remove('VPNolebaseEnhancedReadabilitiesLayoutSwitchBothWidthAdjustable')
      break
    case LayoutMode.SidebarWidthAdjustableOnly:
      animated && triggerAnimation(document.body)
      document.body.classList.remove('VPNolebaseEnhancedReadabilitiesLayoutSwitchFullWidth')
      document.body.classList.add('VPNolebaseEnhancedReadabilitiesLayoutSwitchSidebarWidthAdjustableOnly')
      document.body.classList.remove('VPNolebaseEnhancedReadabilitiesLayoutSwitchBothWidthAdjustable')
      break
    case LayoutMode.BothWidthAdjustable:
      animated && triggerAnimation(document.body)
      document.body.classList.remove('VPNolebaseEnhancedReadabilitiesLayoutSwitchFullWidth')
      document.body.classList.remove('VPNolebaseEnhancedReadabilitiesLayoutSwitchSidebarWidthAdjustableOnly')
      document.body.classList.add('VPNolebaseEnhancedReadabilitiesLayoutSwitchBothWidthAdjustable')
      break
    case LayoutMode.Original:
      animated && triggerAnimation(document.body)
      document.body.classList.remove('VPNolebaseEnhancedReadabilitiesLayoutSwitchFullWidth')
      document.body.classList.remove('VPNolebaseEnhancedReadabilitiesLayoutSwitchSidebarWidthAdjustableOnly')
      document.body.classList.remove('VPNolebaseEnhancedReadabilitiesLayoutSwitchBothWidthAdjustable')
      break
  }
}

watch(mounted, (val) => {
  if (!val)
    return

  setClasses(layoutMode.value, false)
  if (!supportedLayoutModes.includes(layoutMode.value))
    layoutMode.value = options.layoutSwitch?.defaultMode || LayoutMode.BothWidthAdjustable
})

watch(layoutMode, (val) => {
  if (!mounted.value)
    return

  setClasses(val, true)
  if (!supportedLayoutModes.includes(val))
    layoutMode.value = options.layoutSwitch?.defaultMode || LayoutMode.BothWidthAdjustable
})

watch(isLargerThanMobile, () => {
  if (!isLargerThanMobile.value)
    disabled.value = true
})

onMounted(() => {
  if (!isLargerThanMobile.value)
    disabled.value = true
})
</script>

<template>
  <div space-y-2 role="radiogroup">
    <div ref="menuTitleElementRef" flex items-center>
      <MenuTitle
        icon="i-icon-park-outline:layout-one"
        :title="t('layoutSwitch.title')"
        :aria-label="t('layoutSwitch.titleArialLabel') || t('layoutSwitch.title')"
        flex="1"
        :disabled="disabled"
        pr-4
      />
      <MenuHelp
        v-if="!options.layoutSwitch?.disableHelp"
        v-model:is-popped-up="isMenuHelpPoppedUp"
        :menu-title-element-ref="menuTitleElementRef"
      >
        <h4 text-md mb-1 font-semibold>
          {{ t('layoutSwitch.title') }}
        </h4>
        <p text="sm" mb-2 max-w-100>
          <span>{{ t('layoutSwitch.titleHelpMessage') }}</span>
        </p>
        <div space-y-2 class="VPNolebaseEnhancedReadabilitiesMenu">
          <div text="sm" bg="$vp-nolebase-enhanced-readabilities-menu-background-color" max-w-100 rounded-xl p-3>
            <h5 text="sm" mb-1 flex="~" items-center align-middle>
              <span i-icon-park-outline:full-screen-one mr-1 />
              <span>{{ t('layoutSwitch.optionFullWidth') }}</span>
            </h5>
            <span>{{ t('layoutSwitch.optionFullWidthHelpMessage') }}</span>
          </div>
          <div text="sm" bg="$vp-nolebase-enhanced-readabilities-menu-background-color" max-w-100 rounded-xl p-3>
            <h5 text="sm" mb-1 flex="~" items-center align-middle>
              <span i-icon-park-outline:full-screen-two mr-1 />
              <span>{{ t('layoutSwitch.optionSidebarWidthAdjustableOnly') }}</span>
            </h5>
            <span>{{ t('layoutSwitch.optionSidebarWidthAdjustableOnlyHelpMessage') }}</span>
          </div>
          <div text="sm" bg="$vp-nolebase-enhanced-readabilities-menu-background-color" max-w-100 rounded-xl p-3>
            <h5 text="sm" mb-1 flex="~" items-center align-middle>
              <span i-icon-park-outline:full-screen mr-1 />
              <span>{{ t('layoutSwitch.optionBothWidthAdjustable') }}</span>
            </h5>
            <span>{{ t('layoutSwitch.optionBothWidthAdjustableHelpMessage') }}</span>
          </div>
          <div text="sm" bg="$vp-nolebase-enhanced-readabilities-menu-background-color" max-w-100 rounded-xl p-3>
            <h5 text="sm" mb-1 flex="~" items-center align-middle>
              <span i-icon-park-outline:off-screen mr-1 />
              <span>{{ t('layoutSwitch.optionOriginalWidth') }}</span>
            </h5>
            <span>{{ t('layoutSwitch.optionOriginalWidthHelpMessage') }}</span>
          </div>
        </div>
      </MenuHelp>
    </div>
    <MenuOptions
      v-model="layoutMode"
      outline="transparent 2px offset-4px dashed"
      transition="outline duration-200 ease"
      :class="{
        'outline-$vp-c-brand-1!': isMenuHelpPoppedUp,
      }"
      :options="fieldOptions"
      :disabled="disabled"
    />
  </div>
</template>

<style less>
.VPNolebaseEnhancedReadabilitiesLayoutSwitchAnimated {
  .VPNavBar.has-sidebar > .container > .title {
    transition: width 0.5s ease-in-out, padding-left 0.5s ease-in-out;
  }

  .VPNavBar > .container {
    transition: width 0.5s ease-in-out, max-width 0.5s ease-in-out;
  }

  .VPNavBar.has-sidebar > .container > .content {
    transition: padding-right 0.5s ease-in-out, padding-left 0.5s ease-in-out;
  }

  .VPSidebar {
    transition: width 0.5s ease-in-out, padding-left 0.5s ease-in-out;
  }

  .VPContent.has-sidebar {
    transition: width 0.5s ease-in-out, padding-left 0.5s ease-in-out, padding-right 0.5s ease-in-out;
  }

  .VPDoc .container {
    transition: width 0.5s ease-in-out, max-width 0.5s ease-in-out;
  }

  .VPDoc.has-aside .content-container {
    transition: width 0.5s ease-in-out, max-width 0.5s ease-in-out;
  }

  .VPDoc:not(.has-sidebar) .container {
    transition: width 0.5s ease-in-out, max-width 0.5s ease-in-out;
  }

  .VPDoc:not(.has-sidebar) .container > .content {
    transition: width 0.5s ease-in-out, max-width 0.5s ease-in-out;
  }
}

:root {
  --vp-nolebase-enhanced-readabilities-page-max-width: 100%;
  --vp-nolebase-enhanced-readabilities-content-max-width: 100%;
  --vp-nolebase-enhanced-readabilities-full-width-max-width: 100%;
}

.VPNolebaseEnhancedReadabilitiesLayoutSwitchFullWidth {
  @media (min-width: 1280px) {
    /* Overriding styles of navbar section */
    .VPNavBar.has-sidebar > .container > .title {
      padding-left: max(32px, calc((100% - (var(--vp-nolebase-enhanced-readabilities-full-width-max-width) - 64px)) / 2)) !important;
      width: calc((100% - (var(--vp-nolebase-enhanced-readabilities-full-width-max-width) - 64px)) / 2 + var(--vp-sidebar-width) - 32px) !important;
    }

    .VPNavBar > .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-full-width-max-width);
    }

    .VPNavBar.has-sidebar > .container > .content {
      padding-right: calc((100vw - var(--vp-nolebase-enhanced-readabilities-full-width-max-width)) / 2 + 32px) !important;
      padding-left: calc((100vw - var(--vp-nolebase-enhanced-readabilities-full-width-max-width)) / 2 + var(--vp-sidebar-width)) !important;
    }

    .VPNavBar.has-sidebar .curtain {
      width: calc(100% - ((100vw - var(--vp-nolebase-enhanced-readabilities-full-width-max-width)) / 2 + var(--vp-sidebar-width)));
    }

    /* Overriding styles of sidebar section */
    .VPSidebar {
      padding-left: max(32px, calc((100% - (var(--vp-nolebase-enhanced-readabilities-full-width-max-width) - 64px)) / 2)) !important;
      width: calc((100% - (var(--vp-nolebase-enhanced-readabilities-full-width-max-width) - 64px)) / 2 + var(--vp-sidebar-width) - 32px) !important;
    }

    /* Overriding styles of document section */
    .VPContent.has-sidebar {
      padding-right: calc((100vw - var(--vp-nolebase-enhanced-readabilities-full-width-max-width)) / 2) !important;
      padding-left: calc((100vw - var(--vp-nolebase-enhanced-readabilities-full-width-max-width)) / 2 + var(--vp-sidebar-width)) !important;
    }

    .VPDoc.has-aside .content-container {
      max-width: var(--vp-nolebase-enhanced-readabilities-full-width-max-width);
    }

    .VPDoc:not(.has-sidebar) .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-full-width-max-width);
    }

    .VPDoc:not(.has-sidebar) .container > .content {
      max-width: var(--vp-nolebase-enhanced-readabilities-full-width-max-width);
    }
  }

  @media (min-width: 1440px) {
    .VPNavBar.has-sidebar .curtain {
      width: calc(100% - ((100vw - var(--vp-nolebase-enhanced-readabilities-full-width-max-width)) / 2 + var(--vp-sidebar-width)));
    }
  }

  @media (min-width: 1536px) {
    .VPDoc .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-full-width-max-width);
    }
  }
}

.VPNolebaseEnhancedReadabilitiesLayoutSwitchSidebarWidthAdjustableOnly {
  @media (min-width: 1280px) {
    /* Overriding styles of navbar section */
    .VPNavBar.has-sidebar > .container > .title {
      padding-left: max(32px, calc((100% - (var(--vp-nolebase-enhanced-readabilities-page-max-width) - 64px)) / 2)) !important;
      width: calc((100% - (var(--vp-nolebase-enhanced-readabilities-page-max-width) - 64px)) / 2 + var(--vp-sidebar-width) - 32px) !important;
    }

    .VPNavBar > .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-page-max-width);
    }

    .VPNavBar.has-sidebar > .container > .content {
      padding-right: calc((100vw - var(--vp-nolebase-enhanced-readabilities-page-max-width)) / 2 + 32px) !important;
      padding-left: calc((100vw - var(--vp-nolebase-enhanced-readabilities-page-max-width)) / 2 + var(--vp-sidebar-width)) !important;
    }

    /* Overriding styles of sidebar section */
    .VPSidebar {
      padding-left: max(32px, calc((100% - (var(--vp-nolebase-enhanced-readabilities-page-max-width) - 64px)) / 2)) !important;
      width: calc((100% - (var(--vp-nolebase-enhanced-readabilities-page-max-width) - 64px)) / 2 + var(--vp-sidebar-width) - 32px) !important;
    }
  }

  @media (min-width: 1440px) {
    .VPNavBar.has-sidebar .curtain {
      width: calc(100% - ((100vw - var(--vp-nolebase-enhanced-readabilities-page-max-width)) / 2 + var(--vp-sidebar-width)));
    }
  }

  @media (min-width: 1440px) {
    .VPContent.has-sidebar {
      padding-right: calc((100vw - var(--vp-nolebase-enhanced-readabilities-content-max-width)) / 2);
      padding-left: calc((100vw - var(--vp-nolebase-enhanced-readabilities-content-max-width)) / 2 + var(--vp-sidebar-width));
    }
  }
}

.VPNolebaseEnhancedReadabilitiesLayoutSwitchBothWidthAdjustable {
  @media (min-width: 1280px) {
    /* Overriding styles of navbar section */
    .VPNavBar.has-sidebar > .container > .title {
      padding-left: max(32px, calc((100% - (var(--vp-nolebase-enhanced-readabilities-page-max-width) - 64px)) / 2)) !important;
      width: calc((100% - (var(--vp-nolebase-enhanced-readabilities-page-max-width) - 64px)) / 2 + var(--vp-sidebar-width) - 32px) !important;
    }

    .VPNavBar > .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-page-max-width);
    }

    .VPNavBar.has-sidebar > .container > .content {
      padding-right: calc((100vw - var(--vp-nolebase-enhanced-readabilities-page-max-width)) / 2 + 32px) !important;
      padding-left: calc((100vw - var(--vp-nolebase-enhanced-readabilities-page-max-width)) / 2 + var(--vp-sidebar-width)) !important;
    }

    /* Overriding styles of sidebar section */
    .VPSidebar {
      padding-left: max(32px, calc((100% - (var(--vp-nolebase-enhanced-readabilities-page-max-width) - 64px)) / 2)) !important;
      width: calc((100% - (var(--vp-nolebase-enhanced-readabilities-page-max-width) - 64px)) / 2 + var(--vp-sidebar-width) - 32px) !important;
    }

    .VPDoc.has-aside .content-container {
      max-width: var(--vp-nolebase-enhanced-readabilities-content-max-width);
    }

    .VPDoc:not(.has-sidebar) .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-content-max-width);
    }

    .VPDoc:not(.has-sidebar) .container > .content {
      max-width: var(--vp-nolebase-enhanced-readabilities-content-max-width);
    }
  }

  @media (min-width: 1440px) {
    .VPNavBar.has-sidebar .curtain {
      width: calc(100% - ((100vw - var(--vp-nolebase-enhanced-readabilities-page-max-width)) / 2 + var(--vp-sidebar-width)));
    }
  }

  @media (min-width: 1440px) {
    .VPContent.has-sidebar {
      padding-right: calc((100vw - var(--vp-nolebase-enhanced-readabilities-content-max-width)) / 2);
      padding-left: calc((100vw - var(--vp-nolebase-enhanced-readabilities-content-max-width)) / 2 + var(--vp-sidebar-width));
    }
  }

  @media (min-width: 1536px) {
    .VPDoc .container {
      max-width: var(--vp-nolebase-enhanced-readabilities-content-max-width);
    }
  }
}
</style>
