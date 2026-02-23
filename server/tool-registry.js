/**
 * Tool Registry - Central registry for all available tools
 * 
 * This module loads and manages all tools. Tools must export:
 * - name: string
 * - description: string
 * - schema: object (JSON Schema for parameters)
 * - execute: async function(driver, params)
 */

import logger from './logger.js';

// Import all tools
import navigateTool from './tools/navigate.js';
import clickTool from './tools/click.js';
import inputTool from './tools/input.js';
import waitTool from './tools/wait.js';
import verifyTool from './tools/verify.js';
import screenshotTool from './tools/screenshot.js';

class ToolRegistry {
    constructor() {
        this.tools = new Map();
        this.registerTools();
    }

    /**
     * Registers all available tools
     */
    registerTools() {
        const allTools = [
            navigateTool,
            clickTool,
            inputTool,
            waitTool,
            verifyTool,
            screenshotTool
        ];

        for (const tool of allTools) {
            this.registerTool(tool);
        }
    }

    /**
     * Registers a single tool
     * 
     * @param {Object} tool - Tool object with name, description, schema, execute
     * @throws {Error} If tool is invalid
     */
    registerTool(tool) {
        this.validateTool(tool);
        this.tools.set(tool.name, tool);
        logger.info(`Tool registered: ${tool.name}`);
    }

    /**
     * Validates tool structure
     * 
     * @param {Object} tool - Tool object to validate
     * @throws {Error} If tool is invalid
     */
    validateTool(tool) {
        if (!tool.name || typeof tool.name !== 'string') {
            throw new Error('Tool must have a valid name string');
        }
        if (!tool.description || typeof tool.description !== 'string') {
            throw new Error(`Tool ${tool.name} must have a description`);
        }
        if (!tool.schema || typeof tool.schema !== 'object') {
            throw new Error(`Tool ${tool.name} must have a schema object`);
        }
        if (!tool.execute || typeof tool.execute !== 'function') {
            throw new Error(`Tool ${tool.name} must have an execute function`);
        }
    }

    /**
     * Gets a tool by name
     * 
     * @param {string} toolName - Name of the tool
     * @returns {Object|null} Tool object or null if not found
     */
    getTool(toolName) {
        return this.tools.get(toolName) || null;
    }

    /**
     * Checks if a tool exists
     * 
     * @param {string} toolName - Name of the tool
     * @returns {boolean} True if tool exists
     */
    hasTool(toolName) {
        return this.tools.has(toolName);
    }

    /**
     * Gets all available tools
     * 
     * @returns {Array} Array of tool objects
     */
    getAllTools() {
        return Array.from(this.tools.values());
    }

    /**
     * Gets tool names
     * 
     * @returns {string[]} Array of tool names
     */
    getToolNames() {
        return Array.from(this.tools.keys());
    }

    /**
     * Gets tool metadata (for documentation/discovery)
     * 
     * @returns {Object[]} Array of tool metadata
     */
    getToolMetadata() {
        return this.getAllTools().map(tool => ({
            name: tool.name,
            description: tool.description,
            schema: tool.schema
        }));
    }

    /**
     * Executes a tool with parameter validation
     * 
     * @param {string} toolName - Name of the tool
     * @param {WebDriver} driver - Selenium WebDriver instance
     * @param {Object} params - Parameters for the tool
     * @returns {Promise<Object>} Result object with success, result/error, details
     */
    async executeTool(toolName, driver, params = {}) {
        try {
            if (!this.hasTool(toolName)) {
                return {
                    success: false,
                    error: `Tool not found: ${toolName}`,
                    availableTools: this.getToolNames()
                };
            }

            const tool = this.getTool(toolName);

            // Validate parameters against schema
            const validation = this.validateParams(params, tool.schema);
            if (!validation.valid) {
                return {
                    success: false,
                    error: 'Parameter validation failed',
                    details: validation.errors
                };
            }

            // Execute the tool
            logger.info(`Executing tool: ${toolName} with params: ${JSON.stringify(params)}`);
            const result = await tool.execute(driver, params);

            return {
                success: true,
                result,
                tool: toolName
            };
        } catch (error) {
            logger.error(`Tool execution failed for ${toolName}: ${error.message}`);
            return {
                success: false,
                error: error.message,
                tool: toolName,
                details: error.stack
            };
        }
    }

    /**
     * Validates parameters against a schema
     * 
     * @param {Object} params - Parameters to validate
     * @param {Object} schema - JSON Schema object
     * @returns {Object} { valid: boolean, errors: string[] }
     */
    validateParams(params, schema) {
        const errors = [];

        if (!schema || schema.type !== 'object') {
            return { valid: true, errors };
        }

        const required = schema.required || [];
        const properties = schema.properties || {};

        // Check required fields
        for (const field of required) {
            if (!(field in params)) {
                errors.push(`Missing required parameter: ${field}`);
            }
        }

        // Check field types if specified
        for (const [field, value] of Object.entries(params)) {
            if (field in properties && properties[field].type) {
                const expectedType = properties[field].type;
                const actualType = typeof value;

                if (expectedType === 'string' && actualType !== 'string') {
                    errors.push(`Parameter ${field} must be a string, got ${actualType}`);
                } else if (expectedType === 'number' && actualType !== 'number') {
                    errors.push(`Parameter ${field} must be a number, got ${actualType}`);
                } else if (expectedType === 'boolean' && actualType !== 'boolean') {
                    errors.push(`Parameter ${field} must be a boolean, got ${actualType}`);
                }
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}

// Create and export singleton instance
export const toolRegistry = new ToolRegistry();

export default toolRegistry;
