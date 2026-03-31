@echo off
REM StonkAI Chat Launcher
REM Double-click this file to start the chat server and open your browser

cd /d "%~dp0"

python -m http.server 8080 >nul 2>&1
if errorlevel 1 (
    python3 -m http.server 8080 >nul 2>&1
    if errorlevel 1 (
        echo Python not found. Please install Python from python.org
        pause
        exit /b 1
    )
)

start http://localhost:8080/chat.html