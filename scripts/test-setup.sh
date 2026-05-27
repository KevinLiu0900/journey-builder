#!/bin/bash

# Test Setup Script
# This script sets up and runs tests for the Avantos project

set -e

echo "================================"
echo "Avantos Test Setup"
echo "================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🧪 Running tests..."
npm test -- --passWithNoTests --coverage

echo ""
echo "================================"
echo "Test Summary"
echo "================================"
echo "✅ Test setup complete!"
echo ""
echo "Commands:"
echo "  npm test              - Run tests once"
echo "  npm run test:watch    - Run tests in watch mode"
echo "  npm run test:coverage - Generate coverage report"
echo ""
echo "Coverage Report:"
echo "  Open: ./coverage/lcov-report/index.html"
echo ""
