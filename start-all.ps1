# ============================================================
# start-all.ps1 — Lance tous les microservices dans l'ordre
# Usage: .\start-all.ps1
#        .\start-all.ps1 -Service performance-service   (un seul)
# ============================================================

param(
    [string]$Service = "all"
)

$ROOT = $PSScriptRoot

function Start-Service($name, $path) {
    Write-Host "`n>>> Starting $name..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$path'; .\mvnw.cmd spring-boot:run" -WindowStyle Normal
}

function Wait-ForPort($port, $name, $timeoutSec = 60) {
    Write-Host "    Waiting for $name on port $port..." -ForegroundColor Yellow
    $elapsed = 0
    while ($elapsed -lt $timeoutSec) {
        try {
            $tcp = New-Object System.Net.Sockets.TcpClient
            $tcp.Connect("localhost", $port)
            $tcp.Close()
            Write-Host "    $name is UP on port $port" -ForegroundColor Green
            return
        } catch {
            Start-Sleep -Seconds 2
            $elapsed += 2
        }
    }
    Write-Host "    WARNING: $name did not start within ${timeoutSec}s" -ForegroundColor Red
}

if ($Service -ne "all") {
    # Lance un seul service
    $path = Join-Path $ROOT $Service
    Start-Service $Service $path
    exit
}

# ── 1. Config Server (doit démarrer en premier)
Start-Service "config-server" "$ROOT\config-server"
Wait-ForPort 8888 "config-server" 90

# ── 2. Discovery Service (Eureka)
Start-Service "discovery-service" "$ROOT\discovery-service"
Wait-ForPort 8761 "discovery-service" 60

# ── 3. Services métier (en parallèle)
Start-Service "auth-service"        "$ROOT\auth-service"
Start-Service "ticket-service"      "$ROOT\ticket-service"
Start-Service "performance-service" "$ROOT\performance-service"

Write-Host "`n    Waiting 20s for business services to register with Eureka..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# ── 4. API Gateway (en dernier)
Start-Service "api-gateway" "$ROOT\api-gateway"
Wait-ForPort 8080 "api-gateway" 60

Write-Host "`n============================================" -ForegroundColor Green
Write-Host " All services started!" -ForegroundColor Green
Write-Host " API Gateway  : http://localhost:8080" -ForegroundColor Green
Write-Host " Eureka       : http://localhost:8761" -ForegroundColor Green
Write-Host " Config Server: http://localhost:8888" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Green
