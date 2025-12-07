# How to Check Aiven Console for Issues

## Step 1: Access Aiven Console

1. **Go to:** https://console.aiven.io/
2. **Log in** with your Aiven account credentials

## Step 2: Navigate to Your Service

1. **Select your project:** `ahmednader4589-3654`
2. **Click on your service:** `kimyawy` (PostgreSQL)

## Step 3: Check Service Status

### A. Overview Page
- **Look for service status indicator:**
  - ✅ Green "Running" = Service is active
  - ⚠️ Yellow "Starting" = Service is initializing
  - ❌ Red "Stopped" or "Error" = Service has issues

### B. Check for Notifications
- **Look for any warning/error banners** at the top of the page
- **Check for maintenance notifications**
- **Look for any service alerts**

## Step 4: Check Service Logs

1. **Go to:** `Logs` in the left sidebar
2. **Look for:**
   - Connection errors
   - Authentication failures
   - Network errors
   - Service restart messages
   - Any error messages in red

## Step 5: Check Service Settings

1. **Go to:** `Service settings` in the left sidebar
2. **Check:**
   - **Connection information** - Verify port is still `18671`
   - **IP allowlist** - Should be open to all (0.0.0.0/0)
   - **Service status** - Any maintenance or issues listed

## Step 6: Check Metrics

1. **Go to:** `Metrics` in the left sidebar
2. **Look for:**
   - Connection count (should show active connections)
   - CPU/Memory usage (high usage might indicate issues)
   - Network traffic (should show activity if service is working)

## Step 7: Check Backups

1. **Go to:** `Backups` in the left sidebar
2. **Check:**
   - Last backup time
   - Backup status
   - If backups are failing, service might have issues

## What to Look For

### Red Flags (Service Issues):
- ❌ Service status shows "Error" or "Stopped"
- ❌ Error messages in logs
- ❌ Connection count is 0 when it should have connections
- ❌ Recent service restarts
- ❌ Maintenance notifications
- ❌ IP allowlist changed or restricted

### Good Signs:
- ✅ Service status is "Running"
- ✅ No error messages in logs
- ✅ Connection information shows correct port
- ✅ Metrics show normal activity
- ✅ Recent successful backups

## If You Find Issues

### Service is Stopped/Error:
1. Try **restarting the service** (if option available)
2. Check **service logs** for specific error messages
3. Contact **Aiven support** if issue persists

### Port Changed:
1. Update `DIRECT_DATABASE_URL` in your `.env` with new port
2. Test connection again

### IP Allowlist Issues:
1. Ensure it's set to allow all: `0.0.0.0/0`
2. If restricted, add your IP or allow all

### Service Maintenance:
1. Wait for maintenance to complete
2. Check estimated completion time
3. Try connecting after maintenance ends

## Quick Checklist

- [ ] Service status is "Running"
- [ ] No error banners or notifications
- [ ] Port in connection info is `18671`
- [ ] IP allowlist is open (0.0.0.0/0)
- [ ] No errors in service logs
- [ ] Metrics show normal activity
- [ ] Recent backups are successful

