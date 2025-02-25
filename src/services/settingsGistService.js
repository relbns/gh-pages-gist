import { fetchFromGist, updateGist, createGist } from './gistStorage';

// Key to store the settings Gist ID in localStorage
const SETTINGS_GIST_KEY = 'settings_gist_id';

/**
 * Get the ID of the settings Gist
 * @returns {string|null} The settings Gist ID or null if not set
 */
export function getSettingsGistId () {
    return localStorage.getItem(SETTINGS_GIST_KEY);
}

/**
 * Set the ID of the settings Gist
 * @param {string} gistId The settings Gist ID
 */
export function setSettingsGistId (gistId) {
    localStorage.setItem(SETTINGS_GIST_KEY, gistId);
}

/**
 * Initialize a new settings Gist
 * @returns {Promise<string>} The ID of the new settings Gist
 */
export async function initializeSettingsGist () {
    try {
        const initialSettings = {
            gists: [],
            lastUpdated: new Date().toISOString(),
            userSettings: {}
        };

        const result = await createGist('App Settings', 'settings.json', initialSettings, false);
        setSettingsGistId(result.id);
        return result.id;
    } catch (error) {
        console.error('Error initializing settings Gist:', error);
        throw error;
    }
}

/**
 * Load settings from the settings Gist
 * @returns {Promise<Object>} The settings object
 */
export async function loadSettings () {
    const settingsGistId = getSettingsGistId();
    if (!settingsGistId) {
        throw new Error('No settings Gist ID found');
    }

    try {
        return await fetchFromGist(settingsGistId, 'settings.json');
    } catch (error) {
        console.error('Error loading settings:', error);
        throw error;
    }
}

/**
 * Save settings to the settings Gist
 * @param {Object} settings The settings object to save
 * @returns {Promise<Object>} The updated settings
 */
export async function saveSettings (settings) {
    const settingsGistId = getSettingsGistId();
    if (!settingsGistId) {
        throw new Error('No settings Gist ID found');
    }

    try {
        // Update the lastUpdated timestamp
        const updatedSettings = {
            ...settings,
            lastUpdated: new Date().toISOString()
        };

        await updateGist(settingsGistId, 'settings.json', updatedSettings);
        return updatedSettings;
    } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
    }
}

/**
 * Add a Gist to the settings
 * @param {string} gistId The ID of the Gist to add
 * @param {string} description A description of the Gist
 * @returns {Promise<Object>} The updated settings
 */
export async function addGistToSettings (gistId, description) {
    try {
        const settings = await loadSettings();

        // Check if this Gist is already in the list
        const existingIndex = settings.gists.findIndex(g => g.id === gistId);

        if (existingIndex >= 0) {
            // Update existing entry
            settings.gists[existingIndex] = {
                id: gistId,
                description,
                addedAt: new Date().toISOString()
            };
        } else {
            // Add new entry
            settings.gists.push({
                id: gistId,
                description,
                addedAt: new Date().toISOString()
            });
        }

        return await saveSettings(settings);
    } catch (error) {
        console.error('Error adding Gist to settings:', error);
        throw error;
    }
}

/**
 * Remove a Gist from the settings
 * @param {string} gistId The ID of the Gist to remove
 * @returns {Promise<Object>} The updated settings
 */
export async function removeGistFromSettings (gistId) {
    try {
        const settings = await loadSettings();

        settings.gists = settings.gists.filter(g => g.id !== gistId);

        return await saveSettings(settings);
    } catch (error) {
        console.error('Error removing Gist from settings:', error);
        throw error;
    }
}