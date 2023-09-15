#!/bin/bash

# Configuration
FTP_SERVER="ftp://ucssottawa.com"
FTP_USER="u876933067"
FTP_PASS="Ennh56ucss!"
REMOTE_PATH="/public_html/crm"  # The path on the remote FTP server where you want to upload the folder
LOCAL_PATH="/dist"  # The path to the local folder you want to upload

# Check if lftp is installed
if ! command -v lftp &> /dev/null; then
    echo "Error: lftp is not installed. Please install it first."
    exit 1
fi

# Create a session with lftp
lftp -u "$FTP_USER","$FTP_PASS" "$FTP_SERVER" <<EOF
    # Change to the remote directory
    cd "$REMOTE_PATH"

    # Upload the local folder to the remote directory
    mirror -R "$LOCAL_PATH"

    # Exit lftp
    quit
EOF
