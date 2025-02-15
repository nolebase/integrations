import type { Options as NolebaseEnhancedReadabilitiesOptions } from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import type { Options as NolebaseGitChangelogOptions } from '@nolebase/vitepress-plugin-git-changelog/client'
import type { Options as NolebaseInlineLinkPreviewOptions } from '@nolebase/vitepress-plugin-inline-link-preview/client'
import type { Options as NolebasePagePropertiesOptions } from '@nolebase/vitepress-plugin-page-properties/client'

export interface PresetClientOptions<PagePropertiesObject extends object = any> {
  enhancedMark?: false
  enhancedReadabilities?: false | { options?: NolebaseEnhancedReadabilitiesOptions }
  gitChangelog?: false | { options?: NolebaseGitChangelogOptions }
  highlightTargetedHeading?: false
  index?: false
  inlineLinkPreview?: false | { options?: NolebaseInlineLinkPreviewOptions }
  pageProperties?: false | { options?: NolebasePagePropertiesOptions<PagePropertiesObject> }
  thumbnailHash?: false
}
