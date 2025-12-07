# Refresh Aiven Connection String

Since VPN didn't work and Aiven console shows everything is fine, the issue is likely with the connection string itself.

## Step 1: Refresh Password in Aiven Console

1. **Go to Aiven Console:**
   - https://console.aiven.io/
   - Navigate to your service: `kimyawy`

2. **Refresh the Password:**
   - Go to: **Service settings** → **Users** (or look for password management)
   - Find the `avnadmin` user
   - Click **"Reset password"** or **"Refresh password"**
   - **Copy the new password immediately** (it won't be shown again)

3. **Alternative: Get Fresh Connection String:**
   - Go to: **Overview** → **Connection information**
   - Click **"Show password"** or **"Reveal password"**
   - Click **"Copy connection string"** to get a fresh one

## Step 2: Update Your .env File

Replace your `DIRECT_DATABASE_URL` with the fresh connection string from Aiven:

```env
DIRECT_DATABASE_URL="postgresql://avnadmin:NEW_PASSWORD@kimyawy-ahmednader4589-3654.c.aivencloud.com:18671/defaultdb?sslmode=require"
```

**Important:** Make sure:
- Password is URL-encoded if it contains special characters
- Protocol is `postgresql://` (not `postgres://`)
- Includes `?sslmode=require` at the end

## Step 3: Test the Connection

```powershell
node scripts/test-raw-connection.js
```

## Step 4: If Still Failing - Check Aiven Backups

Since you can't connect, try downloading backup directly:

1. **Go to Aiven Console:**
   - Navigate to: **Backups** section
   - Look for **"Download backup"** or **"Export backup"** button
   - Download the latest backup file

2. **If backup download is available:**
   - Download the `.sql` or `.dump` file
   - Import it directly to your local database
   - Skip the connection step entirely

## Step 5: Verify Connection String Format

Run this to verify your connection string:

```powershell
node scripts/verify-connection-string.js
```

This will check:
- Protocol format
- SSL configuration
- Password encoding
- All connection components

## Common Issues

### Password Contains Special Characters
If your password has `@`, `:`, `/`, `?`, `#`, etc., it needs to be URL-encoded:
- `@` becomes `%40`
- `:` becomes `%3A`
- `/` becomes `%2F`
- `?` becomes `%3F`
- `#` becomes `%23`

### Password Expired
Aiven passwords can expire. Always refresh from console.

### Wrong Database Name
Make sure it's `defaultdb` (not `kimyawy` or something else)

## Quick Fix Script

After refreshing password in Aiven, update your `.env` and test:

```powershell
# Test connection
node scripts/test-raw-connection.js

# If successful, export data
node scripts/export-aiven-data.js
```

