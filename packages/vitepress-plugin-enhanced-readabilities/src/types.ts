import type { LayoutMode } from './constants'

/**
 * Locale
 */
export interface Locale {
  /**
   * Title
   *
   * Used to configure the title of the menu located on the top-right corner of the page.
   */
  title?: {
    /**
     * Title text
     */
    title?: string
    /**
     * Title aria-label
     */
    titleAriaLabel?: string
  }
  /**
   * Layout switch configuration
   *
   * Used to configure the layout switch menu.
   */
  layoutSwitch?: {
    /**
     * Title text
     */
    title?: string
    /**
     * Title aria-label
     */
    titleAriaLabel?: string
    /**
     * Title descriptive help message
     */
    titleHelpMessage?: string
    /**
     * Title warning message for navigation menu in small screen
     */
    titleScreenNavWarningMessage?: string
    /**
     * Expand all option text
     */
    optionFullWidth?: string
    /**
     * Expand all option aria-label
     */
    optionFullWidthAriaLabel?: string
    /**
     * Expand all option help message
     */
    optionFullWidthHelpMessage?: string
    /**
     * Sidebar adjustable only option text
     */
    optionSidebarWidthAdjustableOnly?: string
    /**
     * Sidebar adjustable only option aria-label
     */
    optionSidebarWidthAdjustableOnlyAriaLabel?: string
    /**
     * Sidebar adjustable only option help message
     */
    optionSidebarWidthAdjustableOnlyHelpMessage?: string
    /**
     * Both width adjustable option text
     */
    optionBothWidthAdjustable?: string
    /**
     * Both width adjustable option aria-label
     */
    optionBothWidthAdjustableAriaLabel?: string
    /**
     * Both width adjustable option help message
     */
    optionBothWidthAdjustableHelpMessage?: string
    /**
     * Original option
     */
    optionOriginalWidth?: string
    /**
     * Original option aria-label
     */
    optionOriginalWidthAriaLabel?: string
    /**
     * Original option help message
     */
    optionOriginalWidthHelpMessage?: string

    /**
     * Content layout max width slider configuration
     */
    contentLayoutMaxWidth?: {
      /**
       * Title text
       */
      title?: string
      /**
       * Title aria-label
       */
      titleAriaLabel?: string
      /**
       * Title descriptive help message
       */
      titleHelpMessage?: string
      /**
       * Title warning message for navigation menu in small screen
       */
      titleScreenNavWarningMessage?: string
      /**
       * Content layout max width slider functionality title in help tooltip popup
       */
      slider?: string
      /**
       * Content layout max width slider functionality aria-label in help tooltip popup
       */
      sliderAriaLabel?: string
      /**
       * Content layout max width slider functionality descriptive help message in help tooltip popup
       */
      sliderHelpMessage?: string
    }
    /**
     * Page layout max width slider configuration
     */
    pageLayoutMaxWidth?: {
      /**
       * Title text
       */
      title?: string
      /**
       * Title aria-label
       */
      titleAriaLabel?: string
      /**
       * Title descriptive help message
       */
      titleHelpMessage?: string
      /**
       * Title warning message for navigation menu in small screen
       */
      titleScreenNavWarningMessage?: string
      /**
       * Page layout max width slider functionality title in help tooltip popup
       */
      slider?: string
      /**
       * Page layout max width slider functionality aria-label in help tooltip popup
       */
      sliderAriaLabel?: string
      /**
       * Page layout max width slider functionality descriptive help message in help tooltip popup
       */
      sliderHelpMessage?: string
    }
  }
  /**
   * Spotlight configuration
   */
  spotlight?: {
    /**
     * Title text
     */
    title?: string
    /**
     * Title aria-label
     */
    titleAriaLabel?: string
    /**
     * Title help message
     */
    titleHelpMessage?: string
    /**
     * Title warning message for navigation menu in small screen
     */
    titleScreenNavWarningMessage?: string
    /**
     * Option: On text
     */
    optionOn?: string
    /**
     * Option: On aria-label
     */
    optionOnAriaLabel?: string
    /**
     * Option: On help message
     */
    optionOnHelpMessage?: string
    /**
     * Option: Off text
     */
    optionOff?: string
    /**
     * Option: Off aria-label
     */
    optionOffAriaLabel?: string
    /**
     * Option: Off help message
     */
    optionOffHelpMessage?: string
  }
}

/**
 * Options
 */
export interface Options {
  /**
   * Internationalization configuration
   *
   * When configuring, please configure according to the language code configured in
   * VitePress internationalization configuration. In the following configuration, 'en'
   * and 'zh-CN' are the language codes configured in VitePress internationalization
   * configuration.
   *
   * @default undefined
   * @example
   * ```ts
   * {
   *  locales: {
   *    'en': {
   *      title: {
   *       title: 'Reading Mode',
   *      titleAriaLabel: 'Reading Mode',
   *    },
   *    'zh-CN': {
   *       title: {
   *         title: '阅读模式',
   *         titleAriaLabel: '阅读模式',
   *     },
   *   }
   * }
   * ```
   */
  locales?: Record<string, Locale>
  /**
   * Layout switch configuration
   */
  layoutSwitch?: {
    /**
     * Disable layout switch help tooltip
     *
     * @default false
     */
    disableHelp?: boolean
    /**
     * Default mode for layout switch
     *
     * @default LayoutMode.BothWidthAdjustable (4)
     */
    defaultMode?: LayoutMode
    /**
     * Content layout max width slider configuration
     */
    contentLayoutMaxWidth?: {
      /**
       * Disable content layout max width help tooltip
       *
       * @default false
       */
      disableHelp?: boolean
      /**
       * Default percentage of content layout max width
       *
       * @default 100 (100%)
       */
      defaultMaxWidth?: number
    }
    /**
     * Page layout max width slider configuration
     */
    pageLayoutMaxWidth?: {
      /**
       * Disable page layout max width help tooltip
       *
       * @default false
       */
      disableHelp?: boolean
      /**
       * Default percentage of page layout max width
       *
       * @default 800 (80%)
       */
      defaultMaxWidth?: number
    }
  }
  /**
   * Spotlight configuration
   */
  spotlight?: {
    /**
     * Disable spotlight help tooltip
     *
     * @default false
     */
    disableHelp?: boolean
    /**
     * Spotlight hover block color
     *
     * @default 'rgb(240 197 52 / 10%)'
     */
    hoverBlockColor?: string
    /**
     * Default toggle for spotlight
     *
     * @default false
     */
    defaultToggle?: boolean
  }
}
