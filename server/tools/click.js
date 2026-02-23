/**
 * Click Tool - Click on an element
 * 
 * Clicks on an element identified by the specified locator.
 */

import { By } from 'selenium-webdriver';
import { buildLocator, validateLocator } from '../selenium-engine.js';
import logger from '../logger.js';

export default {
    name: 'click',
    description: 'Click on an element identified by locator',
    schema: {
        type: 'object',
        properties: {
            locatorType: {
                type: 'string',
                description: 'Type of locator (id, css, xpath, name, tag, className)',
                enum: ['id', 'css', 'xpath', 'name', 'tag', 'className']
            },
            locatorValue: {
                type: 'string',
                description: 'The locator value to identify the element'
            }
        },
        required: ['locatorType', 'locatorValue']
    },

    async execute(driver, params) {
        const { locatorType, locatorValue } = params;

        try {
            validateLocator(locatorType, locatorValue);
            const locator = buildLocator(locatorType, locatorValue);

            logger.info(`Clicking element: ${locatorType}=${locatorValue}`);

            // Use By[method] to create proper By locator
            const byLocator = By[locator.by](locator.value);

            // Wait for element to be present and clickable
            const element = await driver.findElement(byLocator);

            // Scroll element into view
            await driver.executeScript('arguments[0].scrollIntoView(true);', element);

            // Add small delay for stability
            await driver.sleep(100);

            // Click the element
            await element.click();

            logger.info(`Successfully clicked element: ${locatorType}=${locatorValue}`);

            return {
                message: `Successfully clicked element identified by ${locatorType}=${locatorValue}`
            };
        } catch (error) {
            logger.error(`Click failed: ${error.message}`);
            throw new Error(`Failed to click element ${locatorType}=${locatorValue}: ${error.message}`);
        }
    }
};
