# Amazon Test Setup Complete ✅

## What Was Created

You now have **production-ready test scripts** for browser automation on Amazon UK and other websites!

---

## 📁 Test Files

### 1. **Test Scripts** (3 versions)

#### **Node.js Version** (Recommended)

- **File:** `amazon-iphone-test.js`
- **Platform:** All (Windows, Mac, Linux)
- **Run:** `node examples/amazon-iphone-test.js`
- **Features:** Error handling, fallback selectors, console logging

#### **PowerShell Version** (Windows Native)

- **File:** `amazon-iphone-test.ps1`
- **Platform:** Windows
- **Run:** `.\examples\amazon-iphone-test.ps1`
- **Features:** Colored output, native Windows integration

#### **Bash Version** (Unix)

- **File:** `amazon-iphone-test.sh`
- **Platform:** macOS/Linux
- **Run:** `./examples/amazon-iphone-test.sh`
- **Features:** Shell scripting, jq parsing

### 2. **Documentation** (4 guides)

- **README.md** - Overview of all examples
- **TEST_SCRIPTS_SUMMARY.md** - This file's companion
- **AMAZON_TEST_GUIDE.md** - Complete Amazon test guide
- **SELECTORS_GUIDE.md** - How to find CSS/XPath selectors

### 3. **Basic Example**

- **basic-workflow.js** - Simple Node.js example for learning

---

## 🚀 Quick Start

### Step 1: Start the Server

```bash
npm start
```

You should see:

```
✓ Server is running
  Available tools: navigate, click, input, wait, verify, screenshot
  Server listening on port 3000
```

### Step 2: Run the Test

In another terminal:

```bash
node examples/amazon-iphone-test.js
```

### Step 3: Watch It Work

The test will:

1. Navigate to amazon.co.uk
2. Search for "iPhone"
3. Click the first product
4. Add it to cart
5. Take screenshots at each step
6. Verify success

---

## 📊 Test Workflow

```
┌─────────────────────────────────────────────────┐
│   MCP Server (Express)                          │
│   Port: 3000                                    │
└────────────┬────────────────────────────────────┘
             │
      HTTP Requests │
             │
┌────────────▼────────────────────────────────────┐
│   Test Script                                   │
│   (Node.js / PowerShell / Bash)                │
│                                                 │
│   1. Navigate to Amazon                        │
│   2. Search for "iPhone"                       │
│   3. Click product                             │
│   4. Add to cart                               │
│   5. Verify                                    │
└────────────┬────────────────────────────────────┘
             │
      Raw HTTP  │
             │
┌────────────▼────────────────────────────────────┐
│   Selenium WebDriver                            │
│   - Browser Control                            │
│   - Click, Type, Wait                          │
│   - Screenshots                                │
└─────────────────────────────────────────────────┘
             │
             ▼
         [ Browser ]
         Chrome/Firefox
             │
             ▼
        [ amazon.co.uk ]
```

---

## 🎯 What Each Test Does

### Test 1: Basic Workflow (simple)

**File:** `basic-workflow.js`

```
Navigate → Wait → Verify → Screenshot
```

- Loads example.com
- Waits for h1 element
- Verifies page title
- Takes screenshot

**Duration:** ~5 seconds

### Test 2: Amazon iPhone (advanced)

**File:** `amazon-iphone-test.js`, `.ps1`, `.sh`

```
Navigate → Search → Wait → Click Product →
Wait Button → Add to Cart → Verify → Screenshot
```

- Loads amazon.co.uk
- Searches for "iPhone"
- Navigates through products
- Adds to cart
- Takes screenshots
- Verifies in cart

**Duration:** 30-60 seconds (network dependent)

---

## 📝 Available Tools in Tests

| Tool           | What It Does               | Example                    |
| -------------- | -------------------------- | -------------------------- |
| **navigate**   | Go to a URL                | amazon.co.uk               |
| **wait**       | Wait for element to appear | Search results             |
| **input**      | Type text in field         | "iPhone" in search         |
| **click**      | Click an element           | Search button, Add to Cart |
| **verify**     | Check element properties   | Product in cart            |
| **screenshot** | Take a screenshot          | Capture page state         |

---

## 🔍 How It Works

### Step-by-Step Execution

```javascript
// 1. Request to server
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "tool": "navigate",
  "params": { "url": "https://amazon.co.uk" }
}

↓ (via HTTP POST)

// 2. Server routes to tool
tool-registry.js → navigate.js

↓

// 3. Tool executes with WebDriver
WebDriver opens Chrome → Navigate to URL

↓

// 4. Response back
{
  "success": true,
  "result": { "message": "Successfully navigated", "url": "..." },
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}

↓ (via HTTP response)

// 5. Test receives and continues
console.log("✓ Navigate successful")
```

---

## 💡 Key Features

### ✅ Robust Error Handling

- Try/catch blocks everywhere
- Alternative selectors if primary fails
- Detailed error messages

### ✅ Real-world Timing

- Delays between actions (for stability)
- Waits for elements before clicking
- Handles slow page loads

### ✅ Visual Verification

- Screenshots at key steps
- Returned as base64
- Can be saved to files

### ✅ Session Management

- Each test gets unique session ID
- Session lasts 1 hour
- Reusable across multiple operations

