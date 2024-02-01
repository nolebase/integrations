import { reactive } from 'vue'
import PagePropertiesData from 'virtual:nolebase-page-properties'

const pagePropertiesData = reactive<typeof PagePropertiesData>(PagePropertiesData)

export function usePageProperties() {
  return {
    data: pagePropertiesData,
    applyPagePropertiesData(data: typeof PagePropertiesData) {
      Object.keys(data).forEach((key) => {
        pagePropertiesData[key] = data[key]
      })
    },
  }
}
