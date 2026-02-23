/**
 * Session Manager - Manages multiple Selenium WebDriver sessions
 * 
 * Handles creation, retrieval, and cleanup of browser sessions.
 * Each session has a unique ID and is associated with a WebDriver instance.
 */

import { randomUUID } from 'crypto';
import { createDriver, quitDriver } from './selenium-engine.js';
import logger from './logger.js';

class SessionManager {
    constructor() {
        // Map of sessionId -> { driver, createdAt, lastUsedAt }
        this.sessions = new Map();

        // Session timeout in milliseconds (1 hour)
        this.SESSION_TIMEOUT = 60 * 60 * 1000;

        // Start cleanup interval (every 5 minutes)
        this.cleanupInterval = setInterval(() => this.cleanupExpiredSessions(), 5 * 60 * 1000);
    }

    /**
     * Creates a new browser session
     * 
     * @param {Object} options - Driver options (browser, headless, timeout)
     * @returns {Promise<string>} Session ID
     */
    async createSession(options = {}) {
        try {
            const driver = await createDriver(options);
            const sessionId = randomUUID();

            this.sessions.set(sessionId, {
                driver,
                createdAt: Date.now(),
                lastUsedAt: Date.now(),
                options
            });

            logger.info(`Session created: ${sessionId}`);
            return sessionId;
        } catch (error) {
            logger.error(`Failed to create session: ${error.message}`);
            throw error;
        }
    }

    /**
     * Gets an existing session or creates a new one if not found
     * 
     * @param {string} sessionId - Session ID (optional)
     * @param {Object} options - Driver options for new sessions
     * @returns {Promise<Object>} { sessionId, driver }
     */
    async getOrCreateSession(sessionId, options = {}) {
        if (sessionId && this.sessions.has(sessionId)) {
            const session = this.sessions.get(sessionId);
            session.lastUsedAt = Date.now();
            logger.info(`Session retrieved: ${sessionId}`);
            return { sessionId, driver: session.driver };
        }

        // Create new session if not found
        const newSessionId = await this.createSession(options);
        const session = this.sessions.get(newSessionId);
        return { sessionId: newSessionId, driver: session.driver };
    }

    /**
     * Gets an existing session
     * 
     * @param {string} sessionId - Session ID
     * @returns {WebDriver|null} WebDriver instance or null if not found
     */
    getSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            return null;
        }
        session.lastUsedAt = Date.now();
        return session.driver;
    }

    /**
     * Closes a session
     * 
     * @param {string} sessionId - Session ID
     * @returns {Promise<boolean>} True if closed, false if not found
     */
    async closeSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            logger.warn(`Session not found for closure: ${sessionId}`);
            return false;
        }

        try {
            await quitDriver(session.driver);
            this.sessions.delete(sessionId);
            logger.info(`Session closed: ${sessionId}`);
            return true;
        } catch (error) {
            logger.error(`Error closing session ${sessionId}: ${error.message}`);
            this.sessions.delete(sessionId);
            return false;
        }
    }

    /**
     * Closes all sessions
     * 
     * @returns {Promise<void>}
     */
    async closeAllSessions() {
        const sessionIds = Array.from(this.sessions.keys());
        logger.info(`Closing ${sessionIds.length} sessions`);

        for (const sessionId of sessionIds) {
            await this.closeSession(sessionId);
        }
    }

    /**
     * Cleans up expired sessions based on last usage
     * 
     * @returns {Promise<void>}
     */
    async cleanupExpiredSessions() {
        const now = Date.now();
        const expiredSessions = [];

        for (const [sessionId, session] of this.sessions.entries()) {
            if (now - session.lastUsedAt > this.SESSION_TIMEOUT) {
                expiredSessions.push(sessionId);
            }
        }

        for (const sessionId of expiredSessions) {
            logger.info(`Cleaning up expired session: ${sessionId}`);
            await this.closeSession(sessionId);
        }
    }

    /**
     * Gets all active session IDs
     * 
     * @returns {string[]} Array of session IDs
     */
    getActiveSessions() {
        return Array.from(this.sessions.keys());
    }

    /**
     * Gets session statistics
     * 
     * @returns {Object} Statistics object
     */
    getStats() {
        return {
            activeSessions: this.sessions.size,
            sessionIds: Array.from(this.sessions.keys()),
            sessions: Array.from(this.sessions.entries()).map(([id, session]) => ({
                id,
                createdAt: new Date(session.createdAt).toISOString(),
                lastUsedAt: new Date(session.lastUsedAt).toISOString(),
                ageMs: Date.now() - session.createdAt
            }))
        };
    }

    /**
     * Stops the cleanup interval
     */
    stop() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
}

// Create and export singleton instance
export const sessionManager = new SessionManager();

export default sessionManager;
