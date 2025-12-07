# Export Aiven Database to Local SQL File
# Run this when you have temporary connection to Aiven

Write-Host "=== Export Aiven Database ===" -ForegroundColor Cyan
Write-Host ""

# Load .env file
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"').Trim("'")
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
} else {
    Write-Host "❌ .env file not found" -ForegroundColor Red
    exit 1
}

$directUrl = $env:DIRECT_DATABASE_URL

if (-not $directUrl) {
    Write-Host "❌ DIRECT_DATABASE_URL not set in .env" -ForegroundColor Red
    exit 1
}

# Check if pg_dump is available
$pgDump = Get-Command pg_dump -ErrorAction SilentlyContinue
if (-not $pgDump) {
    Write-Host "❌ pg_dump not found. PostgreSQL client tools are required." -ForegroundColor Red
    Write-Host ""
    Write-Host "Install PostgreSQL client tools:" -ForegroundColor Yellow
    Write-Host "  1. Download PostgreSQL from: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "  2. Or use: choco install postgresql" -ForegroundColor White
    Write-Host ""
    Write-Host "Alternatively, use the Node.js export script:" -ForegroundColor Yellow
    Write-Host "  node scripts/export-aiven-data.js" -ForegroundColor Cyan
    exit 1
}

# Parse connection string
if ($directUrl -match "postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)") {
    $user = $matches[1]
    $pass = $matches[2]
    $host = $matches[3]
    $port = $matches[4]
    $db = $matches[5]
    
    Write-Host "Connection Details:" -ForegroundColor Yellow
    Write-Host "  Host: $host" -ForegroundColor White
    Write-Host "  Port: $port" -ForegroundColor White
    Write-Host "  Database: $db" -ForegroundColor White
    Write-Host "  User: $user" -ForegroundColor White
    Write-Host ""
    
    $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $outputFile = "aiven-backup-$timestamp.sql"
    
    Write-Host "Exporting database to: $outputFile" -ForegroundColor Yellow
    Write-Host "This may take a few minutes..." -ForegroundColor Yellow
    Write-Host ""
    
    # Set PGPASSWORD for pg_dump
    $env:PGPASSWORD = $pass
    
    try {
        # Run pg_dump
        & pg_dump -h $host -p $port -U $user -d $db -F p --no-owner --no-acl -f $outputFile
        
        if ($LASTEXITCODE -eq 0) {
            $fileSize = (Get-Item $outputFile).Length / 1MB
            Write-Host ""
            Write-Host "✅ Database exported successfully!" -ForegroundColor Green
            Write-Host "   File: $outputFile" -ForegroundColor White
            Write-Host "   Size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor White
            Write-Host ""
            Write-Host "Next step: Import to local database" -ForegroundColor Yellow
            Write-Host "  .\scripts\import-to-local-db.ps1 -BackupFile $outputFile" -ForegroundColor Cyan
        } else {
            Write-Host ""
            Write-Host "❌ Export failed. Check connection and try again." -ForegroundColor Red
        }
    } catch {
        Write-Host ""
        Write-Host "❌ Error during export:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    } finally {
        # Clear password from environment
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "❌ Could not parse DIRECT_DATABASE_URL" -ForegroundColor Red
    Write-Host "Please check your connection string format" -ForegroundColor Yellow
}


