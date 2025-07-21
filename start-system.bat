@echo off
echo Starting Fraud Detection System...
echo.

echo Creating Python virtual environment...
cd backend
if not exist "venv" (
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing Python dependencies...
pip install -r requirements.txt

echo Starting FastAPI backend server...
start "FastAPI Backend" cmd /k "python main.py"

cd ..

echo Starting Next.js frontend...
start "Next.js Frontend" cmd /k "npm run dev"

echo.
echo =================================================
echo  Fraud Detection System Started Successfully!
echo =================================================
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press any key to continue...
pause > nul
