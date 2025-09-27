#!/bin/bash
# Script to build and serve the site with admin interface
# This is needed because Astro dev server doesn't serve static admin files properly

echo "Building the site..."
npm run build

echo "Starting local server with admin interface..."
echo "Access your site at: http://localhost:8080"
echo "Access CMS at: http://localhost:8080/admin/"
echo "Press Ctrl+C to stop the server"

cd dist && python3 -m http.server 8080