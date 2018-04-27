#!/bin/bash

# Build the Node JS dependencies
cd /usr/src/app

GREEN='\033[0;32m'
NC='\033[0m'

# JUST IN CASE, remove Windows Line formats
echo "Checking for and removing Windows line endings..."
find . -type f -print0 | xargs -0 dos2unix > /dev/null 2>&1
echo -e "...${GREEN}done${NC}!\n"

echo "Installing Node Dependencies..."
npm install > /dev/null
echo -e "...${GREEN}done${NC}!\n"

# Start the webserver
echo -e "${GREEN}Starting the Webserver!${NC}"
npm start