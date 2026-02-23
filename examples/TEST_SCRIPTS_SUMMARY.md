# Test Scripts Summary

## Overview

The selenium-mcp project includes comprehensive test scripts demonstrating browser automation capabilities. These examples range from simple workflows to real-world e-commerce scenarios.

## Available Test Scripts

### 📋 Directory Structure

```
examples/
├── README.md                    # Examples overview and guide
├── AMAZON_TEST_GUIDE.md        # Detailed Amazon test documentation
├── SELECTORS_GUIDE.md          # How to find correct CSS/XPath selectors
├── basic-workflow.js           # Simple Node.js example (Example.com)
├── amazon-iphone-test.js       # Node.js - iPhone search & add to cart
├── amazon-iphone-test.ps1      # PowerShell - iPhone search & add to cart
└── amazon-iphone-test.sh       # Bash - iPhone search & add to cart
```

---

## Quick Reference

| Script                     | Language   | Platform    | Complexity | Use Case                 |
| -------------------------- | ---------- | ----------- | ---------- | ------------------------ |
| **basic-workflow.js**      | Node.js    | All         | Basic      | Learning the API         |
| **amazon-iphone-test.js**  | Node.js    | All         | Advanced   | E-commerce automation    |
| **amazon-iphone-test.ps1** | PowerShell | Windows     | Advanced   | Native Windows scripting |
| **amazon-iphone-test.sh**  | Bash       | macOS/Linux | Advanced   | Unix automation          |

---

## Running the Tests

### Prerequisites

```bash
# 1. Start the MCP server
npm start

# 2. In another terminal, run a test
```

### Test 1: Basic Workflow

**Purpose:** Learn the basics

```bash
node examples/basic-workflow.js
```

**What it tests:**

- Navigate to example.com
- Wait for page elements
- Verify content
- Take screenshot

**Duration:** ~5 seconds
**Complexity:** ⭐ Beginner

---

### Test 2: Amazon iPhone (Node.js)

**Purpose:** Real-world e-commerce automation

```bash
node examples/amazon-iphone-test.js
```

**What it tests:**

- Navigate to amazon.co.uk
- Search for "iPhone"
- Click first product
- Add to cart
- Verify in cart
- Take screenshots

**Duration:** ~30-60 seconds (depends on network)
**Complexity:** ⭐⭐⭐ Advanced

**Output:**

```
============================================================
🛍️  Amazon iPhone Search & Add to Cart Test
============================================================

✓ navigate - Loading Amazon homepage
✓ wait - Search box to appear
✓ input - Typing "iPhone" in search box
✓ click - Submitting search
✓ wait - Product results to appear
✓ screenshot - Search results page
✓ click - Opening first product
✓ wait - Product page elements
✓ screenshot - Product details page
✓ wait - Add to Cart button
✓ click - Adding product to cart
✓ screenshot - Add to cart confirmation
✓ verify - Success message visible
✓ click - Opening shopping cart
✓ verify - Product visible in cart
✓ screenshot - Shopping cart page

============================================================
✅ TEST COMPLETED SUCCESSFULLY
============================================================

Session ID: 550e8400-e29b-41d4-a716-446655440000
```

---

### Test 3: Amazon iPhone (PowerShell)

**Platform:** Windows

```powershell
.\examples\amazon-iphone-test.ps1
```

**Advantages:**

- Native PowerShell (no external dependencies)
- Colored console output
- Works on Windows 7+
- No Node.js required (standalone)

---

### Test 4: Amazon iPhone (Bash)

**Platform:** macOS/Linux

```bash
chmod +x examples/amazon-iphone-test.sh
./examples/amazon-iphone-test.sh
```

**Requirements:**

- jq for JSON parsing: `brew install jq`
- curl (usually pre-installed)

---

## Test Features Demonstrated

### Locator Strategies

✅ **ID Locators**

```javascript
locatorType: "id",
locatorValue: "add-to-cart-button"
```

✅ **CSS Selectors**

```javascript
locatorType: "css",
locatorValue: "[data-component-type='s-search-result']"
```

✅ **XPath (XPath)** - Fallback options in test

### Tool Usage

✅ **navigate** - Go to URLs
✅ **wait** - Wait for elements (presence & visibility)
✅ **input** - Enter text in fields
✅ **click** - Click elements
✅ **verify** - Verify element properties
✅ **screenshot** - Capture pages

### Error Handling

✅ Try/catch blocks
✅ Error logging
✅ Alternative locators
✅ Graceful fallbacks

### Real-world Scenarios

✅ Page load timing
✅ Delays between actions
✅ Element scrolling
✅ Dynamic content
✅ Multiple verification steps

---

## Expected Results

### Successful Test Run

You should see:

- ✓ checkmarks for each successful step
- Screenshot size confirmations
- "TEST COMPLETED SUCCESSFULLY" message
- Session ID for reference

### When Tests Fail

Common failures are expected:

- **Element locators change** - Amazon updates HTML frequently
- **Network issues** - Slow connections timeout
- **Product unavailable** - iPhone may be out of stock
- **Bot protection** - Amazon may block automated requests

**Solution:** See [SELECTORS_GUIDE.md](SELECTORS_GUIDE.md) for updating selectors.

---

## Test Workflow Details

### Amazon iPhone Test - 15 Steps

