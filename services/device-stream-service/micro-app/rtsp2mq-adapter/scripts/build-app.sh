#!/bin/bash

# Check if PyInstaller is installed
if ! command -v pyinstaller &> /dev/null; then
    echo "PyInstaller not found. Installing..."
    pip install pyinstaller
fi

# Install deps
pip install -r ./micro-app/rtsp2mq-adapter/requirements.txt

# Build the application
pyinstaller --onefile --hidden-import=pika --hidden-import=cv2 --name observer ./micro-app/rtsp2mq-adapter/main.py

echo "Build complete. Executable is in the dist/ directory."
