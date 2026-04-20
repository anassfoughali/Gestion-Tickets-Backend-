@echo off
echo Starting all microservices...

start "config-server"      cmd /k "cd config-server && mvnw.cmd spring-boot:run"
timeout /t 20 /nobreak

start "discovery-service"  cmd /k "cd discovery-service && mvnw.cmd spring-boot:run"
timeout /t 20 /nobreak

start "auth-service"       cmd /k "cd auth-service && mvnw.cmd spring-boot:run"
start "ticket-service"     cmd /k "cd ticket-service && mvnw.cmd spring-boot:run"
start "performance-service" cmd /k "cd performance-service && mvnw.cmd spring-boot:run"
timeout /t 25 /nobreak

start "api-gateway"        cmd /k "cd api-gateway && mvnw.cmd spring-boot:run"

echo.
echo All services launched!
echo API Gateway   : http://localhost:8080
echo Eureka        : http://localhost:8761
echo Config Server : http://localhost:8888
echo.
echo Press any key to STOP all services...
pause >nul
call stop-all.bat
