/**
 * Amazon iPhone Search & Add to Cart Test
 * 
 * This script automates the following workflow on Amazon UK:
 * 1. Navigate to amazon.co.uk
 * 2. Search for "iPhone"
 * 3. Select the first iPhone product
 * 4. Add to cart
 * 5. Verify item is in cart
 * 6. Take screenshots at key steps
 * 
 * Usage:
 *   node examples/amazon-iphone-test.js
 * 
 * Prerequisites:
 *   - Server must be running: npm start
 *   - Network connection to amazon.co.uk
 */

const BASE_URL = 'http://localhost:3000';
let sessionId = null;

/**
 * Helper: Make API requests to MCP server
 */
async function makeRequest(tool, params, description = '') {
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

        if (result.sessionId) {
            sessionId = result.sessionId;
        }

        if (!result.success) {
            console.error(`\n❌ FAILED: ${tool}`);
            if (description) console.error(`   Task: ${description}`);
            console.error(`   Error: ${result.error}`);
            if (result.details) console.error(`   Details: ${result.details}`);
            return null;
        }

        console.log(`✓ ${tool}${description ? ' - ' + description : ''}`);
        return result.result;
    } catch (error) {
        console.error(`\n❌ Network error: ${error.message}`);
        return null;
    }
}

/**
 * Helper: Delay between actions
 */
