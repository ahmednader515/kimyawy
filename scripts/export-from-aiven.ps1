# Script to export data from Aiven when connection works
# This will be used when you can connect (via mobile hotspot or after fixing network)

Write-Host "=== Export Data from Aiven ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script exports your Aiven database to a local SQL file." -ForegroundColor Yellow
Write-Host ""

$directUrl = $env:DIRECT_DATABASE_URL

if (-not $directUrl) {
    Write-Host "❌ DIRECT_DATABASE_URL not set in environment" -ForegroundColor Red
    Write-Host "Please set it in your .env file first" -ForegroundColor Yellow
    exit 1
}

# Extract connection details
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
    Write-Host ""
    
    $outputFile = "aiven-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').sql"
    
    Write-Host "Exporting database to: $outputFile" -ForegroundColor Yellow
    Write-Host ""
    
    # Set PGPASSWORD environment variable for pg_dump
    $env:PGPASSWORD = $pass
    
    # Run pg_dump
    $pgDumpCmd = "pg_dump -h $host -p $port -U $user -d $db -F p -f $outputFile"
    
    Write-Host "Running: pg_dump ..." -ForegroundColor Cyan
    Write-Host ""
    
    try {
        Invoke-Expression $pgDumpCmd
        Write-Host ""
        Write-Host "✅ Database exported successfully to: $outputFile" -ForegroundColor Green
        Write-Host ""
        Write-Host "To import to local database:" -ForegroundColor Yellow
        Write-Host "  psql -h localhost -U postgres -d kimyawy -f $outputFile" -ForegroundColor Cyan
    } catch {
        Write-Host ""
        Write-Host "❌ Export failed:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    } finally {
        # Clear password from environment
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "❌ Could not parse DIRECT_DATABASE_URL" -ForegroundColor Red
    Write-Host "Please check your connection string format" -ForegroundColor Yellow
}

