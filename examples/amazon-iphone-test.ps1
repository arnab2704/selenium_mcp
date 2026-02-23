# Amazon iPhone Test Script (Windows PowerShell)
# 
# This script automates searching for iPhone on Amazon UK and adding to cart
# 
# Usage:
#   .\examples\amazon-iphone-test.ps1
# 
# Prerequisites:
#   - MCP server running: npm start
#   - PowerShell 5.0+

$BaseURL = "http://localhost:3000"
$SessionID = ""

# Function to write colored output
function Write-Color {
    param([string]$Text, [string]$Color = "White")
    Write-Host $Text -ForegroundColor $Color
}

# Function to check if server is running
function Check-Server {
    Write-Color "Checking MCP Server..." -Color Yellow
    try {
        $response = Invoke-RestMethod -Uri "$BaseURL/health" -Method Get -ErrorAction Stop
        Write-Color "✓ Server is running" -Color Green
        Write-Color "  Tools available: $($response.tools)`n" -Color Green
        return $true
    }
    catch {
        Write-Color "❌ Server not running at $BaseURL" -Color Red
        Write-Color "Please start it with: npm start" -Color Red
        return $false
    }
}

# Function to make API request
function Request-MCP {
    param(
        [string]$Tool,
        [object]$Params,
        [string]$Description = ""
    )
    
    $body = @{
        sessionId = $SessionID
        tool = $Tool
        params = $Params
    } | ConvertTo-Json -Depth 10
    
    Write-Color "→ Making request: $Tool" -Color Yellow
    if ($Description) {
        Write-Color "  Task: $Description" -Color Gray
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$BaseURL/execute" `
            -Method Post `
            -Headers @{"Content-Type" = "application/json"} `
            -Body $body -ErrorAction Stop
        
        # Update session ID if provided
        if ($response.sessionId) {
            $global:SessionID = $response.sessionId
        }
        
        if ($response.success -eq $true) {
            Write-Color "✓ Success" -Color Green
            Write-Host ""
            return $response
        }
        else {
            Write-Color "✗ Failed: $($response.error)" -Color Red
            Write-Host ""
            return $null
        }
    }
    catch {
        Write-Color "❌ Error: $($_.Exception.Message)" -Color Red
        Write-Host ""
        return $null
    }
}

# Main workflow
function Test-AmazonIPhone {
    Write-Color ("=" * 50) -Color Blue
    Write-Color "🛍️  Amazon iPhone Test Script" -Color Blue
    Write-Color ("=" * 50) -Color Blue
    Write-Host ""
    
    # Step 1: Navigate to Amazon UK
    Write-Color "📍 STEP 1: Navigate to Amazon UK" -Color Blue
    Request-MCP -Tool "navigate" `
        -Params @{url = "https://www.amazon.co.uk"} `
        -Description "Loading Amazon.co.uk"
    
    Start-Sleep -Seconds 2
    
    # Step 2: Wait for search box
    Write-Color "⏳ STEP 2: Wait for search box" -Color Blue
    Request-MCP -Tool "wait" `
        -Params @{
            locatorType = "id"
            locatorValue = "twotabsearchtextbox"
            timeout = 15000
            condition = "visible"
        } `
        -Description "Search box to appear"
    
    # Step 3: Search for iPhone
    Write-Color "🔍 STEP 3: Search for iPhone" -Color Blue
    Request-MCP -Tool "input" `
        -Params @{
            locatorType = "id"
            locatorValue = "twotabsearchtextbox"
            text = "iPhone"
            clear = $true
        } `
        -Description "Typing iPhone in search"
    
    Start-Sleep -Seconds 1
    
    # Step 4: Click search button
    Write-Color "🔘 STEP 4: Click search button" -Color Blue
    Request-MCP -Tool "click" `
        -Params @{
            locatorType = "css"
            locatorValue = "button[type='submit']"
        } `
        -Description "Submitting search"
    
    Start-Sleep -Seconds 3
    
    # Step 5: Wait for results
    Write-Color "⏳ STEP 5: Wait for search results" -Color Blue
    Request-MCP -Tool "wait" `
        -Params @{
            locatorType = "css"
            locatorValue = "[data-component-type='s-search-result']"
            timeout = 10000
            condition = "visible"
        } `
        -Description "Product results to load"
    
    Start-Sleep -Seconds 1
    
    # Step 6: Take screenshot
    Write-Color "📸 STEP 6: Capture search results" -Color Blue
    Request-MCP -Tool "screenshot" `
        -Params @{fullPage = $false} `
        -Description "Search results page"
    
    # Step 7: Click first product
    Write-Color "🎯 STEP 7: Click first product" -Color Blue
    Request-MCP -Tool "click" `
        -Params @{
            locatorType = "css"
            locatorValue = "[data-component-type='s-search-result'] h2 a"
        } `
        -Description "Opening first product"
    
    Start-Sleep -Seconds 3
    
    # Step 8: Wait for Add to Cart button
    Write-Color "⏳ STEP 8: Wait for Add to Cart button" -Color Blue
    Request-MCP -Tool "wait" `
        -Params @{
            locatorType = "id"
            locatorValue = "add-to-cart-button"
            timeout = 10000
            condition = "visible"
        } `
        -Description "Add to Cart button"
    
    # Step 9: Click Add to Cart
    Write-Color "🛒 STEP 9: Add to Cart" -Color Blue
    Request-MCP -Tool "click" `
        -Params @{
            locatorType = "id"
            locatorValue = "add-to-cart-button"
        } `
        -Description "Adding product to cart"
    
    Start-Sleep -Seconds 2
    
    # Step 10: Take confirmation screenshot
    Write-Color "📸 STEP 10: Capture confirmation" -Color Blue
    Request-MCP -Tool "screenshot" `
        -Params @{fullPage = $false} `
        -Description "Add to cart confirmation"
    
    # Step 11: Navigate to cart
    Write-Color "🛒 STEP 11: Navigate to cart" -Color Blue
    Request-MCP -Tool "click" `
        -Params @{
            locatorType = "id"
            locatorValue = "nav-cart-count-container"
        } `
        -Description "Opening shopping cart"
    
    Start-Sleep -Seconds 2
    
    # Step 12: Verify in cart
    Write-Color "✅ STEP 12: Verify item in cart" -Color Blue
    Request-MCP -Tool "verify" `
        -Params @{
            locatorType = "css"
            locatorValue = "[data-item-index]"
            checkVisible = $true
        } `
        -Description "Product visible in cart"
    
    # Step 13: Final screenshot
    Write-Color "📸 STEP 13: Final cart view" -Color Blue
    Request-MCP -Tool "screenshot" `
        -Params @{fullPage = $false} `
        -Description "Shopping cart page"
    
    # Success
    Write-Color ("=" * 50) -Color Blue
    Write-Color "✅ TEST COMPLETED SUCCESSFULLY!" -Color Green
    Write-Color ("=" * 50) -Color Blue
    Write-Color "Session ID: $SessionID" -Color Cyan
    Write-Color "View sessions: http://localhost:3000/sessions" -Color Cyan
    Write-Host ""
}

# Run the test
if (Check-Server) {
    Test-AmazonIPhone
}
