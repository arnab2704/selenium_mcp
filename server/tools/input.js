/**
 * Input Tool - Enter text into an input field
 * 
 * Clears and enters text into an input field identified by the specified locator.
 */

import { By } from 'selenium-webdriver';
import { buildLocator, validateLocator } from '../selenium-engine.js';
import logger from '../logger.js';

export default {
    name: 'input',
    description: 'Enter text into an input field',
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
                description: 'The locator value to identify the input element'
            },
            text: {
                type: 'string',
                description: 'The text to enter into the input field'
            },
            clear: {
                type: 'boolean',
                description: 'Whether to clear existing text before entering (default: true)'
            }
        },
        required: ['locatorType', 'locatorValue', 'text']
    },

    async execute(driver, params) {
        const { locatorType, locatorValue, text, clear = true } = params;

        try {
            validateLocator(locatorType, locatorValue);
            const locator = buildLocator(locatorType, locatorValue);

            logger.info(`Entering text into: ${locatorType}=${locatorValue}`);

            // Use By[method] to create proper By locator
            const byLocator = By[locator.by](locator.value);

            // Find the element
            const element = await driver.findElement(byLocator);

            // Scroll element into view
            await driver.executeScript('arguments[0].scrollIntoView(true);', element);

            // Add small delay for stability
            await driver.sleep(100);

            // Clear the field if requested
            if (clear) {
                await element.clear();
                logger.info(`Cleared input field: ${locatorType}=${locatorValue}`);
            }

            // Enter the text
            await element.sendKeys(text);

            logger.info(`Successfully entered text into: ${locatorType}=${locatorValue}`);

            return {
                message: `Successfully entered text into element identified by ${locatorType}=${locatorValue}`,
                textEntered: text
            };
        } catch (error) {
            logger.error(`Input failed: ${error.message}`);
            throw new Error(`Failed to enter text into ${locatorType}=${locatorValue}: ${error.message}`);
        }
    }
};
