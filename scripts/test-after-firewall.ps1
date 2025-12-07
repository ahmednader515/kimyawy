# Test connection after adding firewall rule

Write-Host "Testing Aiven database connection..." -ForegroundColor Cyan
Write-Host ""

$testResult = Test-NetConnection -ComputerName kimyawy-ahmednader4589-3654.c.aivencloud.com -Port 18671 -InformationLevel Detailed

if ($testResult.TcpTestSucceeded) {
    Write-Host "✅ Port 18671 is now accessible!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run:" -ForegroundColor Yellow
    Write-Host "  npx prisma db push" -ForegroundColor Cyan
} else {
    Write-Host "❌ Port 18671 is still not accessible" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "  1. Firewall rule not applied correctly" -ForegroundColor White
    Write-Host "  2. Router/ISP blocking the port" -ForegroundColor White
    Write-Host "  3. VPN or proxy interference" -ForegroundColor White
    Write-Host "  4. Aiven service issue" -ForegroundColor White
}

