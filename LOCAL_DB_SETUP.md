# Migrate to Local PostgreSQL Database

Since you're unable to connect to Aiven from both your network and mobile data, let's set up a local PostgreSQL database for development.

## Step 1: Install PostgreSQL

### Option A: Direct Installation (Recommended)

1. **Download PostgreSQL:**
   - Go to: https://www.postgresql.org/download/windows/
   - Download the installer
   - During installation:
     - Remember the password you set for the `postgres` user
     - Default port is `5432`
     - Install pgAdmin (optional, but helpful)

### Option B: Using Docker (Easier)

If you have Docker installed:

```powershell
docker run --name kimyawy-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=kimyawy `
  -p 5432:5432 `
  -d postgres:latest
```

### Option C: Using Chocolatey

```powershell
choco install postgresql
```

## Step 2: Update Your .env File

Update your `.env` file with local database connection:

```env
# Keep your Prisma Accelerate URL for production (if needed)
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_KEY"

# Use local database for development
DIRECT_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kimyawy?sslmode=disable"
```

**Note:** Replace `postgres:postgres` with your actual PostgreSQL username and password.

## Step 3: Create Local Database

Open PowerShell and run:

```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE kimyawy;

# Exit
\q
```

Or if using Docker:

```powershell
docker exec -it kimyawy-postgres psql -U postgres -c "CREATE DATABASE kimyawy;"
```

## Step 4: Push Schema to Local Database

```powershell
npx prisma db push
```

This will create all your tables in the local database.

## Step 5: Export Data from Aiven (When Connection Works)

**Important:** You'll need to export your data from Aiven when you can connect. Options:

### Option A: Use Mobile Hotspot (Different Network)

1. Connect to a different mobile hotspot (friend's phone, different carrier)
2. Run the export script:
   ```powershell
   .\scripts\export-from-aiven.ps1
   ```

### Option B: Check Aiven Console for Backups

1. Go to Aiven Console
2. Navigate to: **Backups** section
3. Download the latest backup if available
4. Restore it to your local database

### Option C: Use Aiven's Backup Feature

1. In Aiven Console → **Backups**
2. Create a manual backup
3. Download the backup file
4. Restore to local database

## Step 6: Import Data to Local Database

Once you have the backup file:

```powershell
psql -h localhost -U postgres -d kimyawy -f aiven-backup.sql
```

Or if using Docker:

```powershell
docker exec -i kimyawy-postgres psql -U postgres -d kimyawy < aiven-backup.sql
```

## Step 7: Verify Local Database

```powershell
# Test connection
node scripts/test-raw-connection.js

# Check data
psql -U postgres -d kimyawy -c "SELECT COUNT(*) FROM \"User\";"
```

## Troubleshooting

### If `psql` command not found:

Add PostgreSQL to your PATH:
- PostgreSQL is usually installed at: `C:\Program Files\PostgreSQL\<version>\bin`
- Add this to your system PATH environment variable

### If connection fails:

1. Check PostgreSQL is running:
   ```powershell
   Get-Service postgresql*
   ```

2. Check port 5432 is not blocked:
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 5432
   ```

3. Verify credentials in `.env` match your PostgreSQL setup

## Benefits of Local Database

✅ No network connectivity issues
✅ Faster development (no network latency)
✅ Free (no Aiven costs)
✅ Full control over database
✅ Can work offline

## When You Need to Sync Back to Aiven

If you need to push changes back to Aiven later:

1. Fix your network/router issue
2. Update `DIRECT_DATABASE_URL` back to Aiven connection string
3. Run `npx prisma db push` to sync schema
4. Export from local and import to Aiven if needed

