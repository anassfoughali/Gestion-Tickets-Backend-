@echo off
echo Stopping all microservices...

for %%p in (8888 8761 8083 8082 8081 8080) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%%p " ^| findstr "LISTENING"') do (
        echo Killing process on port %%p (PID %%a)
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo.
echo All services stopped.
pause
