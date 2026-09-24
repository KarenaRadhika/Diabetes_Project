@echo off
echo =======================================================
echo  Starting Diabetes Prediction ML Project
echo  Connecting Pickle Model (XGBoost 77.27%% Acc) to Web App
echo =======================================================
echo.

echo [1/2] Starting Flask REST API Backend on port 5000...
start "Diabetes ML API Backend (Port 5000)" cmd /k ".\venv\Scripts\python.exe server.py"

echo [2/2] Starting React + Vite Frontend on port 5173...
start "Diabetes React Frontend (Port 5173)" cmd /k "cd diabetes_project && npm run dev"

echo.
echo Both servers started!
echo Frontend will be available at: http://localhost:5173
echo Backend API is available at:   http://127.0.0.1:5000
echo.
pause
