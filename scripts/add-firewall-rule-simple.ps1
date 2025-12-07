# Simple one-line command to add firewall rule
# Run this in PowerShell as Administrator

New-NetFirewallRule -DisplayName "Aiven PostgreSQL" -Direction Outbound -RemotePort 18671 -Protocol TCP -Action Allow

Write-Host "Firewall rule added! Testing connection..." -ForegroundColor Green
Test-NetConnection -ComputerName kimyawy-ahmednader4589-3654.c.aivencloud.com -Port 18671

