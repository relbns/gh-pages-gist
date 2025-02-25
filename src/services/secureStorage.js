/**
 * A helper for storing sensitive data more securely in the browser
 * This provides better security than plain localStorage but is still client-side
 */

/**
 * Encrypt a string using a simple XOR cipher (for demonstration)
 * In production, use a robust encryption library
 * @param {string} text - The text to encrypt
 * @param {string} key - The encryption key
 * @returns {string} - The encrypted text (base64 encoded)
 */
function encrypt (text, key) {
    if (!text) return '';

    // Simple XOR encryption
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode);
    }

    // Convert to base64 for storage
    return btoa(result);
}

/**
 * Decrypt a string encrypted with the encrypt function
 * @param {string} encryptedText - The encrypted text (base64 encoded)
 * @param {string} key - The encryption key
 * @returns {string} - The decrypted text
 */
function decrypt (encryptedText, key) {
    if (!encryptedText) return '';

    try {
        // Decode from base64
        const text = atob(encryptedText);

        // Simple XOR decryption
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            result += String.fromCharCode(charCode);
        }

        return result;
    } catch (error) {
        console.error('Error decrypting data:', error);
        return '';
    }
}

/**
 * Get a storage key derived from the provided key
 * @param {string} key - The key to derive from
 * @returns {string} - A derived key
 */
function getStorageKey (key) {
    // A simple key derivation function
    return `secure_${key.split('').reverse().join('')}`;
}

/**
 * Store a value securely
 * @param {string} key - The key to store under
 * @param {any} value - The value to store
 * @param {string} encryptionKey - The key to encrypt with
 */
export function setSecure (key, value, encryptionKey) {
    if (!key || !encryptionKey) return false;

    try {
        const storageKey = getStorageKey(key);
        const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
        const encryptedValue = encrypt(valueStr, encryptionKey);

        localStorage.setItem(storageKey, encryptedValue);
        return true;
    } catch (error) {
        console.error('Error storing secure data:', error);
        return false;
    }
}

/**
 * Retrieve a securely stored value
 * @param {string} key - The key to retrieve
 * @param {string} encryptionKey - The key used for encryption
 * @param {boolean} parseJson - Whether to parse the result as JSON
 * @returns {any} - The retrieved value
 */
export function getSecure (key, encryptionKey, parseJson = true) {
    if (!key || !encryptionKey) return null;

    try {
        const storageKey = getStorageKey(key);
        const encryptedValue = localStorage.getItem(storageKey);

        if (!encryptedValue) return null;

        const decryptedValue = decrypt(encryptedValue, encryptionKey);

        if (parseJson) {
            try {
                return JSON.parse(decryptedValue);
            } catch {
                return decryptedValue;
            }
        }

        return decryptedValue;
    } catch (error) {
        console.error('Error retrieving secure data:', error);
        return null;
    }
}

/**
 * Remove a securely stored value
 * @param {string} key - The key to remove
 */
export function removeSecure (key) {
    if (!key) return;

    try {
        const storageKey = getStorageKey(key);
        localStorage.removeItem(storageKey);
    } catch (error) {
        console.error('Error removing secure data:', error);
    }
}

/**
 * Encrypt credentials for storing in a Gist
 * @param {Object} data - The credentials to encrypt
 * @param {string} secretKey - The encryption key
 * @returns {string} - The encrypted credentials
 */
export function encryptCredentialsGist (data, secretKey) {
    const dataStr = JSON.stringify(data);
    return encrypt(dataStr, secretKey);
}

/**
 * Decrypt credentials from a Gist
 * @param {string} encryptedData - The encrypted credentials
 * @param {string} secretKey - The encryption key
 * @returns {Object} - The decrypted credentials
 */
export function decryptCredentialsGist (encryptedData, secretKey) {
    const decryptedStr = decrypt(encryptedData, secretKey);
    return JSON.parse(decryptedStr);
}