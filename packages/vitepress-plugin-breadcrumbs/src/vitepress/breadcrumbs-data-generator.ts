import type { PageData, TransformPageContext } from 'vitepress'

export function generateBreadcrumbsData(pageData: PageData, context: TransformPageContext) {
  const splitPath = pageData.filePath.split('/')
  const rootDirectory = splitPath[0]
  const pages = context.siteConfig.pages
  const breadcrumbs: {
    title: string
    link: string
  }[] = [{
    title: context.siteConfig.site.title,
    link: `/${rootDirectory}`,
  }]

  for (let i = 1; i < splitPath.length; i++) {
    let link = ''
    let encodedLink = ''
    let title = splitPath[i]
    if (i === splitPath.length - 1) {
      title = pageData.title
    }

    for (let j = 0; j <= i; j++) {
      link += `${splitPath[j]}`
      encodedLink += `${encodeURIComponent(splitPath[j])}`

      if (j !== i) {
        link += `/`
        encodedLink += `/`
      }
    }

    if (!pages.includes(link) && !pages.includes(`${link}/index.md`)) {
      breadcrumbs.push({ title: splitPath[i], link: '' })
      continue
    }

    if (link.endsWith('index.md')) {
      continue
    }

    if (link.endsWith('.md')) {
      encodedLink = encodedLink.slice(0, -3)
    }

    breadcrumbs.push({ title, link: `/${encodedLink}` })
  }

  if (splitPath.length)
    pageData.frontmatter.breadcrumbs = breadcrumbs
}
