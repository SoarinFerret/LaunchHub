#!/bin/bash

# Build the Node JS dependencies
cd /usr/src/app

echo "Installing dependencies"
npm install

# Start the webserver
echo "Starting the Webserver"
npm start