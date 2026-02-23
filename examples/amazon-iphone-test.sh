#!/bin/bash

# Amazon iPhone Test Script (macOS/Linux)
# 
# This script automates searching for iPhone on Amazon UK and adding to cart
# 
# Usage:
#   chmod +x examples/amazon-iphone-test.sh
#   ./examples/amazon-iphone-test.sh
# 
# Prerequisites:
#   - MCP server running: npm start
#   - curl installed
#   - jq installed (for JSON parsing): brew install jq

set -e  # Exit on error

BASE_URL="http://localhost:3000"
SESSION_ID=""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🛍️  Amazon iPhone Test Script${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function to check if server is running
check_server() {
    echo -e "${YELLOW}Checking MCP Server...${NC}"
    if ! curl -s "$BASE_URL/health" > /dev/null; then
        echo -e "${RED}❌ Server not running at $BASE_URL${NC}"
        echo -e "${RED}Please start it with: npm start${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Server is running${NC}\n"
}

# Function to make API request
make_request() {
    local tool=$1
    local params=$2
    local description=$3
    
    local body="{\"sessionId\":\"$SESSION_ID\",\"tool\":\"$tool\",\"params\":$params}"
    
    echo -e "${YELLOW}→ Making request: $tool${NC}"
    if [ ! -z "$description" ]; then
        echo -e "  Task: $description"
    fi
    
    response=$(curl -s -X POST "$BASE_URL/execute" \
        -H "Content-Type: application/json" \
        -d "$body")
    
    # Parse response
    success=$(echo "$response" | jq -r '.success')
    error=$(echo "$response" | jq -r '.error' 2>/dev/null)
    new_id=$(echo "$response" | jq -r '.sessionId' 2>/dev/null)
    
    # Update session ID if provided
    if [ "$new_id" != "null" ] && [ ! -z "$new_id" ]; then
        SESSION_ID=$new_id
    fi
    
    # Check if successful
    if [ "$success" = "true" ]; then
        echo -e "${GREEN}✓ Success${NC}\n"
        return 0
    else
        echo -e "${RED}✗ Failed: $error${NC}\n"
        return 1
    fi
}

# Main workflow
main() {
    # Step 1: Navigate to Amazon UK
    echo -e "${BLUE}📍 STEP 1: Navigate to Amazon UK${NC}"
    make_request "navigate" \
        '{"url":"https://www.amazon.co.uk"}' \
        "Loading Amazon.co.uk"
    
    sleep 2
    
    # Step 2: Wait for search box
    echo -e "${BLUE}⏳ STEP 2: Wait for search box${NC}"
    make_request "wait" \
        '{"locatorType":"id","locatorValue":"twotabsearchtextbox","timeout":15000,"condition":"visible"}' \
        "Search box to appear"
    
    # Step 3: Search for iPhone
    echo -e "${BLUE}🔍 STEP 3: Search for iPhone${NC}"
    make_request "input" \
        '{"locatorType":"id","locatorValue":"twotabsearchtextbox","text":"iPhone","clear":true}' \
        "Typing iPhone in search"
    
    sleep 1
    
    # Step 4: Click search button
    echo -e "${BLUE}🔘 STEP 4: Click search button${NC}"
    make_request "click" \
        '{"locatorType":"css","locatorValue":"button[type=\"submit\"]"}' \
        "Submitting search"
    
    sleep 3
    
    # Step 5: Wait for results
    echo -e "${BLUE}⏳ STEP 5: Wait for search results${NC}"
    make_request "wait" \
        '{"locatorType":"css","locatorValue":"[data-component-type=\"s-search-result\"]","timeout":10000,"condition":"visible"}' \
        "Product results to load"
    
    sleep 1
    
    # Step 6: Take screenshot of results
    echo -e "${BLUE}📸 STEP 6: Capture search results${NC}"
    make_request "screenshot" \
        '{"fullPage":false}' \
        "Search results page"
    
    # Step 7: Click first product
    echo -e "${BLUE}🎯 STEP 7: Click first product${NC}"
    make_request "click" \
        '{"locatorType":"css","locatorValue":"[data-component-type=\"s-search-result\"] h2 a"}' \
        "Opening first product"
    
    sleep 3
    
    # Step 8: Wait for Add to Cart button
    echo -e "${BLUE}⏳ STEP 8: Wait for Add to Cart button${NC}"
    make_request "wait" \
        '{"locatorType":"id","locatorValue":"add-to-cart-button","timeout":10000,"condition":"visible"}' \
        "Add to Cart button"
    
    # Step 9: Click Add to Cart
    echo -e "${BLUE}🛒 STEP 9: Add to Cart${NC}"
    make_request "click" \
        '{"locatorType":"id","locatorValue":"add-to-cart-button"}' \
        "Adding product to cart"
    
    sleep 2
    
    # Step 10: Take confirmation screenshot
    echo -e "${BLUE}📸 STEP 10: Capture confirmation${NC}"
    make_request "screenshot" \
        '{"fullPage":false}' \
        "Add to cart confirmation"
    
    # Step 11: Navigate to cart
    echo -e "${BLUE}🛒 STEP 11: Navigate to cart${NC}"
    make_request "click" \
        '{"locatorType":"id","locatorValue":"nav-cart-count-container"}' \
        "Opening shopping cart"
    
    sleep 2
    
    # Step 12: Verify in cart
    echo -e "${BLUE}✅ STEP 12: Verify item in cart${NC}"
    make_request "verify" \
        '{"locatorType":"css","locatorValue":"[data-item-index]","checkVisible":true}' \
        "Product visible in cart"
    
    # Step 13: Final screenshot
    echo -e "${BLUE}📸 STEP 13: Final cart view${NC}"
    make_request "screenshot" \
        '{"fullPage":false}' \
        "Shopping cart page"
    
    # Success message
    echo -e "${BLUE}========================================${NC}"
    echo -e "${GREEN}✅ TEST COMPLETED SUCCESSFULLY!${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo -e "Session ID: ${YELLOW}$SESSION_ID${NC}"
    echo -e "View sessions: ${YELLOW}http://localhost:3000/sessions${NC}\n"
}

# Run checks and main
check_server
main
