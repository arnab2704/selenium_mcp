# Amazon iPhone Test Guide

## Quick Start

### Option 1: Run the automated Node.js test script

Ensure the server is running, then in a new terminal:

```bash
node examples/amazon-iphone-test.js
```

This will:

1. Navigate to amazon.co.uk
2. Search for "iPhone"
3. Click the first product
4. Add it to cart
5. Take screenshots at each step
6. Verify success

### Option 2: Manual curl commands

Execute these curl commands in sequence:

```bash
# 1. Navigate to Amazon UK
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{"tool": "navigate", "params": {"url": "https://www.amazon.co.uk"}}'

# Save the sessionId from the response

# 2. Wait for search box (replace SESSION_ID with actual ID)
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "SESSION_ID",
    "tool": "wait",
    "params": {
      "locatorType": "id",
      "locatorValue": "twotabsearchtextbox",
      "timeout": 15000,
      "condition": "visible"
    }
  }'

# 3. Search for iPhone
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "SESSION_ID",
    "tool": "input",
    "params": {
      "locatorType": "id",
      "locatorValue": "twotabsearchtextbox",
      "text": "iPhone",
      "clear": true
    }
  }'

# 4. Click search button
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "SESSION_ID",
    "tool": "click",
    "params": {
      "locatorType": "css",
      "locatorValue": "button[type=\"submit\"]"
    }
  }'

# 5. Wait for results
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "SESSION_ID",
    "tool": "wait",
    "params": {
      "locatorType": "css",
      "locatorValue": "[data-component-type=\"s-search-result\"]",
      "timeout": 10000,
      "condition": "visible"
    }
  }'

# 6. Click first product
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "SESSION_ID",
    "tool": "click",
    "params": {
      "locatorType": "css",
      "locatorValue": "[data-component-type=\"s-search-result\"] h2 a"
    }
  }'

# 7. Wait for Add to Cart button
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "SESSION_ID",
    "tool": "wait",
    "params": {
      "locatorType": "id",
      "locatorValue": "add-to-cart-button",
      "timeout": 10000,
      "condition": "visible"
    }
  }'

# 8. Click Add to Cart
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "SESSION_ID",
    "tool": "click",
    "params": {
      "locatorType": "id",
      "locatorValue": "add-to-cart-button"
    }
  }'

# 9. Take screenshot
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "SESSION_ID",
    "tool": "screenshot",
    "params": {}
  }'
```

## What the test does

### Step-by-step breakdown:

1. **Navigate to amazon.co.uk** - Opens the Amazon UK homepage
2. **Wait for search box** - Ensures page is loaded before interaction
3. **Enter "iPhone"** - Searches for iPhone products
4. **Submit search** - Clicks the search button
5. **Wait for results** - Waits for search results to appear
6. **Capture screenshot** - Documents the search results
7. **Click first product** - Opens the first iPhone listing
8. **Wait for product page** - Ensures product details load
9. **Capture product page** - Documents the product details
10. **Wait for Add to Cart button** - Ensures button is visible
11. **Add to cart** - Clicks the Add to Cart button
12. **Capture confirmation** - Documents the success
13. **Verify added** - Confirms the item is in the cart
14. **Navigate to cart** - Opens the shopping cart
15. **Verify in cart** - Confirms product is in cart
16. **Capture final cart** - Documents the cart contents

## Key Features

### Robust Locators

- Uses multiple locator strategies (id, css, xpath)
- Fallback options if primary locators change
- Waits for elements before interaction

### Error Handling

- Checks for success before proceeding
- Provides alternative locators if primary fails
- Detailed error messages
- Screenshots at key steps

### Real-world Scenarios

- Handles page load timing
- Includes delays between actions for stability
- Works with dynamic Amazon page structure
- Verifies each action completed successfully

## Customization

### Search for different products

Edit line 79 in `amazon-iphone-test.js`:

```javascript
text: "iPhone"; // Change to 'Samsung Galaxy' or any product
```

### Change Amazon region

Edit line 51:

```javascript
url: "https://www.amazon.co.uk"; // Change to .com, .de, .fr, etc.
```

### Skip certain steps

Comment out or remove steps you don't need:

```javascript
// Skip cart verification
// await makeRequest('click', { ... });
```

## Troubleshooting

### "Element not found" errors

**Solutions:**

1. Amazon may have changed the page layout - inspect elements in DevTools
2. Use the browser's developer tools to find correct selectors
3. Try alternative locators provided in the script

### Session not found

**Solutions:**

1. Ensure server is running: `npm start`
2. Check that SESSION_ID is correct
3. Note that sessions are only valid for 1 hour

### Timeout waiting for elements

**Solutions:**

1. Increase the timeout value (max 60000ms)
2. Check network connectivity
3. Verify page fully loaded

### "Add to Cart" button not found

**Solutions:**

1. Product may not be available
2. Amazon layout may have changed
3. Try using alternative product search

## Notes

- Tests assume Amazon is accessible from your network
- Headless mode allows running in background
- Each run creates a new browser session
- Screenshots are returned as base64-encoded strings
- All actions are logged with timestamps

## Integration with LLM

This test demonstrates how an LLM could automate e-commerce workflows by:

1. Converting user intent ("Search for iPhone on Amazon") into tool calls
2. Executing structured commands through the API
3. Verifying success with screenshots and verification tools
4. Providing feedback and next steps

Example LLM workflow:

```
User: "Search for iPhone on Amazon UK and add one to your cart"
  ↓
LLM converts to tool calls:
  1. navigate(url: amazon.co.uk)
  2. input(search box, "iPhone")
  3. click(search button)
  4. click(first product)
  5. click(add to cart)
  ↓
Server executes with screenshots
  ↓
LLM receives results and confirms: "Done! Added iPhone to your cart"
```

## Support

For issues:

- Check server logs: `LOG_LEVEL=debug npm start`
- Review tool documentation: `curl http://localhost:3000/tools`
- See main README for comprehensive API docs
