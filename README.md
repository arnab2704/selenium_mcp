# selenium-mcp

AI-Native, Non-Coder Web Automation Engine powered by Selenium and Model Context Protocol (MCP)

Selenium-MCP transforms natural language instructions into live browser automation.

Instead of writing test scripts, defining locators, or maintaining frameworks, users simply describe what they want to do — and the engine executes it safely and reliably using Selenium WebDriver.

## Features

- **Multi-Session Support**: Manage multiple concurrent browser sessions
- **Tool-Based Architecture**: Extensible tool registry for adding new capabilities
- **Type-Safe Parameters**: JSON Schema validation for all tool parameters
- **Error Handling**: Comprehensive error handling with detailed error messages
- **Structured Logging**: Winston-based logging for debugging and monitoring
- **Graceful Shutdown**: Proper cleanup of browser sessions on shutdown
- **RESTful API**: Clean HTTP endpoints for session and tool management

## Project Structure

```
selenium-mcp/
├── server/
│   ├── mcp-server.js           # Main Express server
│   ├── selenium-engine.js      # WebDriver factory and utilities
│   ├── session-manager.js      # Multi-session management
│   ├── tool-registry.js        # Tool discovery and execution
│   ├── logger.js               # Centralized logging
│   └── tools/
│       ├── navigate.js         # Navigate to URL
│       ├── click.js            # Click on element
│       ├── input.js            # Enter text in field
│       ├── wait.js             # Wait for element
│       ├── verify.js           # Verify element properties
│       └── screenshot.js       # Capture screenshots
├── package.json
└── README.md
```

## Installation

### Prerequisites

- Node.js 20+ (LTS or newer)
- Chrome or Firefox browser installed
- Compatible WebDriver (automatically managed by selenium-webdriver)

### Setup

```bash
# Clone or navigate to project directory
cd selenium-mcp

# Install dependencies
npm install

# Start the server
npm start

# For development with file watching
npm run dev
```

The server will start on `http://localhost:3000` by default.

## Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `LOG_LEVEL`: Logging level - 'error', 'warn', 'info', 'debug' (default: 'info')

```bash
PORT=8080 LOG_LEVEL=debug npm start
```

## How to Use in IDEs (IntelliJ IDEA & Visual Studio Code)

### Description

A short guide to open, run, and debug the `selenium-mcp` project from IntelliJ IDEA or VS Code. Use the IDE's run/debug configurations to start the MCP server, run example scripts, and attach the debugger to Node.js processes.

### Features

- Run and debug the MCP server directly from the IDE
- Launch example scripts (`examples/*.js`) with breakpoints
- Manage environment variables and npm scripts
- Integrated terminal for `npm install` and `npm start`
- Support for auto-reload in development using `npm run dev`

### Installation (IDE-specific)

- VS Code:
  - Install Node.js 20+ and open the project folder.
  - Install recommended extensions: ESLint, Prettier, Node.js, Debugger for Chrome (optional).
  - Run `npm install` in the integrated terminal.

- IntelliJ IDEA (or WebStorm):
  - Open the project folder.
  - Ensure Node.js plugin/Node interpreter is configured (File > Settings > Languages & Frameworks > Node.js).
  - Run `npm install` in the built-in terminal.

### Configuration

- VS Code `launch.json` example (place in `.vscode/launch.json`):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "pwa-node",
      "request": "launch",
      "name": "Launch MCP Server",
      "program": "${workspaceFolder}/server/mcp-server.js",
      "cwd": "${workspaceFolder}",
      "env": {
        "PORT": "3000",
        "LOG_LEVEL": "info"
      },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "type": "pwa-node",
      "request": "launch",
      "name": "Run Example Script",
      "program": "${workspaceFolder}/examples/amazon-iphone-test.js",
      "cwd": "${workspaceFolder}",
      "env": { "LOG_LEVEL": "info" }
    }
  ]
}
```

- IntelliJ Run Configuration:
  - Create a new "Node.js" run configuration.
  - Set JavaScript file to `server/mcp-server.js` and working directory to project root.
  - Add environment variables `PORT=3000` and `LOG_LEVEL=info`.
  - Use the built-in terminal to run example scripts or create separate Node.js configurations for them.

Notes:

- Use `npm run dev` when working with file watchers for fast feedback.
- If debugging browser interactions, consider running Chrome with remote debugging port or using headful mode.

## API Endpoints

### Health Check

```
GET /health
```

Returns server status and session statistics.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2026-02-23T10:30:00.000Z",
  "sessions": 2,
  "tools": 6
}
```

