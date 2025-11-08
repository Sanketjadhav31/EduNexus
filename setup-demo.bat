@echo off
echo ========================================
echo EduNexus Demo Setup
echo ========================================
echo.

echo Installing dependencies...
cd backend
call npm install
cd ..\frontend
call npm install
cd ..

echo.
echo ========================================
echo Seeding demo data...
echo ========================================
echo.
call npm run seed-demo

echo.
echo ========================================
echo Demo Setup Complete!
echo ========================================
echo.
echo Login Credentials:
echo.
echo Instructor:
echo   Email: instructor@demo.com
echo   Password: password123
echo.
echo Students:
echo   Email: student1@demo.com
echo   Password: password123
echo   Email: student2@demo.com
echo   Password: password123
echo   Email: student3@demo.com
echo   Password: password123
echo.
echo ========================================
echo.
echo To start the application, run: start.bat
echo Or press any key to start now...
pause
call start.bat
