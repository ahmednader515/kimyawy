# Add Windows Firewall Rule for Aiven PostgreSQL
# This script must be run as Administrator

Write-Host "=== Adding Windows Firewall Rule for Aiven PostgreSQL ===" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script must be run as Administrator!" -ForegroundColor Red
    Write-Host ""
    Write-Host "To run as Administrator:" -ForegroundColor Yellow
    Write-Host "1. Right-click on PowerShell" -ForegroundColor White
    Write-Host "2. Select 'Run as Administrator'" -ForegroundColor White
    Write-Host "3. Navigate to this directory: cd 'D:\Web Dev\kimyawy'" -ForegroundColor White
    Write-Host "4. Run: .\scripts\add-firewall-rule.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "Or run this command directly in Admin PowerShell:" -ForegroundColor Yellow
    Write-Host 'New-NetFirewallRule -DisplayName "Aiven PostgreSQL" -Direction Outbound -RemotePort 18671 -Protocol TCP -Action Allow' -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Check if rule already exists
$existingRule = Get-NetFirewallRule -DisplayName "Aiven PostgreSQL" -ErrorAction SilentlyContinue

if ($existingRule) {
    Write-Host "⚠️  Firewall rule 'Aiven PostgreSQL' already exists" -ForegroundColor Yellow
    $response = Read-Host "Do you want to remove and recreate it? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        Remove-NetFirewallRule -DisplayName "Aiven PostgreSQL"
        Write-Host "✅ Removed existing rule" -ForegroundColor Green
    } else {
        Write-Host "Keeping existing rule. Exiting." -ForegroundColor Yellow
        exit 0
    }
}

# Add the firewall rule
try {
    Write-Host "Adding firewall rule for port 18671..." -ForegroundColor Yellow
    New-NetFirewallRule `
        -DisplayName "Aiven PostgreSQL" `
        -Description "Allow outbound connections to Aiven PostgreSQL database on port 18671" `
        -Direction Outbound `
        -RemotePort 18671 `
        -Protocol TCP `
        -Action Allow `
        -Enabled True
    
    Write-Host ""
    Write-Host "✅ Firewall rule added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Testing connection..." -ForegroundColor Yellow
    
    # Test the connection
    Start-Sleep -Seconds 2
    $testResult = Test-NetConnection -ComputerName kimyawy-ahmednader4589-3654.c.aivencloud.com -Port 18671 -WarningAction SilentlyContinue
    
    if ($testResult.TcpTestSucceeded) {
        Write-Host "✅ Connection test successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "You can now run: npx prisma db push" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  Connection test still failing" -ForegroundColor Yellow
        Write-Host "This might be due to:" -ForegroundColor Yellow
        Write-Host "  - Router/ISP blocking the port" -ForegroundColor White
        Write-Host "  - VPN or proxy interference" -ForegroundColor White
        Write-Host "  - Aiven service issue" -ForegroundColor White
        Write-Host ""
        Write-Host "Try running: npx prisma db push" -ForegroundColor Cyan
        Write-Host "The firewall rule is in place, but other factors may be blocking the connection." -ForegroundColor Yellow
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ Error adding firewall rule:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

