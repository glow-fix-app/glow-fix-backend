"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptMessage = encryptMessage;
exports.decryptMessage = decryptMessage;
var crypto = __importStar(require("crypto"));
var ALGORITHM = 'aes-256-gcm';
var IV_LENGTH = 16;
var AUTH_TAG_LENGTH = 16;
/**
 * Encrypts a string using AES-256-GCM.
 * The result is a hex string formatted as "ivHex:encryptedHex:authTagHex".
 */
function encryptMessage(text, keyString) {
    var key = keyString || process.env.ENCRYPTION_KEY;
    if (!key || key.length !== 32) {
        return text;
    }
    var iv = crypto.randomBytes(IV_LENGTH);
    var cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key, 'utf8'), iv);
    var encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    var authTag = cipher.getAuthTag();
    return "".concat(iv.toString('hex'), ":").concat(encrypted, ":").concat(authTag.toString('hex'));
}
/**
 * Decrypts a string encrypted by encryptMessage.
 * If the string does not match the encrypted format or decryption fails,
 * it returns the original string as a fallback for plaintext legacy data.
 */
function decryptMessage(encryptedText, keyString) {
    if (!encryptedText)
        return encryptedText;
    var parts = encryptedText.split(':');
    if (parts.length !== 3) {
        // Fallback: assume it's plaintext
        return encryptedText;
    }
    var ivHex = parts[0], encryptedHex = parts[1], authTagHex = parts[2];
    var key = keyString || process.env.ENCRYPTION_KEY;
    if (!key || key.length !== 32) {
        return encryptedText;
    }
    try {
        var decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key, 'utf8'), Buffer.from(ivHex, 'hex'));
        decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
        var decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    catch (error) {
        // If decryption fails, it might be plaintext that coincidentally has two colons.
        return encryptedText;
    }
}
