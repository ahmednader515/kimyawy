# Check for network issues that might block the connection

Write-Host "=== Network Diagnostics ===" -ForegroundColor Cyan
Write-Host ""

# Check for VPN
Write-Host "1. Checking for active VPN connections..." -ForegroundColor Yellow
$vpnAdapters = Get-NetAdapter | Where-Object { $_.InterfaceDescription -like "*VPN*" -or $_.InterfaceDescription -like "*TAP*" -or $_.InterfaceDescription -like "*TUN*" }
if ($vpnAdapters) {
    Write-Host "   ⚠️  VPN adapter detected:" -ForegroundColor Yellow
    $vpnAdapters | ForEach-Object { Write-Host "      - $($_.Name) ($($_.InterfaceDescription))" -ForegroundColor White }
    Write-Host "   Try disconnecting VPN and test again" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ No VPN adapters detected" -ForegroundColor Green
}

# Check default gateway (router)
Write-Host "`n2. Checking network gateway..." -ForegroundColor Yellow
$gateway = (Get-NetRoute -DestinationPrefix "0.0.0.0/0" | Where-Object { $_.NextHop -ne "0.0.0.0" }).NextHop | Select-Object -First 1
if ($gateway) {
    Write-Host "   Gateway (Router): $gateway" -ForegroundColor White
    Write-Host "   ⚠️  Your router might be blocking outbound connections on port 18671" -ForegroundColor Yellow
    Write-Host "   Check router firewall settings or contact your ISP" -ForegroundColor Yellow
} else {
    Write-Host "   ⚠️  Could not detect gateway" -ForegroundColor Yellow
}

# Check proxy settings
Write-Host "`n3. Checking proxy settings..." -ForegroundColor Yellow
$proxy = [System.Net.WebRequest]::GetSystemWebProxy()
$proxyUrl = $proxy.GetProxy("http://kimyawy-ahmednader4589-3654.c.aivencloud.com")
if ($proxyUrl -ne "http://kimyawy-ahmednader4589-3654.c.aivencloud.com:18671") {
    Write-Host "   ⚠️  Proxy detected: $proxyUrl" -ForegroundColor Yellow
    Write-Host "   Proxy might be blocking the connection" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ No proxy detected" -ForegroundColor Green
}

# Check if we can reach other ports on the same host
Write-Host "`n4. Testing connectivity to Aiven host..." -ForegroundColor Yellow
$ping = Test-Connection -ComputerName kimyawy-ahmednader4589-3654.c.aivencloud.com -Count 1 -Quiet
if ($ping) {
    Write-Host "   ✅ Host is reachable (ping works)" -ForegroundColor Green
} else {
    Write-Host "   ❌ Host is not reachable" -ForegroundColor Red
}

Write-Host "`n=== Recommendations ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Since Windows Firewall rule didn't help, the issue is likely:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Router/ISP Firewall:" -ForegroundColor White
Write-Host "   - Your router or ISP might be blocking port 18671" -ForegroundColor Gray
Write-Host "   - Contact your ISP or check router firewall settings" -ForegroundColor Gray
Write-Host "   - Try using a mobile hotspot to test if it's your network" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Aiven Service Issue:" -ForegroundColor White
Write-Host "   - Check Aiven console for any service notifications" -ForegroundColor Gray
Write-Host "   - The port might have changed - verify in Aiven console" -ForegroundColor Gray
Write-Host "   - Try restarting the Aiven service" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Alternative Solutions:" -ForegroundColor White
Write-Host "   - Use a VPN to bypass network restrictions" -ForegroundColor Gray
Write-Host "   - Use a different network (mobile hotspot, different WiFi)" -ForegroundColor Gray
Write-Host "   - Contact Aiven support to verify service status" -ForegroundColor Gray
Write-Host ""

