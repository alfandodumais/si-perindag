# ==============================================================================
# SIPIKEM SULUT - Instant 1-Click Deployment Script
# ==============================================================================

param(
    [string]$VpsHost = "103.247.8.235",
    [string]$VpsUser = "root",
    [string]$VpsDir  = "/var/www/sipikem-sulut"
)

$ErrorActionPreference = "Stop"
$startTime = Get-Date

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   SIPIKEM SULUT - INSTANT 1-CLICK DEPLOY KE VPS          " -ForegroundColor Cyan
Write-Host "   Target: $VpsUser@$VpsHost : $VpsDir                    " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Build & Package
Write-Host "`n[1/3] Menjalankan Pre-Build & Pengemasan..." -ForegroundColor Yellow
npm run package
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error saat proses packaging!" -ForegroundColor Red
    exit 1
}

# 2. Upload to VPS via SCP
Write-Host "`n[2/3] Mengunggah paket ke VPS ($VpsHost)..." -ForegroundColor Yellow
scp sipikem-deploy.tar.gz ${VpsUser}@${VpsHost}:${VpsDir}/
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error saat upload paket ke VPS!" -ForegroundColor Red
    exit 1
}

# 3. Extract & Restart PM2 via SSH
Write-Host "`n[3/3] Menerapkan update & restart PM2 di VPS..." -ForegroundColor Yellow
$remoteCommand = @"
export PATH=`$PATH:/usr/local/bin:/usr/bin:~/.npm-global/bin:~/.nvm/versions/node/$(ls ~/.nvm/versions/node 2>/dev/null | tail -n 1)/bin
if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js belum terpasang di VPS!"
    exit 1
fi
if ! command -v pm2 >/dev/null 2>&1; then
    echo "PM2 belum terpasang di VPS, menginstal PM2 secara otomatis..."
    npm install -g pm2
fi
cd $VpsDir
tar -xzf sipikem-deploy.tar.gz
mkdir -p public/uploads
chmod -R 775 public/uploads
(pm2 restart sipikem || PORT=3000 pm2 start server.js --name sipikem)
pm2 save
"@

ssh ${VpsUser}@${VpsHost} $remoteCommand
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error saat update / restart server di VPS!" -ForegroundColor Red
    exit 1
}

$duration = [math]::Round(((Get-Date) - $startTime).TotalSeconds, 1)
Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "  [SUKSES!] DEPLOY SELESAI DALAM $duration DETIK!         " -ForegroundColor Green
Write-Host "  Website Anda sudah aktif dan terupdate di:              " -ForegroundColor Green
Write-Host "  👉 https://sipikem-sulut.com                            " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
