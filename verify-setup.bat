@echo off
echo ========================================
echo EduNexus Setup Verification
echo ========================================
echo.

echo Checking backend files...
if exist backend\server.js (
    echo [OK] Backend server.js found
) else (
    echo [ERROR] Backend server.js not found
    exit /b 1
)

echo Checking frontend files...
if exist frontend\src\App.jsx (
    echo [OK] Frontend App.jsx found
) else (
    echo [ERROR] Frontend App.jsx not found
    exit /b 1
)

echo.
echo Checking environment files...
if exist backend\.env (
    echo [OK] Backend .env found
) else (
    echo [WARNING] Backend .env not found - copy from .env.example
)

if exist frontend\.env (
    echo [OK] Frontend .env found
) else (
    echo [WARNING] Frontend .env not found - copy from .env.example
)

echo.
echo Checking dependencies...
if exist backend\node_modules (
    echo [OK] Backend dependencies installed
) else (
    echo [WARNING] Backend dependencies not installed
    echo Run: cd backend ^&^& npm install
)

if exist frontend\node_modules (
    echo [OK] Frontend dependencies installed
) else (
    echo [WARNING] Frontend dependencies not installed
    echo Run: cd frontend ^&^& npm install
)

echo.
echo ========================================
echo Verification Complete!
echo ========================================
echo.
echo To start the application:
echo 1. Run: start.bat
echo 2. Or manually start backend and frontend
echo.
pause
