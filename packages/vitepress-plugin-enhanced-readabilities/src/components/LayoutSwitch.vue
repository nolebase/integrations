<script setup lang="ts">
import { onMounted, ref, watch, inject } from 'vue'
import { useLocalStorage, useMediaQuery, useMounted } from '@vueuse/core'

import { InjectionKey, LayoutSwitchModeStorageKey, LayoutMode, supportedLayoutModes } from '../constants'
import { useLayoutAppearanceChangeAnimation } from '../composables/animation'
import { useI18n } from '../composables/i18n'

import MenuOption from './MenuOption.vue'
import MenuTitle from './MenuTitle.vue'
import MenuHelp from './MenuHelp.vue'

const options = inject(InjectionKey, {})

const menuTitleElementRef = ref<HTMLDivElement>()
const isMenuHelpPoppedUp = ref(false)
const disabled = ref(false)

const mounted = useMounted()
const isLargerThanMobile = useMediaQuery('(min-width: 768px)')
const layoutMode = useLocalStorage(LayoutSwitchModeStorageKey, options.layoutSwitch?.defaultMode || LayoutMode.BothWidthAdjustable)
const { t } = useI18n()
const { trigger: triggerAnimation } = useLayoutAppearanceChangeAnimation()

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
  if (!supportedLayoutModes.includes(layoutMode.value)) {
    layoutMode.value = options.layoutSwitch?.defaultMode || LayoutMode.BothWidthAdjustable
  }
})

watch(layoutMode, (val) => {
  if (!mounted.value)
    return

  setClasses(val, true)
  if (!supportedLayoutModes.includes(val)) {
    layoutMode.value = options.layoutSwitch?.defaultMode || LayoutMode.BothWidthAdjustable
  }
})

watch(isLargerThanMobile, () => {
  if (!isLargerThanMobile.value) {
    disabled.value = true
  }
})

onMounted(() => {
  if (!isLargerThanMobile.value) {
    disabled.value = true
  }
})
</script>

<template>
  <div space-y-2 role="radiogroup">
    <div flex items-center ref="menuTitleElementRef">
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
        :menu-title-element-ref="menuTitleElementRef"
        v-model:is-popped-up="isMenuHelpPoppedUp"
      >
        <h4 text-md font-semibold mb-1>
          {{ t('layoutSwitch.title') }}
        </h4>
        <p max-w-100 text="sm" mb-2>
          <span>{{ t('layoutSwitch.titleHelpMessage') }}</span>
        </p>
        <div space-y-2 class="VPNolebaseEnhancedReadabilitiesMenu">
          <p max-w-100 text="sm" bg="$vp-nolebase-enhanced-readabilities-menu-background-color" p-3 rounded-xl>
            <h5 text="sm" mb-1 flex="~" items-center align-middle>
              <span i-icon-park-outline:full-screen-one mr-1 />
              <span>{{ t('layoutSwitch.optionFullWidth') }}</span>
            </h5>
            <span>{{ t('layoutSwitch.optionFullWidthHelpMessage') }}</span>
          </p>
          <p max-w-100 text="sm" bg="$vp-nolebase-enhanced-readabilities-menu-background-color" p-3 rounded-xl>
            <h5 text="sm" mb-1 flex="~" items-center align-middle>
              <span i-icon-park-outline:full-screen-two mr-1 />
              <span>{{ t('layoutSwitch.optionSidebarWidthAdjustableOnly') }}</span>
            </h5>
            <span>{{ t('layoutSwitch.optionSidebarWidthAdjustableOnlyHelpMessage') }}</span>
          </p>
          <p max-w-100 text="sm" bg="$vp-nolebase-enhanced-readabilities-menu-background-color" p-3 rounded-xl>
            <h5 text="sm" mb-1 flex="~" items-center align-middle>
              <span i-icon-park-outline:full-screen mr-1 />
              <span>{{ t('layoutSwitch.optionBothWidthAdjustable') }}</span>
            </h5>
            <span>{{ t('layoutSwitch.optionBothWidthAdjustableHelpMessage') }}</span>
          </p>
          <p max-w-100 text="sm" bg="$vp-nolebase-enhanced-readabilities-menu-background-color" p-3 rounded-xl>
            <h5 text="sm" mb-1 flex="~" items-center align-middle>
              <span i-icon-park-outline:off-screen mr-1 />
              <span>{{ t('layoutSwitch.optionOriginalWidth') }}</span>
            </h5>
            <span>{{ t('layoutSwitch.optionOriginalWidthHelpMessage') }}</span>
          </p>
        </div>
      </MenuHelp>
    </div>
    <fieldset
      flex="~ row"
      space-x-2 w-full p-1
      appearance-none
      bg="$vp-nolebase-enhanced-readabilities-menu-background-color"
      rounded-lg border-none
      text="sm $vp-nolebase-enhanced-readabilities-menu-text-color"
      outline="transparent 2px offset-4px dashed"
      transition="outline duration-200 ease"
      :class="{
        'outline-$vp-c-brand-1!': isMenuHelpPoppedUp,
        'rounded-md': isMenuHelpPoppedUp
      }"
    >
      <MenuOption
        v-model="layoutMode"
        :value="LayoutMode.FullWidth"
        :title="t('layoutSwitch.optionFullWidth')"
        :aria-label="t('layoutSwitch.optionFullWidthAriaLabel')"
        :disabled="disabled"
        icon="i-icon-park-outline:full-screen-one"
        name="VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox"
      />
      <MenuOption
        v-model="layoutMode"
        :value="LayoutMode.SidebarWidthAdjustableOnly"
        :title="t('layoutSwitch.optionSidebarWidthAdjustableOnly')"
        :aria-label="t('layoutSwitch.optionSidebarWidthAdjustableOnlyAriaLabel')"
        :disabled="disabled"
        icon="i-icon-park-outline:full-screen-two"
        name="VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox"
      />
      <MenuOption
        v-model="layoutMode"
        :value="LayoutMode.BothWidthAdjustable"
        :title="t('layoutSwitch.optionBothWidthAdjustable')"
        :aria-label="t('layoutSwitch.optionBothWidthAdjustableAriaLabel')"
        :disabled="disabled"
        icon="i-icon-park-outline:full-screen"
        name="VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox"
      />
      <MenuOption
        v-model="layoutMode"
        :value="LayoutMode.Original"
        :title="t('layoutSwitch.optionOriginalWidth')"
        :aria-label="t('layoutSwitch.optionOriginalWidthAriaLabel')"
        :disabled="disabled"
        icon="i-icon-park-outline:off-screen"
        name="VitePress Nolebase Enhanced Readabilities Layout Mode Checkbox"
      />
    </fieldset>
  </div>
</template>

<style less>
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
