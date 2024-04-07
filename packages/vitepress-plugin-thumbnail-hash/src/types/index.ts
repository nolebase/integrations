export interface ThumbHashAsset {
  /**
   * The file name of the image. Will be normalized to be relative to the
   * root of the VitePress configuration file.
   */
  assetFileName: string
  /**
   * The full file name of the image.
   */
  assetFullFileName: string
  /**
   * The hash of the image.
   */
  assetFullHash: string
  /**
   * The base64 encoded url safe hash of the image.
   */
  assetFileHash: string
  /**
   * The asset URL of the image. Will be used to render as `src` attribute
   * in the HTML.
   */
  assetUrl: string
  /**
   * The asset URL of the image with base. Will be used to render as `data-src`
   * attribute in the HTML used by unlazy.
   *
   * Value will be automatically calculated based on the `base` field
   * configured in the VitePress configuration.
   */
  assetUrlWithBase: string
}

export interface ThumbHashCalculated {
  /**
   * The thumbhash data URL of the image. Will be used to render as
   * `src` attribute in the HTML.
   */
  dataUrl: string
  /**
   * The thumbhash data base64 of the image. Will be used to render as
   * `data-thumbhash` attribute in the HTML.
   */
  dataBase64: string
  /**
   * The resized width of the image (thumbhash requires the image to be
   * resized to less than 100px in width or height).
   */
  width: number
  /**
   * The original width of the image.
   */
  originalWidth: number
  /**
   * The resized height of the image (thumbhash requires the image to
   * be resized to less than 100px in width or height).
   */
  height: number
  /**
   * The original height of the image.
   */
  originalHeight: number
}

export type ThumbHash = ThumbHashAsset & ThumbHashCalculated
