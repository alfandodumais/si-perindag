# ==============================================================================
# SIPIKEM SULUT - Pre-Build & Deployment Packaging Script
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  SIPIKEM SULUT - PRE-BUILD PACKAGING UNTUK VPS UBUNTU    " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Generate Prisma Client (Windows & Ubuntu 24.04 Linux engine)
Write-Host "`n[1/5] Menghasilkan Prisma Client (Dual Engines)..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Gagal generate Prisma client!" -ForegroundColor Red
    exit 1
}

# 2. Next.js Standalone Build
Write-Host "`n[2/5] Menjalankan Next.js Standalone Build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Build gagal!" -ForegroundColor Red
    exit 1
}

# 3. Copy Static Assets, Prisma schema, scripts, and backup
Write-Host "`n[3/5] Mengintegrasikan static assets, prisma, dan scripts ke .next/standalone..." -ForegroundColor Yellow
if (Test-Path "public") {
    Copy-Item -Recurse -Force "public" ".next\standalone\"
}
if (Test-Path ".next\static") {
    Copy-Item -Recurse -Force ".next\static" ".next\standalone\.next\"
}
if (Test-Path "prisma") {
    Copy-Item -Recurse -Force "prisma" ".next\standalone\"
}
if (Test-Path "scripts") {
    Copy-Item -Recurse -Force "scripts" ".next\standalone\"
}
if (Test-Path "backup") {
    Copy-Item -Recurse -Force "backup" ".next\standalone\"
}

# 4. Keamanan: Jangan sertakan file .env lokal ke dalam arsip rilis
# agar konfigurasi database di VPS tidak pernah tertimpa atau ter-reset
Write-Host "`n[4/5] Mengamankan konfigurasi: .env lokal dikecualikan dari paket rilis..." -ForegroundColor Yellow
if (Test-Path ".next\standalone\.env") {
    Remove-Item -Force ".next\standalone\.env"
}

# 5. Compress into tar.gz
$archiveName = "sipikem-deploy.tar.gz"
Write-Host "`n[5/5] Mengompresi paket rilis ke $archiveName..." -ForegroundColor Yellow
if (Test-Path $archiveName) {
    Remove-Item -Force $archiveName
}
tar -czf $archiveName -C .next/standalone .

if (Test-Path $archiveName) {
    $sizeMB = [math]::Round((Get-Item $archiveName).Length / 1MB, 2)
    Write-Host "`n[BERHASIL!] Paket rilis telah siap:" -ForegroundColor Green
    Write-Host "  File : $archiveName" -ForegroundColor White
    Write-Host "  Ukuran : $sizeMB MB" -ForegroundColor White
    Write-Host "`nSiap diunggah ke VPS Anda!" -ForegroundColor Green
} else {
    Write-Host "Error: File arsip gagal dibuat." -ForegroundColor Red
    exit 1
}
