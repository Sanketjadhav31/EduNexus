@echo off
echo ========================================
echo Starting EduNexus LMS
echo ========================================
echo.

echo Installing dependencies...
call npm run install-all

echo.
echo ========================================
echo Starting Backend and Frontend...
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.

start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
start cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo Press any key to exit this window.
pause > nul
