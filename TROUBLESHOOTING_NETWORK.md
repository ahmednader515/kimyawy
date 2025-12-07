# Network Connection Troubleshooting

## Issue
Port 18671 is being refused even after adding Windows Firewall rule.

## Root Cause
Your router (192.168.1.1) or ISP is likely blocking outbound connections on port 18671.

## Quick Test: Mobile Hotspot

**Test if it's your network:**
1. Connect your computer to a mobile hotspot (phone's WiFi)
2. Try running: `npx prisma db push`
3. If it works → Your router/ISP is blocking the port
4. If it still fails → Aiven service issue

## Solutions

### Solution 1: Router Firewall Settings (If you have access)

1. **Access your router:**
   - Open browser: `http://192.168.1.1`
   - Login with admin credentials

2. **Check firewall settings:**
   - Look for "Firewall" or "Security" settings
   - Check for "Port Blocking" or "Outbound Rules"
   - Allow outbound connections on port 18671

3. **If you can't modify router:**
   - Contact your ISP
   - Ask them to unblock port 18671 for outbound connections

### Solution 2: Use Mobile Hotspot (Temporary Workaround)

When you need to run `prisma db push`:
1. Connect to mobile hotspot
2. Run your Prisma commands
3. Switch back to regular WiFi

### Solution 3: Check Aiven Console

1. **Verify the port hasn't changed:**
   - Go to Aiven Console
   - Service settings → Connection information
   - Check if port is still 18671

2. **Check for service issues:**
   - Look for any maintenance notifications
   - Check service logs for errors

3. **Try restarting the service:**
   - In Aiven Console, try restarting the PostgreSQL service
   - Wait a few minutes and test again

### Solution 4: Use VPN (If allowed)

A VPN might bypass router/ISP restrictions:
1. Connect to a VPN service
2. Try the connection again
3. Note: Some corporate networks block VPNs

## Why This Happened

Since it worked for 2 weeks, possible causes:
- Router firmware update changed firewall rules
- ISP changed their firewall policies
- Router settings were reset
- Aiven changed their network configuration

## Next Steps

1. **Immediate:** Test with mobile hotspot to confirm it's your network
2. **Short-term:** Use mobile hotspot when you need to run Prisma commands
3. **Long-term:** Fix router firewall or contact ISP

