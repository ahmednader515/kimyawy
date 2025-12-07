# Setup Local PostgreSQL Database for Development
# This script helps set up a local PostgreSQL database

Write-Host "=== Local PostgreSQL Database Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
Write-Host "1. Checking for PostgreSQL installation..." -ForegroundColor Yellow
$pgInstalled = Get-Command psql -ErrorAction SilentlyContinue

if (-not $pgInstalled) {
    Write-Host "   ❌ PostgreSQL is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "   To install PostgreSQL on Windows:" -ForegroundColor Yellow
    Write-Host "   1. Download from: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "   2. Or use Chocolatey: choco install postgresql" -ForegroundColor White
    Write-Host "   3. Or use Docker: docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres" -ForegroundColor White
    Write-Host ""
    Write-Host "   After installation, run this script again." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "   ✅ PostgreSQL is installed" -ForegroundColor Green
    $pgVersion = & psql --version
    Write-Host "   Version: $pgVersion" -ForegroundColor White
}

# Check if Docker is available (alternative)
Write-Host "`n2. Checking for Docker (alternative option)..." -ForegroundColor Yellow
$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
if ($dockerInstalled) {
    Write-Host "   ✅ Docker is available" -ForegroundColor Green
    Write-Host "   You can use: docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres" -ForegroundColor White
} else {
    Write-Host "   ℹ️  Docker not found (optional)" -ForegroundColor Gray
}

Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "After PostgreSQL is running, update your .env file:" -ForegroundColor Yellow
Write-Host ""
Write-Host 'DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_KEY"' -ForegroundColor White
Write-Host 'DIRECT_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kimyawy?sslmode=disable"' -ForegroundColor White
Write-Host ""
Write-Host "Then run:" -ForegroundColor Yellow
Write-Host "  npx prisma db push" -ForegroundColor Cyan
Write-Host ""

