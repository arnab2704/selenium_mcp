/**
 * Navigate Tool - Navigate to a URL
 * 
 * Navigates the browser to a specified URL.
 */

import logger from '../logger.js';

export default {
    name: 'navigate',
    description: 'Navigate to a URL',
    schema: {
        type: 'object',
        properties: {
            url: {
                type: 'string',
                description: 'The URL to navigate to (must be a valid URL)'
            }
        },
        required: ['url']
    },

    async execute(driver, params) {
        const { url } = params;

        // Validate URL format
        try {
            new URL(url);
        } catch (error) {
            throw new Error(`Invalid URL format: ${url}`);
        }

        try {
            logger.info(`Navigating to: ${url}`);
            await driver.get(url);

            // Wait for document to be ready
            await driver.executeScript('return document.readyState === "complete"');

            const currentUrl = await driver.getCurrentUrl();
            logger.info(`Navigation complete. Current URL: ${currentUrl}`);

            return {
                message: `Successfully navigated to ${url}`,
                url: currentUrl
            };
        } catch (error) {
            logger.error(`Navigation failed: ${error.message}`);
            throw new Error(`Failed to navigate to ${url}: ${error.message}`);
        }
    }
};
