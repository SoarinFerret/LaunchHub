#!/bin/bash

# Build the Node JS dependencies
cd /usr/src/app

# JUST IN CASE, remove Windows Line formats
find . -type f -print0 | xargs -0 dos2unix

echo "Installing dependencies"
npm install

# Start the webserver
echo "Starting the Webserver"
npm start