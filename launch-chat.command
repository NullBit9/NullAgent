#!/bin/bash

# StonkAI Chat Launcher
# Double-click this file to start the chat server and open your browser

cd "$(dirname "$0")"

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "Starting chat server..."
    open "http://localhost:8080/chat.html"
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    echo "Starting chat server..."
    open "http://localhost:8080/chat.html"
    python -m http.server 8080
else
    echo "Python not found. Please install Python or use the terminal."
    read -p "Press Enter to close..."
fi