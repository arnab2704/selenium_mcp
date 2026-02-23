# How to Find Correct Selectors for Amazon

When the Amazon test fails with "element not found", it usually means the CSS selectors or IDs have changed. This guide shows how to find the correct selectors.

## Quick Method: Use Browser DevTools

### Step 1: Open DevTools

1. Open amazon.co.uk in your browser
2. Press `F12` or `Right-click → Inspect` to open Developer Tools
3. Click the element picker icon (top-left of DevTools)

### Step 2: Find the Search Box

1. Click the search box on the page
2. DevTools highlights the HTML
3. Look for the element's:
   - **id** attribute
   - **class** attribute
   - **name** attribute
4. Right-click the highlighted element → Copy → Copy selector

**Example output:**

```html
<input
  id="twotabsearchtextbox"
  class="nav-input"
  placeholder="Search Amazon.co.uk"
/>
```

You would use:

```javascript
locatorType: "id",
locatorValue: "twotabsearchtextbox"
```

### Step 3: Find the Search Button

1. Look for the search button next to the search box
2. Click it to inspect it
3. Look at its attributes

**Example:**

```html
<input class="nav-input nav-right" value="Go" type="submit" />
```

You could use:

```javascript
locatorType: "css",
locatorValue: "input[type='submit'][class*='nav-right']"
```

Or:

```javascript
locatorType: "xpath",
locatorValue: "//input[@type='submit' and contains(@class, 'nav-right')]"
```

## Locator Priority

Try in this order:

1. **id** (most reliable)

   ```javascript
   locatorType: "id",
   locatorValue: "element-id"
   ```

2. **name** (reliable)

   ```javascript
   locatorType: "name",
   locatorValue: "fieldName"
   ```

3. **CSS selector** (common, but can break with CSS changes)

   ```javascript
   locatorType: "css",
   locatorValue: ".class-name"
   ```

4. **XPath** (flexible, but slower and complex)
   ```javascript
   locatorType: "xpath",
   locatorValue: "//button[contains(text(), 'Search')]"
   ```

## Current Amazon Selectors

Here are currently working selectors for Amazon.co.uk (as of Feb 2026):

### Navigation Elements

| Element            | Best Locator Type | Value                                         |
| ------------------ | ----------------- | --------------------------------------------- |
| Search Box         | id                | `twotabsearchtextbox`                         |
| Search Button      | css               | `button[type="submit"]` (may need adjustment) |
| Product Listing    | css               | `[data-component-type="s-search-result"]`     |
| First Product Link | css               | `h2 a` within search result                   |
| Add to Cart Button | id                | `add-to-cart-button`                          |
| Cart Icon          | id                | `nav-cart-count-container`                    |

## Testing Selectors

### Method 1: Console Test

1. Open DevTools Console (F12, then Console tab)
2. Test CSS selector:
   ```javascript
   document.querySelectorAll("button[type='submit']").length;
   ```
3. If it returns > 0, the selector works
4. Find exact element:
   ```javascript
   document.querySelector("button[type='submit']");
   ```

### Method 2: XPath Test

In Console:

```javascript
document.evaluate(
  "//button[@type='submit']",
  document,
  null,
  XPathResult.FIRST_ORDERED_NODE_TYPE,
  null,
).singleNodeValue;
```

If it returns an element, the XPath works.

## Real-World Debugging

### Scenario 1: Search Button Not Found

**Original:**

```javascript
locatorType: "css",
locatorValue: "button[type='submit']"
```

**Debugging Steps:**

1. Inspect the search button in DevTools
2. Note all classes: `<button class="nav-searchbar-search" type="submit">...`
3. New selector:
   ```javascript
   locatorType: "css",
   locatorValue: "button.nav-searchbar-search"
   ```

### Scenario 2: Product Not Found

**Original:**

```javascript
locatorType: "css",
locatorValue: "[data-component-type='s-search-result'] h2 a"
```

**Debugging Steps:**

