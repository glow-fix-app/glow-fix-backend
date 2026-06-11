import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts a string using AES-256-GCM.
 * The result is a hex string formatted as "ivHex:encryptedHex:authTagHex".
 */
export function encryptMessage(text: string, keyString?: string): string {
  const key = keyString || process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 32) {
    return text;
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key, 'utf8'), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
}

/**
 * Decrypts a string encrypted by encryptMessage.
 * If the string does not match the encrypted format or decryption fails, 
 * it returns the original string as a fallback for plaintext legacy data.
 */
export function decryptMessage(encryptedText: string, keyString?: string): string {
  if (!encryptedText) return encryptedText;

  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    // Fallback: assume it's plaintext
    return encryptedText;
  }

  const [ivHex, encryptedHex, authTagHex] = parts;
  
  const key = keyString || process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 32) {
    return encryptedText;
  }

  try {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(key, 'utf8'),
      Buffer.from(ivHex, 'hex')
    );
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    // If decryption fails, it might be plaintext that coincidentally has two colons.
    return encryptedText;
  }
}
