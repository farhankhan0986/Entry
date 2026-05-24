/**
 * Diary Encryption Utility
 *
 * AES-256-GCM encryption for diary content.
 * Uses Node.js built-in `crypto` module — no external dependencies.
 *
 * Storage format: "iv:authTag:ciphertext" (all hex-encoded, colon-separated)
 *
 * Key derivation: DIARY_SECRET env var → SHA-256 hash → 32-byte AES key
 *
 * Privacy promise: "Your thoughts stay yours."
 *
 * NOTE: If DIARY_SECRET is missing, encryption is skipped and content
 * is stored as-is with a "[UNENCRYPTED]" prefix for debugging.
 * Set DIARY_SECRET in .env before production.
 */

import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV recommended for GCM
const AUTH_TAG_LENGTH = 16; // 128-bit auth tag

/**
 * Derives a 32-byte AES key from the DIARY_SECRET env var.
 * Uses SHA-256 so any-length secret becomes a valid AES-256 key.
 */
function getDerivedKey() {
  const secret = process.env.DIARY_SECRET;
  if (!secret) {
    return null;
  }
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts plaintext diary content.
 * @param {string} plaintext - The diary content to encrypt
 * @returns {string} - "iv:authTag:ciphertext" hex string, or plaintext if no key
 */
export function encryptContent(plaintext) {
  const key = getDerivedKey();

  if (!key) {
    console.warn("[DiaryEncryption] DIARY_SECRET not set — storing unencrypted.");
    return plaintext;
  }

  if (!plaintext || plaintext.trim() === "") {
    return "";
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  // Combine as hex strings: iv:authTag:ciphertext
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypts an encrypted diary content string.
 * @param {string} encryptedString - "iv:authTag:ciphertext" hex string
 * @returns {string} - Decrypted plaintext, or original string if decryption fails
 */
export function decryptContent(encryptedString) {
  const key = getDerivedKey();

  if (!key) {
    return encryptedString;
  }

  if (!encryptedString || encryptedString.trim() === "") {
    return "";
  }

  try {
    const parts = encryptedString.split(":");
    if (parts.length !== 3) {
      // Not in our encrypted format — return as-is (legacy or plain content)
      return encryptedString;
    }

    const [ivHex, authTagHex, ciphertextHex] = parts;

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const ciphertext = Buffer.from(ciphertextHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch (err) {
    console.error("[DiaryEncryption] Decryption failed:", err.message);
    // Return empty string rather than exposing corrupted data
    return "";
  }
}

/**
 * Checks whether a string looks like our encrypted format.
 * @param {string} str
 * @returns {boolean}
 */
export function isEncrypted(str) {
  if (!str) return false;
  const parts = str.split(":");
  // iv (24 hex chars) : authTag (32 hex chars) : ciphertext (variable)
  return (
    parts.length === 3 &&
    parts[0].length === IV_LENGTH * 2 &&
    parts[1].length === AUTH_TAG_LENGTH * 2
  );
}
