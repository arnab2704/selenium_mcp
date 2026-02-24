# 🚀 Selenium-MCP

> Turn plain English into browser automation using AI-powered Selenium.

Selenium-MCP is an AI-native, non-coder web automation engine that
connects Large Language Models (LLMs) to Selenium WebDriver using a
secure, tool-based execution layer.

Instead of writing scripts or managing locators, users describe what
they want to do --- and Selenium-MCP executes it safely in a real
browser session.

------------------------------------------------------------------------

## 🧠 Why Selenium-MCP?

Traditional automation requires:

-   Programming knowledge\
-   Framework setup\
-   Locator management\
-   Continuous maintenance

Selenium-MCP removes these barriers by introducing:

-   Intent-driven automation\
-   Tool-based execution model\
-   Secure browser control layer\
-   Multi-session management

This project bridges AI reasoning and browser automation in a safe and
structured way.

------------------------------------------------------------------------

## 🎯 Who Is This For?

-   QA teams exploring AI-driven automation\
-   Non-technical users automating workflows\
-   Developers building AI agents\
-   Startups building AI-powered RPA\
-   Automation engineers building next-gen tooling

------------------------------------------------------------------------

## 🏗 Architecture Overview

User Intent\
↓\
LLM converts intent → structured tool call\
↓\
Selenium-MCP validates tool\
↓\
Selenium WebDriver executes\
↓\
Structured JSON response returned

Only predefined tools are allowed.\
No arbitrary JavaScript execution.\
No system-level access.

------------------------------------------------------------------------

## ⚙️ Core Features (Phase 1 -- MVP)

-   Tool-based execution engine\
-   Multi-session browser management\
-   Structured JSON responses\
-   Secure tool registry\
-   Chrome headless support\
-   Parameter validation\
-   Graceful error handling

------------------------------------------------------------------------

## 📦 Installation

``` bash
git clone https://github.com/arnab2704/selenium_mcp.git
cd selenium_mcp
npm install
```

------------------------------------------------------------------------

## ▶️ Running the Server

``` bash
npm start
```

Default server:

http://localhost:3000

------------------------------------------------------------------------

## 🚀 Quick Start Example

### 1️⃣ Navigate to a Website

``` bash
curl -X POST http://localhost:3000/execute -H "Content-Type: application/json" -d '{
  "sessionId": "demo",
  "tool": "navigate",
  "params": {
    "url": "https://example.com"
  }
}'
```

------------------------------------------------------------------------

### 2️⃣ Verify an Element Exists

``` bash
curl -X POST http://localhost:3000/execute -H "Content-Type: application/json" -d '{
  "sessionId": "demo",
  "tool": "verify",
  "params": {
    "locatorType": "css",
    "locatorValue": "h1"
  }
}'
```

------------------------------------------------------------------------

## 🔌 API Reference

### GET /health

Check server status.

------------------------------------------------------------------------

### GET /tools

Returns all available tools and their parameter schemas.

------------------------------------------------------------------------

### GET /sessions

Lists active browser sessions.

------------------------------------------------------------------------

### POST /execute

Executes a tool.

Request body:

{ "sessionId": "string", "tool": "navigate", "params": {} }

Response:

{ "success": true, "sessionId": "demo", "result": "Navigation
successful" }

------------------------------------------------------------------------

### POST /sessions/{id}/close

Closes a browser session safely.

------------------------------------------------------------------------

## 🧩 Supported Tools (Phase 1)

-   navigate\
-   click\
-   input\
-   wait\
-   verify\
-   screenshot

Each tool:

-   Has defined schema\
-   Validates parameters\
-   Handles errors safely\
-   Returns structured JSON

------------------------------------------------------------------------

## 🔐 Security Model

Selenium-MCP is designed for AI-driven usage and includes strict
guardrails:

-   Only predefined tools can execute\
-   No arbitrary JavaScript execution\
-   No file system access\
-   Parameter validation required\
-   Isolated browser sessions\
-   Graceful driver shutdown

------------------------------------------------------------------------

## 🗺 Roadmap

### Phase 2

-   Smart locator prioritization\
-   Structured execution logs\
-   Auto screenshot on failure\
-   Improved error explanations

### Phase 3

-   Web UI for non-coders\
-   WebSocket streaming mode\
-   Multi-browser support\
-   Docker support\
-   Cloud-ready deployment

### Long-Term Vision

AI-driven, self-healing automation engine for non-technical users.

------------------------------------------------------------------------

## 🧪 Testing

Recommended testing approach:

-   API contract testing\
-   Multi-session stress testing\
-   Browser crash recovery testing\
-   Negative and security testing

Future versions will include automated CI workflows.

------------------------------------------------------------------------

## 🤝 Contributing

Contributions are welcome.

Please follow these guidelines:

-   Write clean, modular code\
-   Follow existing folder structure\
-   Add validation for new tools\
-   Update documentation\
-   Test before submitting PR

Steps:

1.  Fork the repository\
2.  Create a feature branch\
3.  Commit changes\
4.  Submit a Pull Request

------------------------------------------------------------------------

## 📜 License

MIT License

------------------------------------------------------------------------

## 👨‍💻 Author

Arnab Majumder\
Automation Architect \| QA Engineer \| AI + Testing Enthusiast
