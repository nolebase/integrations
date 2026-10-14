// NOTICE:
// This Worker replaces the former Netlify `docs/public/_redirects`.
// Cloudflare static assets `_redirects` cannot proxy to external origins (Netlify `200`
// rewrites), cannot match `Language=` conditions, and applies redirects before asset
// matching, so `/* /pages/en/:splat 301` would redirect every page in a loop.
// https://developers.cloudflare.com/workers/static-assets/redirects/
// Remove when the site no longer needs the Plausible proxy or the locale redirect.

/**
 * Plausible analytics endpoints proxied through this site, referenced by the
 * `<script>` head tag in `.vitepress/config.ts`.
 *
 * https://plausible.io/docs/proxy/guides/cloudflare
 */
const plausibleProxies = {
  '/assets/page-external-data/js/script.js': 'https://plausible.io/js/script.js',
  '/api/v1/page-external-data/submit': 'https://plausible.io/api/event',
}

/**
 * Matches the VitePress `base` of non-default theme builds, which must stay in sync with
 * `docsThemes` in `.vitepress/config.ts`.
 */
const themeBasePattern = /^\/themes\/voidzero(?=\/|$)/

/**
 * Picks the docs locale from `Accept-Language`, preferring `zh-CN` for any Chinese
 * language range and `en` otherwise.
 *
 * Before:
 * - "zh-CN,zh;q=0.9,en;q=0.8"
 * - "en-US,en;q=0.9"
 *
 * After:
 * - "zh-CN"
 * - "en"
 */
function localeFrom(request) {
  const preferred = (request.headers.get('Accept-Language') ?? '')
    .split(',')
    .map((range) => {
      const [tag, ...params] = range.trim().toLowerCase().split(';')
      const q = params.find(param => param.trim().startsWith('q='))

      return { tag, q: q ? Number(q.trim().slice(2)) : 1 }
    })
    .filter(({ tag, q }) => tag && q > 0)
    .sort((a, b) => b.q - a.q)[0]

  return preferred?.tag.startsWith('zh') ? 'zh-CN' : 'en'
}

/**
 * Serves the theme's VitePress 404 page with a 404 status.
 */
async function notFound(env, request, url, base) {
  // `404` rather than `404.html`: html_handling would answer `/404.html` with a redirect.
  const page = await env.ASSETS.fetch(new Request(new URL(`${base}/404`, url), request))

  return new Response(page.body, { status: 404, headers: page.headers })
}

export default {
  /**
   * Handles requests that matched no static asset.
   *
   * Call stack:
   *
   * fetch
   *   -> plausible.io (proxy for {@link plausibleProxies})
   *   -> {@link notFound} (paths already under `/pages/`)
   *   -> 302 to `<base>/pages/<{@link localeFrom}>/<path>`
   */
  async fetch(request, env) {
    const url = new URL(request.url)

    const proxyTarget = plausibleProxies[url.pathname]
    if (proxyTarget) {
      const proxied = new Request(proxyTarget, request)
      proxied.headers.delete('cookie')

      return fetch(proxied)
    }

    const base = url.pathname.match(themeBasePattern)?.[0] ?? ''
    const path = url.pathname.slice(base.length) || '/'
    if (path.startsWith('/pages/'))
      return notFound(env, request, url, base)

    // Locale-dependent, so 302 rather than 301: browsers cache 301 regardless of language.
    url.pathname = `${base}/pages/${localeFrom(request)}${path}`

    return Response.redirect(url.toString(), 302)
  },
}
