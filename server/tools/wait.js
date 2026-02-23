/**
 * Wait Tool - Wait for an element to be present
 * 
 * Waits for an element to be present in the DOM with a specified timeout.
 */

import { By } from 'selenium-webdriver';
import { buildLocator, validateLocator } from '../selenium-engine.js';
import logger from '../logger.js';

export default {
    name: 'wait',
    description: 'Wait for an element to be present',
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
            },
            timeout: {
                type: 'number',
                description: 'Timeout in milliseconds (default: 10000, max: 60000)'
            },
            condition: {
                type: 'string',
                description: 'What to wait for: "present" (in DOM) or "visible" (on screen)',
                enum: ['present', 'visible']
            }
        },
        required: ['locatorType', 'locatorValue']
    },

    async execute(driver, params) {
        const { locatorType, locatorValue, timeout = 10000, condition = 'present' } = params;

        // Validate timeout
        if (timeout < 0 || timeout > 60000) {
            throw new Error('Timeout must be between 0 and 60000 milliseconds');
        }

        try {
            validateLocator(locatorType, locatorValue);
            const locator = buildLocator(locatorType, locatorValue);

            logger.info(`Waiting for element (${condition}): ${locatorType}=${locatorValue}, timeout=${timeout}ms`);

            // Use By[method] to create proper By locator
            const byLocator = By[locator.by](locator.value);

            const startTime = Date.now();

            if (condition === 'visible') {
                // Wait until element is visible
                await waitForElementVisible(driver, byLocator, timeout);
            } else {
                // Default: wait for element to be present
                await waitForElementPresent(driver, byLocator, timeout);
            }

            const elapsedTime = Date.now() - startTime;
            logger.info(`Element found after ${elapsedTime}ms: ${locatorType}=${locatorValue}`);

            return {
                message: `Element found (${condition}) after ${elapsedTime}ms: ${locatorType}=${locatorValue}`,
                elapsedMs: elapsedTime
            };
        } catch (error) {
            logger.error(`Wait failed: ${error.message}`);
            throw new Error(`Failed waiting for element ${locatorType}=${locatorValue}: ${error.message}`);
        }
    }
};

/**
 * Helper function to wait for element to be present in DOM
 */
async function waitForElementPresent(driver, locator, timeout) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        try {
            const element = await driver.findElement(locator);
            if (element) {
                return element;
            }
        } catch (e) {
            // Element not found, continue waiting
        }

        // Small delay before retrying
        await driver.sleep(100);
    }

    throw new Error(`Element not found within ${timeout}ms`);
}

/**
 * Helper function to wait for element to be visible (present and displayed)
 */
async function waitForElementVisible(driver, locator, timeout) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        try {
            const element = await driver.findElement(locator);
            const isDisplayed = await element.isDisplayed();

            if (isDisplayed) {
                return element;
            }
        } catch (e) {
            // Element not found or not displayed, continue waiting
        }

        // Small delay before retrying
        await driver.sleep(100);
    }

    throw new Error(`Element not visible within ${timeout}ms`);
}
