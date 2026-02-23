/**
 * Example: Basic Automation Workflow
 * 
 * This example demonstrates how to use the selenium-mcp server
 * to automate a web browser workflow.
 * 
 * Usage:
 *   node examples/basic-workflow.js
 * 
 * Prerequisites:
 *   - Server must be running: npm start
 *   - curl or similar HTTP client
 */

const BASE_URL = 'http://localhost:3000';
let sessionId = null;

/**
 * Helper function to make API requests
 */
async function makeRequest(tool, params) {
    const body = {
        sessionId,
        tool,
        params
    };

    try {
        const response = await fetch(`${BASE_URL}/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const result = await response.json();

        // Store session ID from response
        if (result.sessionId) {
            sessionId = result.sessionId;
        }

        if (!result.success) {
            console.error(`❌ Tool failed: ${tool}`);
            console.error(`   Error: ${result.error}`);
            if (result.details) {
                console.error(`   Details: ${result.details}`);
            }
            return null;
        }

        console.log(`✓ ${tool}`);
        return result.result;
    } catch (error) {
        console.error(`❌ Network error: ${error.message}`);
        return null;
    }
}

/**
 * Main workflow
 */
async function runWorkflow() {
    console.log('\n🚀 Starting Selenium-MCP Example Workflow\n');

    // Step 1: Navigate to example.com
    console.log('📍 Step 1: Navigate to Example.com');
    await makeRequest('navigate', {
        url: 'https://example.com'
    });

    // Step 2: Wait for page to load
    console.log('\n⏳ Step 2: Wait for main element');
    await makeRequest('wait', {
        locatorType: 'tag',
        locatorValue: 'h1',
        timeout: 10000,
        condition: 'visible'
    });

    // Step 3: Verify page content
    console.log('\n🔍 Step 3: Verify page title');
    await makeRequest('verify', {
        locatorType: 'tag',
        locatorValue: 'h1',
        checkText: 'Example Domain',
        checkVisible: true
    });

    // Step 4: Take a screenshot
    console.log('\n📸 Step 4: Capture screenshot');
    const screenshotResult = await makeRequest('screenshot', {
        fullPage: false
    });

    if (screenshotResult && screenshotResult.screenshot) {
        const base64 = screenshotResult.screenshot.slice(0, 50) + '...';
        console.log(`   Screenshot size: ${screenshotResult.size} bytes`);
        console.log(`   Base64 preview: ${base64}`);
    }

    // Step 5: Get session info
    console.log('\n📊 Step 5: Session Information');
    console.log(`   Session ID: ${sessionId}`);

    console.log('\n✅ Workflow completed successfully!\n');
}

/**
 * Check if server is available
 */
async function checkServer() {
    try {
        const response = await fetch(`${BASE_URL}/health`);
        const data = await response.json();
        console.log('✓ Server is running');
        console.log(`  Status: ${data.status}`);
        console.log(`  Tools available: ${data.tools}`);
        return true;
    } catch (error) {
        console.error(`✗ Server not available: ${error.message}`);
        console.error(`\nPlease start the server first:`);
        console.error(`  npm start`);
        return false;
    }
}

// Run the workflow
(async () => {
    const serverAvailable = await checkServer();
    if (serverAvailable) {
        await runWorkflow();
    }
})();
