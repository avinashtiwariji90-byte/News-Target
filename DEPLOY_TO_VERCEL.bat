@echo off
title Deploy Bharat Bulletin to Vercel
color 0A
cd /d "C:\xampp\htdocs\bharat-bulletin"

echo ===================================================
echo     DEPLOYING BHARAT BULLETIN NEWS TO VERCEL
echo ===================================================
echo.
echo Step 1: Logging in to Vercel (agar pehle se login nahi hai)...
call npx vercel login
echo.
echo Step 2: Deploying project live to Production...
call npx vercel --prod
echo.
echo ===================================================
echo     DEPLOYMENT COMPLETED!
echo ===================================================
pause
