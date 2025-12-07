# Temporary Connection to Aiven for Data Migration

Since you can't connect from your current network, here are options to temporarily connect and export your data:

## Option 1: Use a VPN Service (Recommended)

A VPN can bypass your router/ISP restrictions:

1. **Install a VPN:**
   - Free options: ProtonVPN, Windscribe (limited free tier)
   - Paid options: NordVPN, ExpressVPN, etc.

2. **Connect to VPN:**
   - Choose a server location
   - Connect

3. **Test connection:**
   ```powershell
   Test-NetConnection -ComputerName kimyawy-ahmednader4589-3654.c.aivencloud.com -Port 18671
   ```

4. **If connection works, export data:**
   ```powershell
   .\scripts\export-aiven-data.ps1
   ```
   Or using Node.js:
   ```powershell
   node scripts/export-aiven-data.js
   ```

## Option 2: Use a Different Network

1. **Try different networks:**
   - Friend's WiFi
   - Coffee shop WiFi
   - Library WiFi
   - Mobile hotspot from different carrier
   - Work/school network

2. **Once connected, export:**
   ```powershell
   .\scripts\export-aiven-data.ps1
   ```

## Option 3: Use Aiven Backup Download

1. **Go to Aiven Console:**
   - Navigate to: **Backups** section
   - Look for "Download backup" option
   - Download the latest backup file

2. **If backup is in different format:**
   - May need to convert or restore to a temporary database first
   - Then export from there

## Option 4: Use Cloud VM/Service

1. **Spin up a temporary VM:**
   - AWS EC2 (free tier available)
   - Google Cloud Compute Engine
   - Azure VM
   - DigitalOcean Droplet

2. **From the VM:**
   - Install PostgreSQL client tools
   - Connect to Aiven
   - Export data
   - Download the backup file

## Option 5: Use Aiven's Web SQL Client (if available)

1. **Check Aiven Console:**
   - Look for "Query" or "SQL Editor" feature
   - Some Aiven plans include web-based SQL client
   - You can export data directly from there

## Export Scripts

### Using pg_dump (requires PostgreSQL client):
```powershell
.\scripts\export-aiven-data.ps1
```

### Using Node.js (no PostgreSQL client needed):
```powershell
node scripts/export-aiven-data.js
```

Both scripts will:
- Connect to Aiven database
- Export all tables and data
- Create a SQL backup file: `aiven-backup-YYYYMMDD-HHMMSS.sql`

## After Exporting

1. **Import to local database:**
   ```powershell
   .\scripts\import-to-local-db.ps1 -BackupFile aiven-backup-YYYYMMDD-HHMMSS.sql
   ```

2. **Or manually import:**
   ```powershell
   psql -h localhost -U postgres -d kimyawy -f aiven-backup-YYYYMMDD-HHMMSS.sql
   ```

## Quick Test Connection

Before exporting, test if you can connect:

```powershell
# Test network connectivity
Test-NetConnection -ComputerName kimyawy-ahmednader4589-3654.c.aivencloud.com -Port 18671

# Test database connection
node scripts/test-raw-connection.js
```

## Recommended Approach

**Best option:** Use a VPN service (Option 1)
- Quick to set up
- Usually works immediately
- Can disconnect after export

**Alternative:** Use a different network (Option 2)
- Free if you have access
- No additional software needed

**If nothing works:** Check Aiven Console for backup download (Option 3)


