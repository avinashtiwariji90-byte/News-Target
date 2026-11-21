@echo off
title NEWS TARGET - AI Digital News Network
cd /d "c:\xampp\htdocs\bharat-bulletin"

echo ==========================================================
echo   NEWS TARGET (न्यूज़ टारगेट) - AI DIGITAL NEWS NETWORK
echo   National, Madhya Pradesh, Bhopal, AI & Global Desks
echo ==========================================================
echo.
echo Starting Next.js Server on http://localhost:3000 ...

:: Wait 3 seconds in background for server to bind before opening browser
start "" /b cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

:: Start Next.js Turbopack dev server
call npm run dev -- -p 3000

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Next.js server stopped with an error.
    pause
)
