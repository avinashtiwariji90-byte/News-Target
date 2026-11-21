@echo off
title Push News Target to GitHub
color 0A
cd /d "C:\xampp\htdocs\bharat-bulletin"

echo ===================================================
echo     PUSHING NEWS TARGET TO GITHUB
echo ===================================================
echo Repo: https://github.com/avinashtiwariji90-byte/News-Target.git
echo.

git branch -M main
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ---------------------------------------------------
    echo Agar "Repository not found" error aaya hai:
    echo 1. Pehle GitHub par jaakar naya repo banayein:
    echo    https://github.com/new
    echo 2. Repository name rakhein: News-Target
    echo 3. "Create repository" button dabayein.
    echo 4. Fir is script ko dobara run karein!
    echo ---------------------------------------------------
) else (
    echo.
    echo ===================================================
    echo     PROJECT SUCCESSFULLY PUSHED TO GITHUB!
    echo ===================================================
)

pause
