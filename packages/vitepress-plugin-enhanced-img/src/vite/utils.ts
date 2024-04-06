// thumbhash/examples/browser/index.html at main · evanw/thumbhash

import { subtle } from 'uncrypto'

// https://github.com/evanw/thumbhash/blob/main/examples/browser/index.html
export function binaryToBase64(binary: Uint8Array) {
  return btoa(String.fromCharCode(...binary))
}

/**
 * Hashes the given data using SHA-256 algorithm.
 *
 * Official example by MDN: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 * @param {Uint8Array} data - The data to be hashed
 * @returns {Promise<string>} - The SHA-256 hash of the message
 */
async function digestUint8ArrayDataSha256(data: Uint8Array) {
  const hashBuffer = await subtle.digest('SHA-256', data) // hash the message
  return Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
}

/**
 * Simulate hash function of rollup.
 *
 * About hashing, please read the documentation of rollup:
 * https://rollupjs.org/configuration-options/#output-hashcharacters
 * https://github.com/rollup/rollup/blob/1b85663fde96d84fceaa2360dba246d3cb92789b/docs/configuration-options/index.md?plain=1#L628
 *
 * For implementation details, please read the source code of rollup:
 * https://github.com/rollup/rollup/blob/1b85663fde96d84fceaa2360dba246d3cb92789b/src/utils/FileEmitter.ts#L259
 * https://github.com/rollup/rollup/blob/1b85663fde96d84fceaa2360dba246d3cb92789b/src/utils/crypto.ts#L12
 *
 * @param {Uint8Array} data - The data to be hashed
 * @param {number} length - The length of the hash
 * @returns {Promise<string>} - The first 10 characters of the SHA-256 hash of the message
 */
export async function hash(data: Uint8Array, length = 10) {
  const hashResult = await digestUint8ArrayDataSha256(data)
  const hashBase64 = binaryToBase64(new Uint8Array(hashResult)) // convert bytes to base64 encoded string
  if (length > 0)
    return hashBase64.substring(0, length)

  return hashBase64
}

/**
 * Normalize the base64 string to be used in the URL.
 *
 * @param {string} base64 - The base64 string to be normalized
 * @returns {string} - The normalized base64 string
 */
export function normalizeBase64(base64: string) {
  return base64.replace('/', '_').replace('+', '-').replace('=', '-')
}
