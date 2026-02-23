/**
 * Selenium Engine - Handles WebDriver initialization and configuration
 * 
 * This module provides utilities to create and configure Selenium WebDriver instances.
 * Supports Chrome and Firefox with headless mode capability.
 */

import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import firefox from 'selenium-webdriver/firefox.js';

/**
 * Creates a new Selenium WebDriver instance
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.browser - 'chrome' or 'firefox' (default: 'chrome')
 * @param {boolean} options.headless - Run in headless mode (default: true)
 * @param {number} options.timeout - Implicit wait timeout in ms (default: 10000)
 * @returns {Promise<WebDriver>} Configured WebDriver instance
 */
export async function createDriver(options = {}) {
    const {
        browser = 'chrome',
        headless = true,
        timeout = 10000
    } = options;

    let driver;

    try {
        if (browser === 'chrome') {
            const chromeOptions = new chrome.Options();
            if (headless) {
                chromeOptions.addArguments('--headless=new');
            }
            chromeOptions.addArguments('--no-sandbox');
            chromeOptions.addArguments('--disable-dev-shm-usage');

            driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(chromeOptions)
                .build();
        } else if (browser === 'firefox') {
            const firefoxOptions = new firefox.Options();
            if (headless) {
                firefoxOptions.addArguments('-headless');
            }

            driver = await new Builder()
                .forBrowser('firefox')
                .setFirefoxOptions(firefoxOptions)
                .build();
        } else {
            throw new Error(`Unsupported browser: ${browser}`);
        }

        // Set implicit wait timeout
        await driver.manage().setTimeouts({ implicit: timeout });

        return driver;
    } catch (error) {
        if (driver) {
            await driver.quit().catch(() => { });
        }
        throw new Error(`Failed to create WebDriver: ${error.message}`);
    }
}

/**
 * Safely quits a WebDriver instance
 * 
 * @param {WebDriver} driver - The driver to quit
 * @returns {Promise<void>}
 */
export async function quitDriver(driver) {
    if (!driver) return;

    try {
        await driver.quit();
    } catch (error) {
        console.warn(`Warning: Error during driver quit: ${error.message}`);
    }
}

/**
 * Validates locator parameters
 * 
 * @param {string} locatorType - The type of locator (id, css, xpath, name)
 * @param {string} locatorValue - The locator value
 * @throws {Error} If locator type is invalid or value is empty
 */
export function validateLocator(locatorType, locatorValue) {
    const validTypes = ['id', 'css', 'xpath', 'name', 'tag', 'className'];

    if (!validTypes.includes(locatorType)) {
        throw new Error(`Invalid locator type: ${locatorType}. Must be one of: ${validTypes.join(', ')}`);
    }

    if (!locatorValue || typeof locatorValue !== 'string') {
        throw new Error('Locator value must be a non-empty string');
    }
}

/**
 * Converts locator type and value to Selenium By locator
 * 
 * @param {string} locatorType - The type of locator
 * @param {string} locatorValue - The locator value
 * @returns {By} Selenium By locator object
 */
export function buildLocator(locatorType, locatorValue) {
    validateLocator(locatorType, locatorValue);

    // Maps locator types to Selenium By methods
    const locatorMap = {
        'id': { method: 'id', value: locatorValue },
        'css': { method: 'css', value: locatorValue },
        'xpath': { method: 'xpath', value: locatorValue },
        'name': { method: 'name', value: locatorValue },
        'tag': { method: 'tagName', value: locatorValue },
        'className': { method: 'className', value: locatorValue }
    };

    const locator = locatorMap[locatorType];
    return { by: locator.method, value: locator.value };
}

export default {
    createDriver,
    quitDriver,
    validateLocator,
    buildLocator
};
