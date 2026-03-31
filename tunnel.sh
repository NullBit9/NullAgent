#!/bin/bash

# StonkAI Tunnel - Exposes local OpenClaw to the internet
# Run this on your Mac, then use the URL on your Chromebook

echo "📈 StonkAI Tunnel"
echo "=================="
echo ""

# Check for cloudflared (Cloudflare Tunnel)
if command -v cloudflared &> /dev/null; then
    echo "Using Cloudflare Tunnel (cloudflared)..."
    echo "Your URL will appear below. Press Ctrl+C to stop."
    echo ""
    cloudflared tunnel --url http://localhost:3000
    exit 0
fi

# Check for ngrok
if command -v ngrok &> /dev/null; then
    echo "Using ngrok..."
    echo "Your URL will appear below. Press Ctrl+C to stop."
    echo ""
    ngrok http http://localhost:3000
    exit 0
fi

# Try localtunnel (npm)
if command -v npx &> /dev/null; then
    echo "Using localtunnel (npx)..."
    echo "Your URL will appear below. Press Ctrl+C to stop."
    echo ""
    npx localtunnel --port 3000
    exit 0
fi

# Try serveo (SSH)
if command -v ssh &> /dev/null; then
    echo "Using Serveo (SSH)..."
    echo "Your URL will appear below. Press Ctrl+C to stop."
    echo ""
    ssh -R 80:localhost:3000 serveo.net
    exit 0
fi

echo "❌ No tunnel tool found!"
echo ""
echo "Install one of these:"
echo "  1. cloudflared: brew install cloudflared"
echo "  2. ngrok: brew install ngrok"
echo "  3. localtunnel: npm install -g localtunnel"
echo ""
echo "Then run this script again."