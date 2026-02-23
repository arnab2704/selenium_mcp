/**
 * Verify Tool - Verify element properties
 * 
 * Verifies properties of an element such as text, visibility, or attribute values.
 */

import { By } from 'selenium-webdriver';
import { buildLocator, validateLocator } from '../selenium-engine.js';
import logger from '../logger.js';

export default {
    name: 'verify',
    description: 'Verify element properties (text, visibility, attributes)',
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
            checkText: {
                type: 'string',
                description: 'Expected text content to verify'
            },
            checkVisible: {
                type: 'boolean',
                description: 'Whether to check if element is visible'
            },
            checkAttribute: {
                type: 'string',
                description: 'Name of attribute to check'
            },
            checkAttributeValue: {
                type: 'string',
                description: 'Expected value of the attribute'
            }
        },
        required: ['locatorType', 'locatorValue']
    },

    async execute(driver, params) {
        const {
            locatorType,
            locatorValue,
            checkText,
            checkVisible,
            checkAttribute,
            checkAttributeValue
        } = params;

        try {
            validateLocator(locatorType, locatorValue);
            const locator = buildLocator(locatorType, locatorValue);

            logger.info(`Verifying element: ${locatorType}=${locatorValue}`);

            // Use By[method] to create proper By locator
            const byLocator = By[locator.by](locator.value);

            // Find the element
            const element = await driver.findElement(byLocator);

            if (!element) {
                throw new Error('Element not found');
            }

            const verifications = {};
            const failures = [];

            // Check if visible
            if (checkVisible !== undefined) {
                try {
                    const isDisplayed = await element.isDisplayed();
                    verifications.visible = isDisplayed;

                    if (checkVisible && !isDisplayed) {
                        failures.push('Element is not visible');
                    } else if (!checkVisible && isDisplayed) {
                        failures.push('Element is visible but should not be');
                    }
                } catch (error) {
                    verifications.visible = false;
                    if (checkVisible) {
                        failures.push('Element visibility cannot be determined');
                    }
                }
            }

            // Check text content
            if (checkText !== undefined) {
                const elementText = await element.getText();
                verifications.text = elementText;

                if (elementText.includes(checkText)) {
                    verifications.textMatch = true;
                } else {
                    failures.push(`Expected text "${checkText}" not found in element text "${elementText}"`);
                    verifications.textMatch = false;
                }
            }

            // Check attribute value
            if (checkAttribute !== undefined) {
                const attributeValue = await element.getAttribute(checkAttribute);
                verifications[`attr_${checkAttribute}`] = attributeValue;

                if (checkAttributeValue !== undefined) {
                    if (attributeValue === checkAttributeValue) {
                        verifications[`attr_${checkAttribute}_match`] = true;
                    } else {
                        failures.push(
                            `Expected attribute ${checkAttribute}="${checkAttributeValue}" ` +
                            `but got "${attributeValue}"`
                        );
                        verifications[`attr_${checkAttribute}_match`] = false;
                    }
                }
            }

            logger.info(`Verification complete: ${locatorType}=${locatorValue}`);

            if (failures.length > 0) {
                throw new Error(`Verification failed: ${failures.join('; ')}`);
            }

            return {
                message: 'All verifications passed',
                verified: true,
                details: verifications
            };
        } catch (error) {
            logger.error(`Verification failed: ${error.message}`);
            throw new Error(`Failed to verify element ${locatorType}=${locatorValue}: ${error.message}`);
        }
    }
};
