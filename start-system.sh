#!/bin/bash

echo "Starting Fraud Detection System..."
echo

echo "Creating Python virtual environment..."
cd backend

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Starting FastAPI backend server..."
python main.py &
BACKEND_PID=$!

cd ..

echo "Starting Next.js frontend..."
npm run dev &
FRONTEND_PID=$!

echo
echo "================================================="
echo " Fraud Detection System Started Successfully!"
echo "================================================="
echo
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo
echo "Press Ctrl+C to stop both servers..."

# Function to cleanup processes
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to call cleanup function on script exit
trap cleanup INT TERM

# Wait for processes
wait
