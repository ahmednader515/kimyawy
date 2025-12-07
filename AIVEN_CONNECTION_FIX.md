# Aiven Connection Fix Guide

## Issue
Port 18671 connection is being refused (`ECONNREFUSED`)

## Solution 1: Use Aiven Connection Pooler (RECOMMENDED)

Aiven provides connection poolers that often work better and use different ports:

1. **Go to Aiven Console:**
   - Navigate to: `Service settings → Connection pools`
   - Or: `Overview → Connection information` (look for pooler options)

2. **Create/Use Connection Pooler:**
   - Connection poolers typically use ports like `18672`, `18673`, etc.
   - They're more reliable and handle connections better
   - Copy the pooler connection string

3. **Update your `.env` file:**
   ```env
   DIRECT_DATABASE_URL="postgresql://avnadmin:PASSWORD@kimyawy-ahmednader4589-3654.c.aivencloud.com:18672/defaultdb?sslmode=require"
   ```
   (Replace `18672` with your actual pooler port)

## Solution 2: Windows Firewall Exception

If you need to use the direct connection (port 18671):

1. **Open PowerShell as Administrator**

2. **Run this command:**
   ```powershell
   New-NetFirewallRule -DisplayName "Aiven PostgreSQL" -Direction Outbound -RemotePort 18671 -Protocol TCP -Action Allow
   ```

3. **Test the connection:**
   ```powershell
   npx prisma db push
   ```

## Solution 3: Verify Port in Aiven

1. **Check Aiven Console:**
   - Go to: `Service settings → Connection information`
   - Verify the port is still `18671`
   - Sometimes Aiven changes ports after maintenance

2. **If port changed:**
   - Update `DIRECT_DATABASE_URL` in `.env` with the new port

## Solution 4: Check for VPN/Proxy

If you're using a VPN or corporate proxy:
- Try disconnecting VPN temporarily to test
- Check if your network/router has port restrictions
- Contact your network administrator if on a corporate network

## Quick Test

After applying any solution, test with:
```powershell
node scripts/test-raw-connection.js
```

If successful, you should see:
```
✅ Connected successfully!
```

Then try:
```powershell
npx prisma db push
```

