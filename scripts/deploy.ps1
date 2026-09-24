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

$remoteScript = @'
export PATH=$PATH:/usr/local/bin:/usr/bin:~/.npm-global/bin
export NODE_ENV=production

cd /var/www/sipikem-sulut

# 1. Lindungi file .env yang ada di VPS agar tidak pernah ter-reset
if [ -f .env ]; then
    cp .env .env.backup
fi

# 2. Ekstrak paket baru (tanpa menimpa folder upload user)
tar -xzf sipikem-deploy.tar.gz --exclude='public/uploads/*'

# 3. Pulihkan .env VPS jika sempat berubah
if [ -f .env.backup ]; then
    mv -f .env.backup .env
fi

# 4. Pastikan folder uploads fisik tersedia dengan izin yang benar
mkdir -p public/uploads
chmod -R 775 public/uploads

# 5. Pastikan PM2 terpasang
if ! command -v pm2 >/dev/null 2>&1; then
    echo "[VPS] PM2 belum terpasang, menginstal PM2..."
    npm install -g pm2
fi

# 6. Restart atau start aplikasi
echo "[VPS] Menjalankan server aplikasi dengan PM2..."
if pm2 describe sipikem >/dev/null 2>&1; then
    pm2 restart sipikem
else
    PORT=3000 pm2 start server.js --name sipikem
fi
pm2 save
echo "[VPS] Aplikasi berhasil berjalan di PM2!"
'@

$remoteScript | ssh "${VpsUser}@${VpsHost}" "bash -s"
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
