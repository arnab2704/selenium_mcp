# Architecture Overview

## System Design

selenium-mcp is built on a modular, tool-based architecture designed for extensibility and reliability.

```
                    ┌─────────────────────┐
                    │   LLM / Client      │
                    │   Application       │
                    └──────────┬──────────┘
                               │
                    HTTP REST API (JSON)
                               │
                    ┌──────────▼──────────┐
                    │   Express Server    │
                    │   mcp-server.js     │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
       ┌────▼───┐      ┌──────▼──────┐    ┌─────▼─────┐
       │ Session │      │ Tool        │    │   Logger  │
       │ Manager │      │ Registry    │    │ (Winston) │
       └────┬───┘      └──────┬──────┘    └───────────┘
            │                  │
            │          ┌───────┴────────┐
            │          │                │
       ┌────▼──────────▼──────┐    ┌────▼────────┐
       │ Selenium Engine      │    │ 6 Tools:    │
       │ - WebDriver Factory  │    │ • navigate  │
       │ - Locator Builder    │    │ • click     │
       │ - Error Handling     │    │ • input     │
       └────────────┬─────────┘    │ • wait      │
                    │              │ • verify    │
                    │              │ • screenshot│
              ┌─────▼────────┐     └────────────┘
              │   Browser    │
              │ (Chrome/FF)  │
              └──────────────┘
```

## Core Components

### 1. **mcp-server.js** (Entry Point)

- Express HTTP server
- Handles incoming requests
- Routes to session manager and tool registry
- Provides REST API endpoints
- Manages server lifecycle (startup, shutdown)

**Key Endpoints:**

- `GET /health` - Server status
- `GET /tools` - List available tools
- `GET /sessions` - Active sessions info
- `POST /execute` - Execute a tool
- `POST /sessions/:sessionId/close` - Close session

### 2. **session-manager.js** (Session Orchestration)

- Manages multiple concurrent WebDriver instances
- Creates/retrieves/closes browser sessions
- Auto-cleanup of expired sessions (1 hour timeout)
- Session state tracking
- Statistics and monitoring

**Features:**

- UUID-based session IDs
- Automatic session creation if not provided
- Graceful session cleanup
- Memory efficient pooling

### 3. **tool-registry.js** (Tool Management)

- Central registry for all automation tools
- Dynamic tool loading via imports
- Parameter validation against JSON schemas
- Tool execution orchestration
- Error handling and response formatting

**Key Methods:**

- `getTool(name)` - Get tool definition
- `executeTool(name, driver, params)` - Execute with validation
- `getToolMetadata()` - Tool documentation

### 4. **selenium-engine.js** (WebDriver Wrapper)

- WebDriver factory for creating browser instances
- Browser configuration management
- Locator building and validation
- Safe shutdown procedures

**Utilities:**

- `createDriver(options)` - Create WebDriver instance
- `quitDriver(driver)` - Safely close driver
- `buildLocator(type, value)` - Create By locator
- `validateLocator(type, value)` - Validate locator

### 5. **logger.js** (Structured Logging)

- Winston-based centralized logging
- Configurable log levels
- Console output with timestamps
- JSON structured format for debugging

### 6. **Tools Directory** (Automation Capabilities)

#### navigate.js

- Navigate to URLs
- Validates URL format
- Waits for document ready

#### click.js

- Click on elements
- Scroll element into view
- Scroll stability delay

#### input.js

- Enter text in input fields
- Optional clear before input
- Scroll and stability handling

#### wait.js

- Wait for element presence
- Wait for element visibility
- Configurable timeout (10-60s)
- Polling mechanism

#### verify.js

- Verify text content
- Check visibility state
- Verify attributes
- Assertion-style validation

#### screenshot.js

- Capture viewport screenshots
- Full page screenshots
- Element-specific screenshots
- Base64-encoded output

## Data Flow

### Request Flow

