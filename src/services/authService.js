/**
 * Simple client-side authentication service
 * 
 * Note: This provides basic protection but is not suitable for
 * highly sensitive data as the credentials are stored in localStorage
 */

// The key used to store authentication state in localStorage
const AUTH_KEY = 'app_auth_state';

/**
 * Set up credentials for the application
 * @param {string} username - The username to set
 * @param {string} password - The password to set
 * @returns {boolean} - Success status
 */
export function setupCredentials (username, password) {
    if (!username || !password) {
        return false;
    }

    try {
        // Hash the password (simple hash for demo purposes)
        // In a production app, use a proper hashing library
        const hashedPassword = simpleHash(password);

        const credentials = {
            username,
            hashedPassword,
            setupTime: new Date().toISOString()
        };

        // Store the credentials
        localStorage.setItem(AUTH_KEY, JSON.stringify(credentials));
        return true;
    } catch (error) {
        console.error('Error setting up credentials:', error);
        return false;
    }
}

/**
 * Checks if credentials have been set up
 * @returns {boolean} - Whether credentials are set up
 */
export function isSetup () {
    const auth = localStorage.getItem(AUTH_KEY);
    return !!auth;
}

/**
 * Attempts to log in with the provided credentials
 * @param {string} username - The username to check
 * @param {string} password - The password to check
 * @returns {boolean} - Whether login was successful
 */
export function login (username, password) {
    if (!username || !password) {
        return false;
    }

    try {
        const authData = JSON.parse(localStorage.getItem(AUTH_KEY) || '{}');
        if (!authData.username || !authData.hashedPassword) {
            return false;
        }

        // Check if credentials match
        const hashedPassword = simpleHash(password);
        const isMatch = authData.username === username &&
            authData.hashedPassword === hashedPassword;

        if (isMatch) {
            // Set login session
            sessionStorage.setItem('isLoggedIn', 'true');
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error during login:', error);
        return false;
    }
}

/**
 * Checks if user is currently logged in
 * @returns {boolean} - Whether user is logged in
 */
export function isLoggedIn () {
    return sessionStorage.getItem('isLoggedIn') === 'true';
}

/**
 * Logs the user out
 */
export function logout () {
    sessionStorage.removeItem('isLoggedIn');
}

/**
 * Resets all authentication (removes credentials)
 * Use this with caution - it will require setting up credentials again
 */
export function resetAuth () {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem('isLoggedIn');
}

/**
 * A simple string hashing function
 * Note: This is NOT cryptographically secure - use a proper hashing library in production
 * @param {string} str - The string to hash
 * @returns {string} - The hashed string
 */
function simpleHash (str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    // Convert to base 36 and take last 16 chars
    return Math.abs(hash).toString(36).padStart(16, '0').slice(-16);
}