```
STEP 1: Navigate to Amazon UK
  └─ Load homepage

STEP 2: Wait for search box
  └─ Ensure page elements loaded

STEP 3: Search for iPhone
  └─ Type "iPhone" in search box

STEP 4: Click search button
  └─ Submit search query

STEP 5: Wait for results
  └─ Ensure products loaded

STEP 6: Screenshot results
  └─ Capture search results page

STEP 7: Click first product
  └─ Open first iPhone listing

STEP 8: Wait for product page
  └─ Ensure product details loaded

STEP 9: Screenshot product page
  └─ Capture full product page

STEP 10: Wait for Add to Cart button
  └─ Ensure button is clickable

STEP 11: Add to Cart
  └─ Click the Add to Cart button

STEP 12: Screenshot confirmation
  └─ Capture success notification

STEP 13: Verify added to cart
  └─ Check success message appears

STEP 14: Navigate to cart
  └─ Click cart icon

STEP 15: Take final screenshot
  └─ Capture cart with item
```

---

## Customizing Tests

### Use Different Search Term

Edit the test file:

**Node.js (Line ~78):**

```javascript
await makeRequest("input", {
  text: "Samsung Galaxy", // ← Change this
});
```

### Use Different Website

Edit the navigate URL:

```javascript
// Change from amazon.co.uk to amazon.com
await makeRequest("navigate", {
  url: "https://www.amazon.com", // ← Change this
});
```

### Add More Steps

Insert new requests between existing ones:

```javascript
// After adding to cart, maybe verify price?
await makeRequest("verify", {
  locatorType: "css",
  locatorValue: ".a-price-whole",
  checkText: "£999",
});
```

---

## Integration Examples

### With Shell Script

```bash
#!/bin/bash
# Run test and check exit code
node examples/amazon-iphone-test.js
if [ $? -eq 0 ]; then
  echo "Test passed!"
else
  echo "Test failed!"
fi
```

### With CI/CD Pipeline

```yaml
# GitHub Actions example
- name: Run Amazon Test
  run: node examples/amazon-iphone-test.js

- name: Check Result
  if: success()
  run: echo "✅ Automation test passed"
```

### With Scheduled Jobs

```bash
# Cron job (Linux/macOS)
0 9 * * * cd /path/to/selenium-mcp && npm start &
0 9 * * * sleep 5 && node examples/amazon-iphone-test.js
```

---

## Troubleshooting

### Server Not Running

```
Error: Cannot connect to http://localhost:3000
```

Solution:

```bash
npm start  # Start the server in another terminal
```

### Element Not Found

```
Error: Failed to click element
Unable to locate element
```

Solution:

1. See [SELECTORS_GUIDE.md](SELECTORS_GUIDE.md)
2. Use browser DevTools to find current selectors
3. Update the test script with new selectors

### Timeout Errors

```
Error: Timeout waiting for element
```

Solution:

1. Increase timeout: `"timeout": 20000`
2. Check network speed
3. Try again - sometimes Amazon is slow

### Session Expired

```
Error: Session not found
```

Solution:

1. Sessions expire after 1 hour
2. Create a new test run
3. Check server is still running

---

## Performance Notes

- **Navigation:** 2-3 seconds
- **Search:** 3-5 seconds
- **Click:** ~1 second
- **Full workflow:** 30-60 seconds
- **Bottle neck:** Network speed to Amazon

---

## Best Practices

1. ✅ **Always wait** for elements before clicking
2. ✅ **Take screenshots** at key steps
3. ✅ **Verify success** with verify/check steps
4. ✅ **Handle errors** gracefully with fallbacks
5. ✅ **Add delays** between rapid actions
6. ✅ **Use specific selectors** (ID > name > CSS > XPath)
7. ✅ **Test locally first** before running in production
8. ✅ **Keep selectors updated** as websites change

---

## File Descriptions

### [README.md](README.md)

Complete guide to all examples and how to use them.

### [AMAZON_TEST_GUIDE.md](AMAZON_TEST_GUIDE.md)

Detailed breakdown of Amazon test with manual curl examples.

### [SELECTORS_GUIDE.md](SELECTORS_GUIDE.md)

How to find and update CSS/XPath selectors when tests break.

### [basic-workflow.js](basic-workflow.js)

Simple example navigating to example.com and verifying content.

### [amazon-iphone-test.js](amazon-iphone-test.js)

Complete e-commerce workflow written in Node.js.

### [amazon-iphone-test.ps1](amazon-iphone-test.ps1)

Same workflow written in PowerShell for Windows.

### [amazon-iphone-test.sh](amazon-iphone-test.sh)

Same workflow written in Bash for macOS/Linux.

---

## Next Steps

1. **Run the basic test** - Get familiar with the API

   ```bash
   node examples/basic-workflow.js
   ```

2. **Run the Amazon test** - See real-world automation

   ```bash
   node examples/amazon-iphone-test.js
   ```

3. **Update selectors** - Learn from [SELECTORS_GUIDE.md](SELECTORS_GUIDE.md)
4. **Create your own** - Build custom tests using the template

5. **Integrate with LLM** - Use for AI-driven automation

---

## Support

- **API Reference:** See [../README.md](../README.md)
- **Architecture:** See [../ARCHITECTURE.md](../ARCHITECTURE.md)
- **Quick Start:** See [../QUICKSTART.md](../QUICKSTART.md)

---

**Ready to automate? Start with:**

```bash
npm start
node examples/amazon-iphone-test.js
```

📸 **Screenshots at each step** will show you exactly what's happening!