### List Available Tools

```
GET /tools
```

Returns all available tools with their schemas.

**Response:**

```json
{
  "tools": [
    {
      "name": "navigate",
      "description": "Navigate to a URL",
      "schema": { ... }
    },
    ...
  ],
  "count": 6
}
```

### List Active Sessions

```
GET /sessions
```

Returns information about all active browser sessions.

### Close a Session

```
POST /sessions/{sessionId}/close
```

Gracefully closes a specific browser session.

### Execute a Tool

```
POST /execute
```

Executes a tool with the specified parameters.

**Request Body:**

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "tool": "navigate",
  "params": {
    "url": "https://example.com"
  }
}
```

**Response:**

```json
{
  "success": true,
  "result": {
    "message": "Successfully navigated to https://example.com",
    "url": "https://example.com"
  },
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "tool": "navigate"
}
```

## Available Tools

### 1. navigate

Navigate to a URL.

**Parameters:**

- `url` (string, required): The URL to navigate to

**Example:**

```bash
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "navigate",
    "params": {"url": "https://example.com"}
  }'
```

### 2. click

Click on an element.

**Parameters:**

- `locatorType` (string, required): Type of locator - id, css, xpath, name, tag, className
- `locatorValue` (string, required): The locator value

**Example:**

```bash
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "click",
    "params": {
      "locatorType": "id",
      "locatorValue": "submit-button"
    }
  }'
```

### 3. input

Enter text into an input field.

**Parameters:**

- `locatorType` (string, required): Type of locator
- `locatorValue` (string, required): The locator value
- `text` (string, required): Text to enter
- `clear` (boolean, optional): Clear field before entering (default: true)

**Example:**

```bash
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "input",
    "params": {
      "locatorType": "css",
      "locatorValue": "input[name=\"email\"]",
      "text": "user@example.com",
      "clear": true
    }
  }'
```

### 4. wait

Wait for an element to appear.

**Parameters:**

- `locatorType` (string, required): Type of locator
- `locatorValue` (string, required): The locator value
- `timeout` (number, optional): Timeout in milliseconds (default: 10000, max: 60000)
- `condition` (string, optional): "present" or "visible" (default: "present")

**Example:**

```bash
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "wait",
    "params": {
      "locatorType": "xpath",
      "locatorValue": "//div[@class=\"success-message\"]",
      "timeout": 15000,
      "condition": "visible"
    }
  }'
```

### 5. verify

Verify element properties.

**Parameters:**

- `locatorType` (string, required): Type of locator
- `locatorValue` (string, required): The locator value
- `checkText` (string, optional): Expected text content
- `checkVisible` (boolean, optional): Check if element is visible
- `checkAttribute` (string, optional): Attribute name to check
- `checkAttributeValue` (string, optional): Expected attribute value

**Example:**

```bash
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "verify",
    "params": {
      "locatorType": "id",
      "locatorValue": "status",
      "checkText": "Success",
      "checkVisible": true
    }
  }'
```

### 6. screenshot

Capture a screenshot.

**Parameters:**

- `fullPage` (boolean, optional): Capture full page or viewport (default: false)
- `locatorType` (string, optional): Locator type for element screenshot
- `locatorValue` (string, optional): Locator value for element screenshot

**Example - Viewport screenshot:**

```bash
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "screenshot",
    "params": {}
  }'
```

**Example - Element screenshot:**

```bash
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "screenshot",
    "params": {
      "locatorType": "id",
      "locatorValue": "profile-card"
    }
  }'
```

## Error Handling

All errors return a consistent JSON response:

```json
{
  "success": false,
  "error": "Error message",
  "tool": "tool-name",
  "details": "Optional stack trace or additional details"
}
```

## Session Management

### Automatic Session Creation

If you don't provide a `sessionId`, the server creates a new browser session automatically:

```bash
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "navigate",
    "params": {"url": "https://example.com"}
  }'