1. Inspect a product in search results
2. Check actual structure:
   ```html
   <div class="s-result-item">
     <h2><a href="/dp/...">Product Name</a></h2>
   </div>
   ```
3. New selector:
   ```javascript
   locatorType: "css",
   locatorValue: "div.s-result-item h2 a"
   ```

## Updating the Test Script

### Node.js Example

Find and replace in `amazon-iphone-test.js`:

```javascript
// OLD - Line ~100
await makeRequest("click", {
  locatorType: "css",
  locatorValue: 'button[type="submit"]', // ← OLD
});

// NEW - Replace with
await makeRequest("click", {
  locatorType: "css",
  locatorValue: "button.nav-searchbar-search", // ← NEW
});
```

### PowerShell Example

In `amazon-iphone-test.ps1`:

```powershell
# OLD
locatorValue = "button[type='submit']"

# NEW
locatorValue = "button.nav-searchbar-search"
```

### Bash Example

In `amazon-iphone-test.sh`:

```bash
# OLD
"locatorValue":"button[type=\"submit\"]"

# NEW
"locatorValue":"button.nav-searchbar-search"
```

## Advanced Selector Techniques

### Attribute Matching

Find elements by attribute value:

```javascript
locatorValue: "input[placeholder='Search Amazon.co.uk']";
```

### Partial Matching

Match part of attribute:

```javascript
locatorValue: "a[href*='/dp/']"; // Any link with /dp/
locatorValue: "span[class*='Price']"; // Any class containing Price
```

### Text Content

Match by visible text (XPath only):

```javascript
locatorValue: "//button[contains(text(), 'Add to')]";
locatorType: "xpath";
```

### Combination (AND operator)

Match multiple conditions:

```javascript
locatorValue: "button[type='submit'].nav-search"; // CSS
locatorValue: "//button[@type='submit' and @class='nav-search']"; // XPath
```

## Common Amazon Elements

### Search and Navigation

```javascript
// Search box
{ locatorType: "id", locatorValue: "twotabsearchtextbox" }

// Category dropdown
{ locatorType: "id", locatorValue: "searchDropdownBox" }

// Search button
{ locatorType: "css", locatorValue: "button[type='submit']" }

// Cart link
{ locatorType: "id", locatorValue: "nav-cart" }
```

### Product Page

```javascript
// Product title
{ locatorType: "id", locatorValue: "productTitle" }

// Price
{ locatorType: "css", locatorValue: ".a-price-whole" }

// Add to Cart button
{ locatorType: "id", locatorValue: "add-to-cart-button" }

// Product image
{ locatorType: "id", locatorValue: "landingImage" }
```

### Checkout

```javascript
// Checkout button
{ locatorType: "name", locatorValue: "proceedToRetailCheckout" }

// Quantity selector
{ locatorType: "id", locatorValue: "quantity" }

// Continue button
{ locatorType: "css", locatorValue: "input[value='Continue']" }
```

## Stability Tips

1. **Use IDs when possible** - They rarely change
2. **Avoid deeply nested selectors** - They break easily
3. **Use contains() for text matching** - Handles whitespace
4. **Test in Console first** - Before adding to script
5. **Use wait() before clicking** - Ensure element is ready
6. **Add error handling** - Have backup selectors

## Troubleshooting Workflow

When your selector fails:

1. **Verify in Console**

   ```javascript
   document.querySelectorAll("your-selector").length > 0;
   ```

2. **Try simpler selectors**
   - ID → name → class → tag

3. **Check element exists**
   - Right-click → Inspect
   - Copy selector from DevTools

4. **Try XPath variations**
   - Different text matching
   - Different attribute combinations

5. **Add logging**
   - Take screenshots
   - Use verify tool to debug

## Resources

- [MDN CSS Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
- [XPath Tutorial](https://www.w3schools.com/xml/xpath_intro.asp)
- [Selenium Locators](https://www.selenium.dev/documentation/webdriver/elements/locators/)

---

**Pro Tip:** Amazon updates their site frequently. If selectors break, always check DevTools first before updating your test!
