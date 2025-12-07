# Prisma Database Setup Guide

This guide will help you configure your project to use Prisma's database service.

## Prisma Database Connection Strings

Prisma Data Platform provides two connection strings:

1. **DATABASE_URL**: Prisma Accelerate connection (for production/optimized queries)
   - Format: `prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY`
   
2. **DIRECT_DATABASE_URL**: Direct PostgreSQL connection (for migrations and direct access)
   - Format: `postgresql://user:password@host:port/database?sslmode=require`

## Step 1: Get Your Prisma Connection Strings

1. **Go to Prisma Console:**
   - https://console.prisma.io/
   - Login to your account

2. **Navigate to your project:**
   - Select your project
   - Go to **Settings** → **Connection Strings** or **Database**

3. **Copy both connection strings:**
   - **DATABASE_URL** (Prisma Accelerate URL)
   - **DIRECT_DATABASE_URL** (Direct PostgreSQL connection)

## Step 2: Update Your .env File

Replace your current connection strings with Prisma's:

```env
# Prisma Accelerate Connection (for app runtime)
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_PRISMA_API_KEY"

# Direct PostgreSQL Connection (for migrations and direct access)
DIRECT_DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

**Important:**
- Replace `YOUR_PRISMA_API_KEY` with your actual Prisma API key
- Replace the `DIRECT_DATABASE_URL` with your actual direct connection string from Prisma Console
- Make sure both are properly quoted

## Step 3: Verify Configuration

Your code is already configured correctly:
- ✅ `lib/db.ts` uses Prisma Accelerate extension
- ✅ `prisma/schema.prisma` uses both `DATABASE_URL` and `DIRECT_DATABASE_URL`
- ✅ All Prisma queries will automatically use Accelerate

## Step 4: Test the Connection

Run the test script:

```powershell
node scripts/test-prisma-connection.js
```

This will verify:
- DATABASE_URL is set correctly
- DIRECT_DATABASE_URL is set correctly
- Connection to Prisma database works
- Prisma Accelerate is functioning

## Step 5: Push Schema to Prisma Database

After verifying connection:

```powershell
npx prisma db push
```

This will create all your tables in the Prisma database.

## Step 6: Generate Prisma Client

```powershell
npx prisma generate
```

## Troubleshooting

### Connection Issues

If you get connection errors:

1. **Verify API Key:**
   - Make sure your Prisma API key is correct
   - Check if the key has expired
   - Regenerate if needed

2. **Check Direct Connection:**
   - Verify DIRECT_DATABASE_URL format
   - Ensure it includes `?sslmode=require`
   - Test direct connection separately

3. **Test Connection:**
   ```powershell
   node scripts/test-prisma-connection.js
   ```

### Migration Issues

If `prisma db push` fails:

1. Check DIRECT_DATABASE_URL is correct
2. Verify database exists in Prisma Console
3. Check network connectivity
4. Review error messages for specific issues

## Benefits of Prisma Database

✅ **Optimized Performance**: Prisma Accelerate provides connection pooling and query optimization
✅ **Global Edge Network**: Faster queries from anywhere
✅ **Automatic Scaling**: Handles traffic spikes automatically
✅ **Integrated Tooling**: Works seamlessly with Prisma ORM
✅ **No Network Issues**: Prisma handles all connectivity

## Next Steps

After setup:
1. Test your application
2. Verify all queries work correctly
3. Monitor performance in Prisma Console
4. Set up backups if needed

