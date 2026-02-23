/**
 * Screenshot Tool - Capture a screenshot of the current page or element
 * 
 * Takes a screenshot and returns it as a base64-encoded string.
 */

import { By } from 'selenium-webdriver';
import { buildLocator, validateLocator } from '../selenium-engine.js';
import logger from '../logger.js';
import fs from 'fs/promises';
import path from 'path';

export default {
    name: 'screenshot',
    description: 'Capture a screenshot of the page (full or element)',
    schema: {
        type: 'object',
        properties: {
            fullPage: {
                type: 'boolean',
                description: 'Capture full page or just viewport (default: false)'
            },
            locatorType: {
                type: 'string',
                description: 'Type of locator for element screenshot (id, css, xpath, name, tag, className)',
                enum: ['id', 'css', 'xpath', 'name', 'tag', 'className']
            },
            locatorValue: {
                type: 'string',
                description: 'The locator value to identify an element for screenshot'
            }
        }
    },

    async execute(driver, params) {
        const { fullPage = false, locatorType, locatorValue } = params;

        try {
            let screenshot;

            if (locatorType && locatorValue) {
                // Capture element screenshot
                logger.info(`Capturing element screenshot: ${locatorType}=${locatorValue}`);
                screenshot = await captureElementScreenshot(driver, locatorType, locatorValue);
            } else if (fullPage) {
                // Capture full page screenshot
                logger.info('Capturing full page screenshot');
                screenshot = await captureFullPageScreenshot(driver);
            } else {
                // Capture viewport screenshot
                logger.info('Capturing viewport screenshot');
                screenshot = await driver.takeScreenshot();
            }

            logger.info(`Screenshot captured successfully (${screenshot.length} bytes)`);

            return {
                message: 'Screenshot captured successfully',
                screenshot: screenshot,
                size: screenshot.length,
                format: 'base64'
            };
        } catch (error) {
            logger.error(`Screenshot failed: ${error.message}`);
            throw new Error(`Failed to capture screenshot: ${error.message}`);
        }
    }
};

/**
 * Helper function to capture full page screenshot
 */
async function captureFullPageScreenshot(driver) {
    // Get page dimensions
    const windowSize = await driver.manage().window().getRect();
    const bodySize = await driver.executeScript(
        'return { width: document.body.scrollWidth, height: document.body.scrollHeight };'
    );

    // Set window size to full page
    await driver.manage().window().setRect({
        width: bodySize.width,
        height: bodySize.height
    });

    // Small delay for rendering
    await driver.sleep(200);

    // Take screenshot
    const screenshot = await driver.takeScreenshot();

    // Restore original window size
    await driver.manage().window().setRect({
        width: windowSize.width,
        height: windowSize.height
    });

    return screenshot;
}

/**
 * Helper function to capture element screenshot
 */
async function captureElementScreenshot(driver, locatorType, locatorValue) {
    validateLocator(locatorType, locatorValue);
    const locator = buildLocator(locatorType, locatorValue);
    const byLocator = By[locator.by](locator.value);

    // Find the element
    const element = await driver.findElement(byLocator);

    // Scroll element into view
    await driver.executeScript('arguments[0].scrollIntoView(true);', element);
    await driver.sleep(200);

    // Take screenshot of the element
    const screenshot = await element.takeScreenshot();

    return screenshot;
}