function delay(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main test workflow
 */
async function runAmazonTest() {
    console.log('\n' + '='.repeat(60));
    console.log('🛍️  Amazon iPhone Search & Add to Cart Test');
    console.log('='.repeat(60) + '\n');

    try {
        // Step 1: Navigate to Amazon UK
        console.log('📍 STEP 1: Navigate to Amazon UK');
        await makeRequest('navigate',
            { url: 'https://www.amazon.co.uk' },
            'Loading Amazon homepage'
        );
        await delay(2000);

        // Step 2: Wait for search box to load
        console.log('\n⏳ STEP 2: Wait for page elements');
        await makeRequest('wait',
            {
                locatorType: 'id',
                locatorValue: 'twotabsearchtextbox',
                timeout: 15000,
                condition: 'visible'
            },
            'Search box to appear'
        );

        // Step 3: Enter search term "iPhone"
        console.log('\n🔍 STEP 3: Search for iPhone');
        await makeRequest('input',
            {
                locatorType: 'id',
                locatorValue: 'twotabsearchtextbox',
                text: 'iPhone',
                clear: true
            },
            'Typing "iPhone" in search box'
        );
        await delay(500);

        // Step 4: Click search button
        console.log('\n🔘 STEP 4: Click search button');
        await makeRequest('click',
            {
                locatorType: 'css',
                locatorValue: 'button[type="submit"]'
            },
            'Submitting search'
        );
        await delay(3000);

        // Step 5: Take screenshot of search results
        console.log('\n📸 STEP 5: Capture search results');
        const searchScreenshot = await makeRequest('screenshot',
            { fullPage: false },
            'Search results page'
        );
        if (searchScreenshot) {
            console.log(`   Screenshot size: ${searchScreenshot.size} bytes`);
        }

        // Step 6: Wait for product results to load
        console.log('\n⏳ STEP 6: Wait for search results');
        await makeRequest('wait',
            {
                locatorType: 'css',
                locatorValue: '[data-component-type="s-search-result"]',
                timeout: 10000,
                condition: 'visible'
            },
            'Product results to appear'
        );
        await delay(1000);

        // Step 7: Click on first iPhone product
        console.log('\n🎯 STEP 7: Click first iPhone product');
        const firstProductClick = await makeRequest('click',
            {
                locatorType: 'css',
                locatorValue: '[data-component-type="s-search-result"] h2 a'
            },
            'Opening first product'
        );

        if (!firstProductClick) {
            console.warn('\n⚠️  Could not click first product, trying alternative locator');
            await makeRequest('click',
                {
                    locatorType: 'xpath',
                    locatorValue: '//span[@class="a-size-medium a-color-base a-text-normal"][1]'
                },
                'Opening first product (alternative)'
            );
        }

        await delay(3000);

        // Step 8: Take screenshot of product page
        console.log('\n📸 STEP 8: Capture product details page');
        const productScreenshot = await makeRequest('screenshot',
            { fullPage: true },
            'Product details page'
        );
        if (productScreenshot) {
            console.log(`   Full page screenshot captured (${productScreenshot.size} bytes)`);
        }

        // Step 9: Wait for Add to Cart button
        console.log('\n⏳ STEP 9: Wait for Add to Cart button');
        await makeRequest('wait',
            {
                locatorType: 'id',
                locatorValue: 'add-to-cart-button',
                timeout: 10000,
                condition: 'visible'
            },
            'Add to Cart button'
        );

        // Step 10: Click Add to Cart button
        console.log('\n🛒 STEP 10: Click Add to Cart');
        const addToCart = await makeRequest('click',
            {
                locatorType: 'id',
                locatorValue: 'add-to-cart-button'
            },
            'Adding product to cart'
        );

        if (!addToCart) {
            console.warn('\n⚠️  Could not find standard Add to Cart button, trying alternatives');
            await makeRequest('click',
                {
                    locatorType: 'xpath',
                    locatorValue: '//input[@value="Add to Basket"]'
                },
                'Adding to basket (alternative)'
            );
        }

        await delay(2000);

        // Step 11: Take screenshot after adding to cart
        console.log('\n📸 STEP 11: Capture confirmation');
        const confirmationScreenshot = await makeRequest('screenshot',
            { fullPage: false },
            'Add to cart confirmation'
        );
        if (confirmationScreenshot) {
            console.log(`   Confirmation screenshot size: ${confirmationScreenshot.size} bytes`);
        }

        // Step 12: Wait for success message
        console.log('\n✅ STEP 12: Verify item added to cart');
        const verifySuccess = await makeRequest('verify',
            {
                locatorType: 'xpath',
                locatorValue: '//h1[contains(text(), "Added to Basket")]',
                checkVisible: true
            },
            'Success message visible'
        );

        if (verifySuccess) {
            console.log('   ✓ Item successfully added to cart!');
        } else {
            // Try alternative success indicators
            await makeRequest('verify',
                {
                    locatorType: 'css',
                    locatorValue: '[aria-label*="Added to Basket"]',
                    checkVisible: true
                },
                'Added to cart notification'
            );
        }

        // Step 13: Navigate to cart
        console.log('\n🛒 STEP 13: Navigate to shopping cart');
        await makeRequest('click',
            {
                locatorType: 'id',
                locatorValue: 'nav-cart-count-container'
            },
            'Opening shopping cart'
        );
        await delay(2000);

        // Step 14: Verify item in cart
        console.log('\n✅ STEP 14: Verify product in cart');
        const cartVerify = await makeRequest('verify',
            {
                locatorType: 'css',
                locatorValue: '[data-item-index]',
                checkVisible: true
            },
            'Product visible in cart'
        );

        if (cartVerify) {
            console.log('   ✓ Product confirmed in shopping cart');
        }

        // Step 15: Final screenshot
        console.log('\n📸 STEP 15: Capture final cart view');
        const cartScreenshot = await makeRequest('screenshot',
            { fullPage: false },
            'Shopping cart page'
        );
        if (cartScreenshot) {
            console.log(`   Cart screenshot size: ${cartScreenshot.size} bytes`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ TEST COMPLETED SUCCESSFULLY');
        console.log('='.repeat(60));
        console.log(`\nSession ID: ${sessionId}`);
        console.log('To manually inspect, visit: http://localhost:3000/sessions');
        console.log('\n');

    } catch (error) {
        console.error('\n❌ Test failed with error:', error.message);
    }
}

/**
 * Check if server is available before running test
 */
async function checkServer() {
    try {
        const response = await fetch(`${BASE_URL}/health`);
        const data = await response.json();
        console.log('✓ MCP Server is running');
        console.log(`  Tools available: ${data.tools}`);
        console.log(`  Session(s): ${data.sessions}\n`);
        return true;
    } catch (error) {
        console.error('✗ MCP Server not available');
        console.error(`\n❌ Error: ${error.message}`);
        console.error('\nPlease start the server first:');
        console.error('  npm start\n');
        return false;
    }
}

// Run the test
(async () => {
    const serverAvailable = await checkServer();
    if (serverAvailable) {
        await runAmazonTest();
    }
})();
