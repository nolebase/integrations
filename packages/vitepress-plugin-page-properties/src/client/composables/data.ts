import { reactive } from 'vue'
import VirtualPagePropertiesData from 'virtual:nolebase-page-properties'

type Data = typeof VirtualPagePropertiesData
const pagePropertiesData = reactive<Data>(VirtualPagePropertiesData)

export function usePageProperties() {
  if (Object.keys(pagePropertiesData).length === 0
    && Object.keys(VirtualPagePropertiesData).length !== 0) {
    Object.keys(VirtualPagePropertiesData).forEach((key) => {
      pagePropertiesData[key] = VirtualPagePropertiesData[key]
    })
  }

  return {
    data: pagePropertiesData,
    applyPagePropertiesData(data: typeof VirtualPagePropertiesData) {
      Object.keys(data).forEach((key) => {
        pagePropertiesData[key] = data[key]
      })
    },
  }
}
