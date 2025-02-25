/**
 * A service to read and write JSON data to GitHub Gists
 * 
 * To use this, you'll need:
 * 1. A GitHub personal access token with the 'gist' scope
 * 2. The ID of an existing Gist (for reading) or you can create new ones
 */

// Your GitHub personal access token (store this properly in production)
// You should use environment variables in a real app
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

/**
 * Fetches a JSON file from a specific GitHub Gist
 * @param {string} gistId - The ID of the Gist to fetch
 * @param {string} filename - The filename within the gist
 * @returns {Promise<Object>} - The parsed JSON data
 */
export async function fetchFromGist (gistId, filename) {
    try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch gist: ${response.status} ${response.statusText}`);
        }

        const gistData = await response.json();

        // Check if the file exists in the gist
        if (!gistData.files || !gistData.files[filename]) {
            throw new Error(`File "${filename}" not found in gist`);
        }

        // Get the raw content URL and fetch it
        const rawUrl = gistData.files[filename].raw_url;
        const contentResponse = await fetch(rawUrl);

        if (!contentResponse.ok) {
            throw new Error(`Failed to fetch file content: ${contentResponse.status}`);
        }

        return await contentResponse.json();
    } catch (error) {
        console.error('Error fetching from gist:', error);
        throw error;
    }
}

/**
 * Updates a JSON file in an existing GitHub Gist
 * @param {string} gistId - The ID of the Gist to update
 * @param {string} filename - The filename within the gist
 * @param {Object} data - The data to save as JSON
 * @returns {Promise<Object>} - The updated gist data
 */
export async function updateGist (gistId, filename, data) {
    try {
        const content = JSON.stringify(data, null, 2);

        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    [filename]: {
                        content
                    }
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to update gist: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating gist:', error);
        throw error;
    }
}

/**
 * Creates a new GitHub Gist with a JSON file
 * @param {string} description - Description for the new gist
 * @param {string} filename - The filename to create
 * @param {Object} data - The data to save as JSON
 * @param {boolean} isPublic - Whether the gist should be public (default: false)
 * @returns {Promise<Object>} - The created gist data including the ID
 */
export async function createGist (description, filename, data, isPublic = false) {
    try {
        const content = JSON.stringify(data, null, 2);

        const response = await fetch('https://api.github.com/gists', {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description,
                public: isPublic,
                files: {
                    [filename]: {
                        content
                    }
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to create gist: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating gist:', error);
        throw error;
    }
}