#!/bin/bash

# Define variables
URL="https://github.com/bluenviron/mediamtx/releases/download/v1.9.3/mediamtx_v1.9.3_darwin_arm64.tar.gz"
FILENAME="mediamtx_v1.9.3_darwin_arm64.tar.gz"
TARGET_DIR=".data/mediamtx"
EXECUTABLE="$TARGET_DIR/mediamtx"

# Check if the target directory and executable exist
if [ -d "$TARGET_DIR" ] && [ -f "$EXECUTABLE" ]; then
  echo "Directory $TARGET_DIR and mediamtx executable already exist. Skipping download and extraction."
else
  echo "Fetching and setting up mediamtx..."

  # Download the file
  wget $URL -O $FILENAME
  
  if [ $? -eq 0 ]; then
    echo "File downloaded successfully."
    
    # Create the target directory if it doesn't exist
    mkdir -p "$TARGET_DIR"
    
    # Extract the tar.gz file directly into the target directory
    tar -xzf $FILENAME -C "$TARGET_DIR" --strip-components=1
    
    if [ $? -eq 0 ]; then
      echo "File extracted successfully into $TARGET_DIR."
    else
      echo "Failed to extract the file."
      exit 1
    fi
    
  else
    echo "Failed to download the file."
    exit 1
  fi
fi

# Run the mediamtx executable
if [ -f "$EXECUTABLE" ]; then
  cd "$TARGET_DIR"
  ./mediamtx
else
  echo "Executable not found in $TARGET_DIR. Please check the setup."
  exit 1
fi
