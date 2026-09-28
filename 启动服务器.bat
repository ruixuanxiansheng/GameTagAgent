@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js not found. Install Node.js first.
  pause
  exit /b 1
)
echo Starting Tag Agent at http://localhost:8787 ...
echo Keep this window open. The browser will open in a moment.
node launch.js
pause