```

The response includes the `sessionId` for future requests.

### Session Reuse

Reuse the same browser session for multiple operations:

```bash
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "tool": "click",
    "params": {"locatorType": "id", "locatorValue": "next-button"}
  }'
```

### Session Cleanup

Sessions expire automatically after 1 hour of inactivity. Explicitly close a session:

```bash
curl -X POST http://localhost:3000/sessions/550e8400-e29b-41d4-a716-446655440000/close
```

## Example Workflow

A complete example using curl:

```bash
# 1. Navigate to a website
SESSION_ID=$(curl -s -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "navigate",
    "params": {"url": "https://example.com"}
  }' | jq -r '.sessionId')

echo "Session: $SESSION_ID"

# 2. Enter text in a search field
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d "{
    \"sessionId\": \"$SESSION_ID\",
    \"tool\": \"input\",
    \"params\": {
      \"locatorType\": \"css\",
      \"locatorValue\": \"input[type='search']\",
      \"text\": \"selenium webdriver\"
    }
  }"

# 3. Click search button
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d "{
    \"sessionId\": \"$SESSION_ID\",
    \"tool\": \"click\",
    \"params\": {
      \"locatorType\": \"name\",
      \"locatorValue\": \"btnK\"
    }
  }"

# 4. Wait for results
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d "{
    \"sessionId\": \"$SESSION_ID\",
    \"tool\": \"wait\",
    \"params\": {
      \"locatorType\": \"css\",
      \"locatorValue\": \"div[data-sokoban-grid]\",
      \"timeout\": 10000
    }
  }"

# 5. Take a screenshot
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d "{
    \"sessionId\": \"$SESSION_ID\",
    \"tool\": \"screenshot\",
    \"params\": {}
  }"

# 6. Close the session
curl -X POST http://localhost:3000/sessions/$SESSION_ID/close
```

## Security Considerations

This MCP server implements security best practices:

1. **No Arbitrary JavaScript Execution**: Tools are pre-defined and validated
2. **Parameter Validation**: All parameters are validated against JSON schemas
3. **Locator Validation**: Supported locator types are restricted
4. **No Direct System Access**: No shell command execution or file system access
5. **Error Sanitization**: Detailed errors logged, generic messages returned to client

## Extending with New Tools

To add a new tool:

1. **Create a new file** in `server/tools/`:

```javascript
// server/tools/custom-tool.js
export default {
  name: "custom-tool",
  description: "Description of what this tool does",
  schema: {
    type: "object",
    properties: {
      param1: { type: "string", description: "Description" },
    },
    required: ["param1"],
  },

  async execute(driver, params) {
    // Implementation
    return { success: true, message: "Done" };
  },
};
```

2. **Register in `server/tool-registry.js`**:

```javascript
import customTool from "./tools/custom-tool.js";

// In registerTools():
allTools.push(customTool);
```

## Troubleshooting

### Server won't start

- Check if port 3000 is available
- Check Node.js version: `node --version` (must be 20+)
- Check logs: `LOG_LEVEL=debug npm start`

### Browser session errors

- Ensure Chrome/Firefox is installed
- Check browser path configuration
- Try headless mode: Check logs for browser startup errors

### Element not found errors

- Verify locator is correct
- Try using CSS selectors or XPath with browser dev tools
- Increase wait timeout for slow-loading pages

### Screenshots incomplete

- Full page screenshots may take longer on large pages
- Try viewport screenshots for faster results

## Performance

- **Concurrent Sessions**: Tested with 10+ concurrent sessions
- **Tool Execution**: Typically 100-500ms per tool execution
- **Memory**: ~100MB base + ~50-100MB per browser session

## Development

```bash
# Install dependencies
npm install

# Run in development mode with file watching
npm run dev

# Run tests (when added)
npm test
```

## License

MIT

## Contributing

Contributions are welcome! Please ensure:

1. Code follows the existing style
2. Tools include comprehensive documentation
3. Error handling is robust
4. Tests are included for new features

## Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Check existing documentation
- Review error logs with `LOG_LEVEL=debug`

---

**Built with ❤️ for LLM-driven test automation**