```
1. Client sends POST /execute
   ├─ session_id (optional)
   ├─ tool name
   └─ parameters

2. Server receives request
   ├─ Validates tool exists
   ├─ Gets or creates session
   └─ Routes to tool registry

3. Tool Registry
   ├─ Validates parameters
   ├─ Executes tool
   └─ Handles errors

4. Tool Execution
   ├─ Uses WebDriver
   ├─ Performs action
   └─ Returns result

5. Server Response
   ├─ Status (success/fail)
   ├─ Result data
   └─ Session ID
```

### Session Lifecycle

```
Request 1: No session_id
  ├─ Session Manager creates new session
  ├─ WebDriver starts Chrome/Firefox
  ├─ Tool executes
  └─ Response includes session_id

Request 2: Includes session_id
  ├─ Session Manager retrieves session
  ├─ Updates last_used timestamp
  ├─ Tool executes on existing browser
  └─ Same WebDriver instance reused

Request N+1 (after 1 hour of inactivity)
  ├─ Cleanup interval detects old session
  ├─ Browser session closed
  └─ Next request creates new session
```

## Error Handling Strategy

### Three-Level Error Handling

1. **Tool Level**
   - Try/catch in tool execute()
   - Specific error messages
   - Logging of errors

2. **Registry Level**
   - Parameter validation errors
   - Tool not found errors
   - Execution wrapper errors

3. **Server Level**
   - HTTP error responses
   - Graceful error JSON
   - Request validation

### Error Response Format

```json
{
  "success": false,
  "error": "User-friendly error message",
  "tool": "tool-name",
  "details": "Technical details/stack trace"
}
```

## Security Measures

1. **Tool Allowlisting**
   - Only pre-defined tools can execute
   - No dynamic tool registration from outside

2. **Parameter Validation**
   - JSON Schema validation
   - Type checking
   - Range checking

3. **Locator Restrictions**
   - Limited to safe locator types
   - No arbitrary JavaScript execution
   - Validated before use

4. **Resource Constraints**
   - Session timeout (60 minutes)
   - Max concurrent sessions (unlimited but monitored)
   - Parameter size limits (50MB JSON)

## Performance Characteristics

- **Startup Time**: ~2-3 seconds
- **WebDriver Creation**: ~5-10 seconds
- **Tool Execution**: 100-500ms average
- **Memory per Session**: ~50-100MB
- **Concurrent Sessions**: 10+ tested

## Extension Points

### Adding New Tools

1. Create `server/tools/my-tool.js`
2. Export object with: name, description, schema, execute
3. Import in tool-registry.js
4. Auto-registered on startup

### Custom WebDriver Configuration

- Modify creation parameters in selenium-engine.js
- Support for browser options
- Custom timeouts

### Logging Customization

- Adjust Winston transports in logger.js
- Add file logging
- Change log format

## Dependencies

| Package            | Version | Purpose               |
| ------------------ | ------- | --------------------- |
| express            | ^4.18.2 | HTTP server framework |
| selenium-webdriver | ^4.15.0 | Browser automation    |
| winston            | ^3.11.0 | Structured logging    |

## Technology Stack

- **Runtime**: Node.js 20+ (ES Modules)
- **Server**: Express.js
- **Browser Automation**: Selenium WebDriver 4
- **Browser Support**: Chrome, Firefox (headless by default)
- **Logging**: Winston
- **Code Style**: JavaScript (ES6+)

## Configuration

### Supported Environment Variables

- `PORT`: Server port (default: 3000)
- `LOG_LEVEL`: Logging level (default: info)
- `NODE_ENV`: Environment (development/production)

### Runtime Configuration

Passed to `/execute` endpoint:

- Browser type
- Headless mode
- Implicit wait timeout

## Scalability Considerations

### Horizontal Scaling

- Stateless server design (except session storage)
- Sessions tied to server instance
- Multiple server instances need shared session store (future)

### Vertical Scaling

- Supports 10+ concurrent sessions per instance
- Memory usage linear with sessions
- CPU usage depends on tool complexity

### Future Improvements

- Redis session store for distributed systems
- WebSocket support for real-time updates
- Session persistence
- Load balancing support

---

For implementation details, see individual module documentation in source code comments.
