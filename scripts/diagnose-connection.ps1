# Diagnose Aiven Database Connection Issues

Write-Host "=== Aiven Database Connection Diagnostics ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Basic connectivity
Write-Host "1. Testing basic connectivity..." -ForegroundColor Yellow
$pingResult = Test-Connection -ComputerName kimyawy-ahmednader4589-3654.c.aivencloud.com -Count 2 -Quiet
if ($pingResult) {
    Write-Host "   ✅ Host is reachable" -ForegroundColor Green
} else {
    Write-Host "   ❌ Host is not reachable" -ForegroundColor Red
}

# Test 2: Port connectivity
Write-Host "`n2. Testing port 18671..." -ForegroundColor Yellow
$tcpTest = Test-NetConnection -ComputerName kimyawy-ahmednader4589-3654.c.aivencloud.com -Port 18671 -WarningAction SilentlyContinue
if ($tcpTest.TcpTestSucceeded) {
    Write-Host "   ✅ Port 18671 is accessible" -ForegroundColor Green
} else {
    Write-Host "   ❌ Port 18671 connection failed" -ForegroundColor Red
    Write-Host "   This is the main issue!" -ForegroundColor Red
}

# Test 3: Check for firewall rules
Write-Host "`n3. Checking Windows Firewall..." -ForegroundColor Yellow
$firewallEnabled = (Get-NetFirewallProfile -Profile Domain,Private,Public | Where-Object { $_.Enabled -eq $true }).Count -gt 0
if ($firewallEnabled) {
    Write-Host "   ⚠️  Windows Firewall is enabled" -ForegroundColor Yellow
    Write-Host "   You may need to allow outbound connections on port 18671" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Windows Firewall is disabled" -ForegroundColor Green
}

# Test 4: Check if Node.js can resolve DNS
Write-Host "`n4. Testing DNS resolution..." -ForegroundColor Yellow
try {
    $dnsResult = [System.Net.Dns]::GetHostAddresses("kimyawy-ahmednader4589-3654.c.aivencloud.com")
    Write-Host "   ✅ DNS resolution successful: $($dnsResult[0].IPAddressToString)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ DNS resolution failed" -ForegroundColor Red
}

Write-Host "`n=== Recommendations ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Since port 18671 is being refused, try these solutions:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Check Aiven Console:" -ForegroundColor White
Write-Host "   - Go to your Aiven service → Connection pools" -ForegroundColor Gray
Write-Host "   - Try using a connection pooler URL instead of direct connection" -ForegroundColor Gray
Write-Host "   - Connection poolers often use different ports (like 18672, 18673)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Check Aiven Service Settings:" -ForegroundColor White
Write-Host "   - Go to Service settings → Connection information" -ForegroundColor Gray
Write-Host "   - Verify the port hasn't changed" -ForegroundColor Gray
Write-Host "   - Check if there are any service maintenance notifications" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Try Windows Firewall Exception (Run as Administrator):" -ForegroundColor White
Write-Host "   New-NetFirewallRule -DisplayName 'Aiven PostgreSQL' -Direction Outbound -RemotePort 18671 -Protocol TCP -Action Allow" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Check if you're behind a VPN or proxy that might be blocking the connection" -ForegroundColor White
Write-Host ""

