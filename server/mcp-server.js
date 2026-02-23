/**
 * MCP Server - Main Express server for Model Context Protocol integration
 * 
 * Handles incoming requests to execute Selenium tools via structured tool calls.
 * Manages browser sessions and delegates tool execution to the tool registry.
 */

import express from 'express';
import logger from './logger.js';
import { sessionManager } from './session-manager.js';
import { toolRegistry } from './tool-registry.js';

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    const stats = sessionManager.getStats();
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        sessions: stats.activeSessions,
        tools: toolRegistry.getToolNames().length
    });
});

/**
 * Get available tools
 */
app.get('/tools', (req, res) => {
    res.json({
        tools: toolRegistry.getToolMetadata(),
        count: toolRegistry.getToolNames().length
    });
});

/**
 * Get session information
 */
app.get('/sessions', (req, res) => {
    res.json(sessionManager.getStats());
});

/**
 * Close a specific session
 */
app.post('/sessions/:sessionId/close', async (req, res) => {
    const { sessionId } = req.params;

    try {
        const success = await sessionManager.closeSession(sessionId);

        if (!success) {
            return res.status(404).json({
                success: false,
                error: `Session not found: ${sessionId}`
            });
        }

        res.json({
            success: true,
            message: `Session closed: ${sessionId}`,
            sessionId
        });
    } catch (error) {
        logger.error(`Error closing session: ${error.message}`);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Main endpoint: Execute a tool
 * 
 * POST /execute
 * 
 * Request body:
 * {
 *   "sessionId": "uuid-string (optional)",
 *   "tool": "tool-name",
 *   "params": { ... tool parameters ... }
 * }
 */
app.post('/execute', async (req, res) => {
    try {
        const { sessionId, tool, params = {} } = req.body;

        // Validate required fields
        if (!tool || typeof tool !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Missing or invalid "tool" field in request body'
            });
        }

        // Check if tool exists
        if (!toolRegistry.hasTool(tool)) {
            return res.status(400).json({
                success: false,
                error: `Unknown tool: ${tool}`,
                availableTools: toolRegistry.getToolNames()
            });
        }

        // Get or create session
        logger.info(`Execute request: tool=${tool}, sessionId=${sessionId}`);

        let session;
        try {
            session = await sessionManager.getOrCreateSession(sessionId);
        } catch (error) {
            logger.error(`Failed to get/create session: ${error.message}`);
            return res.status(500).json({
                success: false,
                error: 'Failed to create browser session',
                details: error.message
            });
        }

        // Execute the tool
        const result = await toolRegistry.executeTool(tool, session.driver, params);

        // Add session ID to response
        result.sessionId = session.sessionId;

        res.json(result);
    } catch (error) {
        logger.error(`Unhandled error in /execute: ${error.message}`);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
});

/**
 * Error handling for 404
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not found',
        availableEndpoints: [
            'GET /health',
            'GET /tools',
            'GET /sessions',
            'POST /sessions/:sessionId/close',
            'POST /execute'
        ]
    });
});

/**
 * Graceful shutdown
 */
async function gracefulShutdown() {
    logger.info('Shutting down server...');

    try {
        // Close all browser sessions
        await sessionManager.closeAllSessions();
        sessionManager.stop();

        logger.info('All sessions closed');
        process.exit(0);
    } catch (error) {
        logger.error(`Error during shutdown: ${error.message}`);
        process.exit(1);
    }
}

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

/**
 * Start the server
 */
app.listen(PORT, () => {
    logger.info(`MCP Server starting...`);
    logger.info(`Available tools: ${toolRegistry.getToolNames().join(', ')}`);
    logger.info(`Server listening on port ${PORT}`);
    logger.info(`Health check: http://localhost:${PORT}/health`);
    logger.info(`Available tools: http://localhost:${PORT}/tools`);
    logger.info(`Execute endpoint: POST http://localhost:${PORT}/execute`);
});

export default app;
