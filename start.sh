#!/bin/bash

echo "========================================"
echo "Starting EduNexus LMS"
echo "========================================"
echo ""

echo "Installing dependencies..."
npm run install-all

echo ""
echo "========================================"
echo "Starting Backend and Frontend..."
echo "========================================"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""

# Start backend in background
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend in background
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "Both servers are running!"
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
