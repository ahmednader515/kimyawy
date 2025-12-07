# Helper script to update .env with Prisma connection strings
# This is a template - you'll need to fill in your actual values

param(
    [Parameter(Mandatory=$false)]
    [string]$PrismaApiKey,
    
    [Parameter(Mandatory=$false)]
    [string]$DirectConnectionString
)

Write-Host "=== Update .env with Prisma Connection Strings ===" -ForegroundColor Cyan
Write-Host ""

$envPath = ".env"

if (-not (Test-Path $envPath)) {
    Write-Host "❌ .env file not found" -ForegroundColor Red
    Write-Host "Creating new .env file..." -ForegroundColor Yellow
    New-Item -Path $envPath -ItemType File | Out-Null
}

# Read current .env
$envContent = Get-Content $envPath -Raw

# Update or add DATABASE_URL
if ($PrismaApiKey) {
    $newDbUrl = "prisma://accelerate.prisma-data.net/?api_key=$PrismaApiKey"
    
    if ($envContent -match 'DATABASE_URL\s*=\s*["'']?[^"''\n]+["'']?') {
        $envContent = $envContent -replace 'DATABASE_URL\s*=\s*["'']?[^"''\n]+["'']?', "DATABASE_URL=`"$newDbUrl`""
        Write-Host "✅ Updated DATABASE_URL" -ForegroundColor Green
    } else {
        $envContent += "`nDATABASE_URL=`"$newDbUrl`""
        Write-Host "✅ Added DATABASE_URL" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  PrismaApiKey not provided, skipping DATABASE_URL update" -ForegroundColor Yellow
    Write-Host "   You can manually add: DATABASE_URL=`"prisma://accelerate.prisma-data.net/?api_key=YOUR_KEY`"" -ForegroundColor White
}

# Update or add DIRECT_DATABASE_URL
if ($DirectConnectionString) {
    if ($envContent -match 'DIRECT_DATABASE_URL\s*=\s*["'']?[^"''\n]+["'']?') {
        $envContent = $envContent -replace 'DIRECT_DATABASE_URL\s*=\s*["'']?[^"''\n]+["'']?', "DIRECT_DATABASE_URL=`"$DirectConnectionString`""
        Write-Host "✅ Updated DIRECT_DATABASE_URL" -ForegroundColor Green
    } else {
        $envContent += "`nDIRECT_DATABASE_URL=`"$DirectConnectionString`""
        Write-Host "✅ Added DIRECT_DATABASE_URL" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  DirectConnectionString not provided, skipping DIRECT_DATABASE_URL update" -ForegroundColor Yellow
    Write-Host "   You can manually add: DIRECT_DATABASE_URL=`"postgresql://user:pass@host:port/db?sslmode=require`"" -ForegroundColor White
}

# Write back to .env
Set-Content -Path $envPath -Value $envContent

Write-Host ""
Write-Host "✅ .env file updated!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Verify the connection strings are correct" -ForegroundColor White
Write-Host "  2. Run: node scripts/test-prisma-connection.js" -ForegroundColor Cyan
Write-Host "  3. Run: npx prisma db push" -ForegroundColor Cyan
Write-Host ""

