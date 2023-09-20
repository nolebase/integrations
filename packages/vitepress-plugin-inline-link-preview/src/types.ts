/**
 * Localization options
 */
export interface Locale {
  /**
   * Popup options
   */
  popup?: {
    /**
     * The text to be shown when the popup is loading
     */
    loading?: string
    /**
     * The aria-label of the popup when the popup is loading
     */
    loadingAriaLabel?: string
    /**
     * The text to be shown when the popup is failed to load
     */
    openInCurrentPage?: string
    /**
     * The aria-label of the popup when the popup is failed to load
     */
    openInCurrentPageAriaLabel?: string
    /**
     * The aria-label of the iframe popup
     */
    iframeAriaLabel?: string
  }
}

/**
 * Options for the plugin
 */
export interface Options {
  /**
   * The width and height of the popup of link preview
   */
  popupWidth?: number
  /**
   * The height of the popup of link preview
   */
  popupHeight?: number
  /**
   * Toggle previewAllHostNames to true to preview all host names.
   * When set to true, all the other options related to host names will be ignored, including
   * `handleShouldPreviewHostNames` option.
   *
   * @default false
   */
  previewAllHostNames?: boolean
  /**
   * Toggle `previewLocalHostName` to true to preview local (deployed location, or `window.location.host`) host name.
   *
   * @default true
   */
  previewLocalHostName?: boolean
  /**
   * The host names allowed to be previewed.
   * When specified, only the host names in this array that exact matched will be previewed.
   *
   * @default []
   */
  previewHostNamesAllowed?: string[]
  /**
   * The host names blocked to be previewed.
   * When specified, the host names in this array will that exact matched not be previewed.
   *
   * @default []
   */
  previewHostNamesBlocked?: string[]
  /**
   * Programmatically handle whether the host name should be previewed.
   * When specified, this function will be called to determine whether the host name should be previewed and before the `previewHostNamesAllowed` and `previewHostNamesBlocked` options.
   *
   * @param href The href of the link
   * @returns Whether the host name should be previewed
   * @default undefined
   */
  handleShouldPreviewHostNames?: (href: string) => boolean
  /**
   * The selectors of the elements to be hided inside of the iframe when the popup is opened.
   * This is useful when you have a lot of classes of customized elements that you don't want to be shown in the popup.
   */
  selectorsToBeHided?: string[]
  /**
   * Programmatically handle the iframe loaded event, you can use this handling function
   * to programmatically change the iframe content inside, e.g. add a class to the body element.
   * or hide some elements inside of the iframe.
   *
   * @param hostWindow The window object of the host window
   * @param element The iframe element
   * @returns Either a Promise that resolves when the handling is done or plain void
   * @default undefined
   */
  handleIframeLoaded?: (hostWindow: Window, element: HTMLIFrameElement) => Promise<void> | void
  /**
   * The selector of the element to be used as the teleport target of the popup.
   * By default, the popup will be appended to the body element since VitePress supports to
   * teleport elements to the body element only currently.
   *
   * @default 'body'
   */
  popupTeleportTargetSelector?: string
  /**
   * Internationalization options
   *
   * @example { 'zh-CN': { popup: { loading: '加载中...', loadingAriaLabel: '加载中' } }
   */
  locales?: Record<string, Locale>
}
