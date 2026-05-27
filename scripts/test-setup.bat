@echo off

REM Test Setup Script for Windows
REM This script sets up and runs tests for the Avantos project

echo.
echo ================================
echo Avantos Test Setup
echo ================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo.
    echo 📦 Installing dependencies...
    call npm install
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 🧪 Running tests...
call npm test -- --passWithNoTests --coverage

echo.
echo ================================
echo Test Summary
echo ================================
echo ✅ Test setup complete!
echo.
echo Commands:
echo   npm test              - Run tests once
echo   npm run test:watch    - Run tests in watch mode
echo   npm run test:coverage - Generate coverage report
echo.
echo Coverage Report:
echo   Open: ./coverage/lcov-report/index.html
echo.
