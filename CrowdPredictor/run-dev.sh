#!/bin/bash

# Run the Vite frontend server
npm run vite &  # The '&' allows it to run in the background

# Navigate to the backend folder and run Python
cd backend && python3 app.py