---

## 🛠 When Something Goes Wrong

### Error: "Element not found"

**Cause:** Amazon changed their HTML

**Solution:**

1. Open amazon.co.uk in browser
2. Right-click element → Inspect
3. Find the selector in DevTools
4. Update the test file
5. See [SELECTORS_GUIDE.md](SELECTORS_GUIDE.md) for details

### Error: "Server not responding"

**Cause:** Server not running

**Solution:**

```bash
npm start
```

### Error: "Timeout waiting for element"

**Cause:** Page took too long to load

**Solution:**

1. Check internet speed
2. Try again (sometimes Amazon is slow)
3. Increase timeout: `"timeout": 20000`

---

## 🎓 Learning Path

### For Beginners

1. **Understand the API**
   - Read [README.md](../README.md)
   - Check [QUICKSTART.md](../QUICKSTART.md)

2. **Run basic example**

   ```bash
   node examples/basic-workflow.js
   ```

3. **Read test code**
   - Open `amazon-iphone-test.js`
   - Follow comments
   - Understand each step

### For Developers

1. **Study architecture**
   - Read [ARCHITECTURE.md](../ARCHITECTURE.md)
   - Understand tool registry pattern
   - Learn session management

2. **Create custom test**
   - Copy `amazon-iphone-test.js`
   - Replace URLs and selectors
   - Add your own steps

### For DevOps

1. **Integrate with CI/CD**

   ```yaml
   - name: Run Tests
     run: node examples/amazon-iphone-test.js
   ```

2. **Set up schedules**
   ```bash
   # Daily at 9 AM
   0 9 * * * npm start && sleep 5 && node examples/amazon-iphone-test.js
   ```

---

## 📚 Documentation Files

| File                      | Purpose                     |
| ------------------------- | --------------------------- |
| `README.md`               | Overview of all examples    |
| `TEST_SCRIPTS_SUMMARY.md` | Detailed breakdown          |
| `AMAZON_TEST_GUIDE.md`    | Amazon test walkthrough     |
| `SELECTORS_GUIDE.md`      | Finding CSS/XPath selectors |
| `basic-workflow.js`       | Simple learning example     |

---

## 🌐 Running on Different Websites

The same tools work on any website!

### Example: Test Google

```javascript
await makeRequest("navigate", { url: "https://google.com" });
await makeRequest("input", {
  locatorType: "name",
  locatorValue: "q",
  text: "selenium-mcp",
});
await makeRequest("click", {
  locatorType: "xpath",
  locatorValue: '//input[@value="Google Search"]',
});
```

### Example: Test LinkedIn

```javascript
await makeRequest("navigate", { url: "https://linkedin.com/login" });
await makeRequest("input", {
  locatorType: "id",
  locatorValue: "username",
  text: "your@email.com",
});
```

---

## 🚀 Advanced Usage

### Capture Element Screenshots

```javascript
await makeRequest("screenshot", {
  locatorType: "id",
  locatorValue: "product-card",
  // Takes screenshot of just this element
});
```

### Full Page Screenshots

```javascript
await makeRequest("screenshot", {
  fullPage: true,
  // Takes screenshot of entire page
});
```

### Wait for Visibility

```javascript
await makeRequest("wait", {
  locatorType: "css",
  locatorValue: ".success-message",
  condition: "visible", // vs 'present'
  timeout: 15000,
});
```

---

## 📊 Performance Metrics

| Operation     | Time          |
| ------------- | ------------- |
| Navigate      | 2-3 seconds   |
| Search        | 3-5 seconds   |
| Click         | 1 second      |
| Screenshot    | < 1 second    |
| Full workflow | 30-60 seconds |

---

## ✅ Verification Checklist

- ✅ Server starts: `npm start`
- ✅ Test runs: `node examples/amazon-iphone-test.js`
- ✅ Browser opens automatically
- ✅ Navigation works
- ✅ Search works
- ✅ Add to cart works
- ✅ Screenshots captured
- ✅ Session ID generated
- ✅ All steps logged

---

## 🔗 Links

- **Main README:** [../README.md](../README.md)
- **API Reference:** [../README.md#available-tools](../README.md#available-tools)
- **Architecture:** [../ARCHITECTURE.md](../ARCHITECTURE.md)
- **Quick Start:** [../QUICKSTART.md](../QUICKSTART.md)

---

## 💻 Test Commands

### Run basic example

```bash
node examples/basic-workflow.js
```

### Run Amazon test (Node.js)

```bash
node examples/amazon-iphone-test.js
```

### Run Amazon test (PowerShell)

```powershell
.\examples\amazon-iphone-test.ps1
```

### Run Amazon test (Bash)

```bash
./examples/amazon-iphone-test.sh
```

---

## 📞 Support

**Having issues?**

1. Check error message
2. Review [SELECTORS_GUIDE.md](SELECTORS_GUIDE.md)
3. Run with debug logging: `LOG_LEVEL=debug npm start`
4. See [../README.md](../README.md) troubleshooting section

---

## 🎉 You're Ready!

```bash
# Terminal 1: Start server
npm start

# Terminal 2: Run test
node examples/amazon-iphone-test.js
```

**Your test automation is running!** 🚀

---

**Next:** Read [README.md](README.md) for detailed examples guide.
