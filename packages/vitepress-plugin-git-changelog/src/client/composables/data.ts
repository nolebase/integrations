import { ref } from 'vue'
import Changelog from 'virtual:nolebase-git-changelog'

type Data = typeof Changelog
const changelogData = ref<Data>(Changelog)

export function useGitChangelog() {
  if (Object.keys(changelogData.value).length === 0
    && Object.keys(Changelog).length !== 0)
    changelogData.value = Changelog

  return {
    data: changelogData,
    applyGitChangelogData(data: typeof Changelog) {
      changelogData.value = data
    },
  }
}
