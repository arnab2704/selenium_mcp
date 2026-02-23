# Selenium-MCP Examples

This directory contains practical examples demonstrating how to use the selenium-mcp server for browser automation.

## Available Examples

### 1. Basic Workflow (`basic-workflow.js`)

A simple example that navigates to example.com and verifies content.

**Run:**

```bash
node basic-workflow.js
```

**What it does:**

- Navigates to example.com
- Waits for page elements
- Verifies page title
- Takes a screenshot

**Best for:** Understanding basic tool usage and API structure

---

### 2. Amazon iPhone Search & Add to Cart

Complete e-commerce automation example. Search for iPhone on Amazon UK and add it to cart.

**Available in 3 formats:**

#### Node.js Script (Recommended)

```bash
node amazon-iphone-test.js
```

**Features:**

- Error logging and handling
- Automatic retries with alternative locators
- Screenshots at each step
- Real-time console output
- Delay handling for page loads

#### PowerShell Script (Windows)

```powershell
.\amazon-iphone-test.ps1
```

**Features:**

- Colored console output
- JSON request building
- Error handling
- Works on Windows systems

#### Bash Script (macOS/Linux)

```bash
chmod +x amazon-iphone-test.sh
./amazon-iphone-test.sh
```

**Features:**

- Requires jq for JSON parsing: `brew install jq`
- Pure shell script
- Color output
- Works on Unix-like systems

#### Manual Curl Commands

See [AMAZON_TEST_GUIDE.md](AMAZON_TEST_GUIDE.md) for detailed curl commands.

---

## How to Run Examples

### Prerequisites

1. **Start the MCP server:**

   ```bash
   npm start
   ```

2. **In another terminal, run an example:**
   ```bash
   node examples/basic-workflow.js
   # or
   node examples/amazon-iphone-test.js
   ```

### Success Output

You should see output like:

```
✓ navigate
✓ wait - Search box to appear
✓ input - Typing iPhone in search
✓ click - Submitting search
✓ screenshot - Search results page
...
✅ TEST COMPLETED SUCCESSFULLY
Session ID: 550e8400-e29b-41d4-a716-446655440000
```

---

## Amazon Test Workflow

The Amazon test is a comprehensive real-world example:

1. **Navigate** to amazon.co.uk
2. **Wait** for search box
3. **Input** search term "iPhone"
4. **Click** search button
5. **Wait** for results
6. **Screenshot** results
7. **Click** first product
8. **Wait** for product page
9. **Wait** for Add to Cart button
10. **Click** Add to Cart
11. **Verify** success message
12. **Navigate** to cart
13. **Verify** item in cart
14. **Screenshot** final cart

### Key Features

✅ **Multi-step workflow** - Complete e-commerce scenario
✅ **Error handling** - Fallback locators if primary fails
✅ **Screenshots** - Visual verification at each step
✅ **Verification** - Confirms each action succeeded
✅ **Delays** - Handles page load timing
✅ **Real-world** - Works with actual Amazon site

---

## Customizing the Amazon Test

### Search different products

Edit the search term in your chosen script:

**Node.js:**

```javascript
// Line ~79: Change "iPhone" to your product
await makeRequest("input", {
  // ...
  text: "Samsung Galaxy", // ← Change this
});
```

**PowerShell:**

```powershell
text = "Samsung Galaxy"  # ← Change this
```

**Bash:**

```bash
text":"Samsung Galaxy"  # ← Change this
```

### Use different Amazon region

Edit the URL:

- `https://www.amazon.com` - US
- `https://www.amazon.co.uk` - UK
- `https://www.amazon.de` - Germany
- `https://www.amazon.fr` - France
- `https://www.amazon.co.jp` - Japan

### Handle page changes

If Amazon updates their HTML structure, update the locators:

1. Open amazon.co.uk in your browser
2. Right-click the search box → Inspect
3. Find the element ID or CSS selector
4. Update the locator in the script:

```javascript
// From:
locatorValue: "twotabsearchtextbox";

// To:
locatorValue: "search-box-id"; // or css selector
```

---

## Understanding the Output

### Success indicators

```
✓ tool-name - Task description
```

✓ means the action completed successfully

### Error indicators

