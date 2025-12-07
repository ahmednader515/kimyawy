# Import Aiven Backup to Local PostgreSQL Database

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile
)

Write-Host "=== Import to Local Database ===" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $BackupFile)) {
    Write-Host "❌ Backup file not found: $BackupFile" -ForegroundColor Red
    exit 1
}

# Check if PostgreSQL is installed
$psql = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psql) {
    Write-Host "❌ psql not found. PostgreSQL client tools are required." -ForegroundColor Red
    Write-Host "Install PostgreSQL from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}

# Load .env to get local database connection
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match 'DIRECT_DATABASE_URL.*postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)') {
            $localUser = $matches[1]
            $localPass = $matches[2]
            $localHost = $matches[3]
            $localPort = $matches[4]
            $localDb = $matches[5]
        }
    }
}

if (-not $localDb) {
    Write-Host "❌ Could not find local database connection in .env" -ForegroundColor Red
    Write-Host "Make sure DIRECT_DATABASE_URL points to localhost" -ForegroundColor Yellow
    exit 1
}

Write-Host "Local Database:" -ForegroundColor Yellow
Write-Host "  Host: $localHost" -ForegroundColor White
Write-Host "  Port: $localPort" -ForegroundColor White
Write-Host "  Database: $localDb" -ForegroundColor White
Write-Host ""

# Check if database exists
Write-Host "Checking if database exists..." -ForegroundColor Yellow
$env:PGPASSWORD = $localPass
$dbExists = & psql -h $localHost -p $localPort -U $localUser -lqt | Select-String -Pattern "\b$localDb\b"

if (-not $dbExists) {
    Write-Host "Database doesn't exist. Creating..." -ForegroundColor Yellow
    & psql -h $localHost -p $localPort -U $localUser -d postgres -c "CREATE DATABASE $localDb;"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create database" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Database created" -ForegroundColor Green
}

Write-Host ""
Write-Host "Importing backup file..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
Write-Host ""

# Import the backup
$env:PGPASSWORD = $localPass
& psql -h $localHost -p $localPort -U $localUser -d $localDb -f $BackupFile

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Import completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verify the import:" -ForegroundColor Yellow
    Write-Host "  psql -h $localHost -p $localPort -U $localUser -d $localDb -c `"SELECT COUNT(*) FROM `"User`";`"" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Import failed. Check the error messages above." -ForegroundColor Red
}

Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue


