export enum LayoutMode {
  FullWidth = 1,
  OnlySidebarFullWidth = 2,
  FitContentWidth = 3,
}

/**
 * Locale
 *
 * 本地化配置
 */
export interface Locale {
  /**
   * Title
   *
   * 标题
   *
   * Used to configure the title of the menu located on the top-right corner of the page.
   *
   * 用于配置位于页面右上角的菜单的标题。
   */
  title?: {
    /**
     * Title text
     *
     * 标题文案
     */
    title?: string
    /**
     * Title aria-label
     *
     * 标题 aria-label，用于无障碍访问和屏幕阅读器
     */
    titleAriaLabel?: string
  }
  /**
   * Layout switch configuration
   *
   * 布局切换配置
   *
   * Used to configure the layout switch menu.
   *
   * 用于配置布局切换菜单。
   */
  layoutSwitch?: {
    /**
     * Title text
     *
     * 标题文案
     */
    title?: string
    /**
     * Title aria-label
     *
     * 标题 aria-label，用于无障碍访问和屏幕阅读器
     */
    titleAriaLabel?: string
    /**
     * Title help message
     *
     * 标题帮助信息
     */
    titleHelpMessage?: string
    /**
     * Title warning message for navigation menu in small screen
     *
     * 标题在小屏幕下导航菜单的警告信息
     */
    titleScreenNavWarningMessage?: string
    /**
     * Option: Expand all text
     *
     * 选项：全部展开文案
     */
    optionFullWidth?: string
    /**
     * Option: Expand all aria-label
     *
     * 选项：全部展开 aria-label，用于无障碍访问和屏幕阅读器
     */
    optionFullWidthAriaLabel?: string
    /**
     * Option: Expand all help message
     *
     * 选项：全部展开帮助信息
     */
    optionFullWidthHelpMessage?: string
    /**
     * Option: Expand only sidebar text
     *
     * 选项：仅侧边栏展开
     */
    optionOnlySidebarFullWidth?: string
    /**
     * Option: Expand only sidebar aria-label
     *
     * 选项：仅侧边栏展开 aria-label，用于无障碍访问和屏幕阅读器
     */
    optionOnlySidebarFullWidthAriaLabel?: string
    /**
     * Option: Expand only sidebar help message
     *
     * 选项：仅侧边栏展开帮助信息
     */
    optionOnlySidebarFullWidthHelpMessage?: string
    /**
     * Option: Fit content width text
     * 选项：自适应内容宽度
     */
    optionFitContentWidth?: string
    /**
     * Option: Fit content width aria-label
     *
     * 选项：自适应内容宽度 aria-label，用于无障碍访问和屏幕阅读器
     */
    optionFitContentWidthAriaLabel?: string
    /**
     * Option: Fit content width help message
     *
     * 选项：自适应内容宽度帮助信息
     */
    optionFitContentWidthHelpMessage?: string
  }
  /**
   * Inline highlight configuration
   *
   * 行内高亮配置
   */
  inlineHighlight?: {
    /**
     * Title text
     *
     * 标题文案
     */
    title?: string
    /**
     * Title aria-label
     *
     * 标题 aria-label，用于无障碍访问和屏幕阅读器
     */
    titleAriaLabel?: string
    /**
     * Title help message
     *
     * 标题帮助信息
     */
    titleHelpMessage?: string
    /**
     * Title warning message for navigation menu in small screen
     *
     * 标题在小屏幕下导航菜单的警告信息
     */
    titleScreenNavWarningMessage?: string
    /**
     * Option: On text
     *
     * 选项：开启文案
     */
    optionOn?: string
    /**
     * Option: On aria-label
     *
     * 选项：开启 aria-label，用于无障碍访问和屏幕阅读器
     */
    optionOnAriaLabel?: string
    /**
     * Option: On help message
     *
     * 选项：开启帮助信息
     */
    optionOnHelpMessage?: string
    /**
     * Option: Off text
     *
     * 选项：关闭文案
     */
    optionOff?: string
    /**
     * Option: Off aria-label
     *
     * 选项：关闭 aria-label，用于无障碍访问和屏幕阅读器
     */
    optionOffAriaLabel?: string
    /**
     * Option: Off help message
     *
     * 选项：关闭帮助信息
     */
    optionOffHelpMessage?: string
  }
}

/**
 * Options
 *
 * 配置项
 */
export interface Options {
  /**
   * Internationalization configuration
   *
   * 国际化配置
   *
   * When configuring, please configure according to the language code configured in
   * VitePress internationalization configuration. In the following configuration, 'en'
   * and 'zh-CN' are the language codes configured in VitePress internationalization
   * configuration.
   *
   * 配置的时候请根据 VitePress 中国际化配置中所配置的语言代码来配置，以下面的配置为例的话，'en'
   * 和 'zh-CN' 是 VitePress 的国际化配置中所配置的语言代码。
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
   * Disable layout switch help tooltip
   *
   * 显示布局切换帮助提示
   *
   * @default false
   */
  disableLayoutSwitchHelp?: boolean
  /**
   * Disable inline highlight help tooltip
   *
   * 显示行内高亮帮助提示
   *
   * @default false
   */
  disableInlineHighlightHelp?: boolean
  /**
   * Inline highlighter hover block color
   *
   * 行内高亮器鼠标悬停块颜色
   *
   * @default 'rgb(240 197 52 / 10%)'
   */
  inlineHighlightHoverBlockColor?: string
}
