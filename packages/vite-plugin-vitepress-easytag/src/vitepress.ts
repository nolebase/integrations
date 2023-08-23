import type  { App } from 'vue'

import BasicButton from './components/BasicButton.vue'
import BasicDropdownMenu from './components/BasicDropdownMenu.vue'

import Tag from './components/Tag.vue'
import TagItem from './components/TagItem.vue'
import Tags from './components/Tags.vue'

export function EasyTag(app: App) {
  app.component('BasicButton', BasicButton)
  app.component('BasicDropdownMenu', BasicDropdownMenu)

  app.component('Tag', Tag)
  app.component('TagItem', TagItem)
  app.component('Tags', Tags)
}
