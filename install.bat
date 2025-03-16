@echo off
echo Project Tracker Installation Helper
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/
    echo After installing Node.js, run this script again.
    pause
    exit /b
)

REM Check Node.js version
for /f "tokens=1,2,3 delims=." %%a in ('node -v') do (
    set NODE_MAJOR=%%a
    set NODE_MINOR=%%b
    set NODE_PATCH=%%c
)

set NODE_MAJOR=%NODE_MAJOR:~1%

if %NODE_MAJOR% LSS 18 (
    echo Your Node.js version is too old. Please install Node.js 18 or higher.
    echo Current version: %NODE_MAJOR%.%NODE_MINOR%.%NODE_PATCH%
    pause
    exit /b
)

echo Node.js version %NODE_MAJOR%.%NODE_MINOR%.%NODE_PATCH% detected.
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install dependencies.
    pause
    exit /b
)
echo Dependencies installed successfully.
echo.

REM Start the development server
echo Starting the development server...
echo The application will open in your default browser.
echo Press Ctrl+C to stop the server when you're done.
echo.
start http://localhost:3000
call npm run dev

pause 