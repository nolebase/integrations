function useCrypto() {
  if (crypto)
    return crypto

  if (window.crypto)
    return window.crypto

  throw new Error('Crypto not supported')
}

export async function encryptText(plainText: string, plainTextKey: string) {
  const crypto = useCrypto()

  // Encode the key and hash it using SHA-256
  const keyMaterial = await getKeyMaterial(plainTextKey)
  const key = await crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt'],
  )

  // Encode the text to be encrypted
  const encoder = new TextEncoder()
  const encodedText = encoder.encode(plainText)

  // Generate an IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12))

  // Encrypt the text
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encodedText,
  )

  // Convert the encrypted data to Base64
  const encryptedText = bufferToBase64(encryptedData)

  // Convert the IV to Base64
  const ivBase64 = bufferToBase64(iv)

  return { encryptedText, ivBase64 }
}

export async function decryptText(encryptedTextBase64: string, plainTextKey: string, ivBase64: string) {
  // Decode the Base64 encrypted text and IV
  const encryptedData = base64ToBuffer(encryptedTextBase64)
  const iv = base64ToBuffer(ivBase64)

  // Encode the key and hash it using SHA-256
  const keyMaterial = await getKeyMaterial(plainTextKey)

  const key = await window.crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  )

  // Decrypt the text
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encryptedData,
  )

  // Decode the decrypted data
  const decoder = new TextDecoder()
  return decoder.decode(decryptedData)
}

// Helper function to convert a Base64 string to an ArrayBuffer
function base64ToBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++)
    bytes[i] = binaryString.charCodeAt(i)

  return bytes.buffer
}

// Helper function to convert a plaintext string to a SHA-256 hash
async function getKeyMaterial(plainTextKey: string): Promise<ArrayBuffer> {
  const crypto = useCrypto()

  const encoder = new TextEncoder()
  const keyData = encoder.encode(plainTextKey)
  return crypto.subtle.digest('SHA-256', keyData)
}

// Helper function to convert an ArrayBuffer to a Base64 string
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
  return btoa(binary)
}
