# Quick Start Guide

## Prerequisites

- Node.js 20+ installed
- Chrome or Firefox browser installed

## Installation

```bash
cd selenium-mcp
npm install
```

## Running the Server

```bash
# Start the server
npm start

# Or run in development mode with auto-reload
npm run dev
```

The server will start on `http://localhost:3000`.

## Making Your First Request

### Health Check

Verify the server is running:

```bash
curl http://localhost:3000/health
```

### List Available Tools

```bash
curl http://localhost:3000/tools
```

### Navigate to a Website

```bash
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{"tool": "navigate", "params": {"url": "https://example.com"}}'
```

This will create a new browser session automatically.

### Use Existing Session

The response from the first request includes a `sessionId`. Use it for subsequent operations:

```bash
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "YOUR_SESSION_ID",
    "tool": "screenshot",
    "params": {}
  }'
```

## Quick Example Workflow

```bash
# 1. Run the example script (server must be running)
node examples/basic-workflow.js

# 2. Or manually:
# Navigate
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{"tool": "navigate", "params": {"url": "https://example.com"}}'

# Click element
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{"tool": "click", "params": {"locatorType": "id", "locatorValue": "element-id"}}'

# Enter text
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{"tool": "input", "params": {"locatorType": "css", "locatorValue": "input[name=search]", "text": "query"}}'

# Take screenshot
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{"tool": "screenshot", "params": {}}'
```

## Environment Variables

Configure the server with environment variables:

```bash
PORT=8080 LOG_LEVEL=debug npm start
```

- `PORT`: Server port (default: 3000)
- `LOG_LEVEL`: Logging level (default: info) - options: error, warn, info, debug

## Available Tools

1. **navigate** - Navigate to a URL
2. **click** - Click on an element
3. **input** - Enter text into a field
4. **wait** - Wait for an element to appear
5. **verify** - Verify element properties
6. **screenshot** - Capture a screenshot

## Stopping the Server

Press `Ctrl+C` to stop the server. All browser sessions will be cleaned up automatically.

## Documentation

For detailed documentation, see [README.md](../README.md).

## Troubleshooting

- **Port already in use**: Change the port with `PORT=3001 npm start`
- **Browser not found**: Ensure Chrome or Firefox is installed
- **Element not found**: Check your locator syntax in browser DevTools
- **Timeout errors**: Increase the timeout parameter in wait/verify tools

## Example Integration with LLM

The server is designed to work with LLMs as an MCP tool. Here's how an LLM would use it:

1. LLM receives user request: "Log in to example.com with username test"
2. LLM converts to tool calls:
   - Call `navigate` with URL
   - Call `input` to enter username
   - Call `input` to enter password
   - Call `click` to submit
3. LLM receives structured responses
4. LLM verifies success with `verify` or `screenshot` tool

## Next Steps

- Read the full [README.md](../README.md) for comprehensive documentation
- Explore [server/tools/](../server/tools/) to understand tool structure
- Check [examples/](../) for more examples
- Extend the server by adding custom tools

---

For issues or questions, refer to the main README.md documentation.