```
❌ Tool failed: tool-name
   Error: Description of what went wrong
```

Check the error message and try:

- Verify the element exists in the browser
- Update selectors if page layout changed
- Increase timeout values for slow networks
- Check internet connection

---

## Common Issues & Solutions

### "Element not found"

**Cause:** Amazon changed their page structure

**Solutions:**

1. Use browser DevTools to find current selectors
2. Try alternative locators (CSS, XPath, ID)
3. Add longer wait timeouts

### "Timeout waiting for element"

**Cause:** Page hasn't fully loaded

**Solutions:**

1. Increase timeout: `"timeout": 20000`
2. Check internet speed
3. Try again - sometimes Amazon is slow

### "Session not found"

**Cause:** Server restarted

**Solutions:**

1. Ensure server is running: `npm start`
2. Create new test session
3. Check session hasn't expired (1 hour timeout)

### Connection refused

**Cause:** Server not running on port 3000

**Solutions:**

1. Start server: `npm start`
2. Check port: `lsof -i :3000` (macOS/Linux)
3. Try different port: `PORT=3001 npm start`

---

## Advanced Usage

### Handling JavaScript-heavy pages

Some sites require JavaScript execution. Add a small delay:

```javascript
await makeRequest("wait", {
  locatorType: "css",
  locatorValue: ".dynamic-element",
  timeout: 15000,
  condition: "visible",
});
```

### Taking full page screenshots

For long pages, use `fullPage`:

```javascript
await makeRequest("screenshot", {
  fullPage: true,
});
```

### Getting element text

Use verify tool to check element content:

```javascript
await makeRequest("verify", {
  locatorType: "id",
  locatorValue: "title",
  checkText: "iPhone 15 Pro",
  checkVisible: true,
});
```

---

## Integration with LLM

These examples show how LLMs can use the MCP server:

```
User: "Search Amazon UK for iPhone and add to cart"
  ↓
LLM Converts to Tool Calls:
  1. navigate(amazon.co.uk)
  2. input(search box, "iPhone")
  3. click(search button)
  4. click(first product)
  5. click(add to cart)
  ↓
Server Executes All Steps
  ↓
LLM Receives Structured Responses + Screenshots
  ↓
LLM Says: "Done! Found an iPhone 15 Pro for £999 and added to cart"
```

---

## Creating Your Own Examples

### Template

```javascript
const BASE_URL = "http://localhost:3000";
let sessionId = null;

async function makeRequest(tool, params, description) {
  const body = { sessionId, tool, params };
  const response = await fetch(`${BASE_URL}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  if (result.sessionId) sessionId = result.sessionId;

  if (!result.success) {
    console.error(`❌ ${tool}: ${result.error}`);
    return null;
  }

  console.log(`✓ ${tool}${description ? " - " + description : ""}`);
  return result.result;
}

async function main() {
  // Your test steps here
  await makeRequest("navigate", { url: "https://example.com" });
  await makeRequest("screenshot", { fullPage: true });
}

main();
```

### Available Tools

- `navigate` - Go to URL
- `click` - Click element
- `input` - Type text
- `wait` - Wait for element
- `verify` - Check element properties
- `screenshot` - Capture screen

See main [README.md](../README.md) for complete API reference.

---

## Documentation

- [AMAZON_TEST_GUIDE.md](AMAZON_TEST_GUIDE.md) - Detailed guide for Amazon test
- [../README.md](../README.md) - Complete API documentation
- [../QUICKSTART.md](../QUICKSTART.md) - Quick start guide

---

## Tips & Best Practices

1. **Always wait for elements** before interacting
2. **Take screenshots** at key steps for debugging
3. **Use delays** between actions for stability
4. **Test on same network** - Amazon may block automated access
5. **Handle timeouts** - Pages load differently at different times
6. **Verify after actions** - Don't assume success without checking
7. **Use specific locators** - Avoid brittle selectors
8. **Handle errors gracefully** - Have fallback locators ready

---

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review server logs: `LOG_LEVEL=debug npm start`
3. Inspect element in browser DevTools
4. Check main [README.md](../README.md) for API docs
5. Review [ARCHITECTURE.md](../ARCHITECTURE.md) for system design

---

**Happy automating! 🚀**
