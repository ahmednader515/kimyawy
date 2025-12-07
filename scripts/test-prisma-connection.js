// Test Prisma Database Connection
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function testPrismaConnection() {
  console.log('=== Prisma Database Connection Test ===\n');
  
  // Check environment variables
  const dbUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_DATABASE_URL;
  
  console.log('1. Environment Variables:');
  console.log('   DATABASE_URL:', dbUrl ? `Set (${dbUrl.length} chars)` : '❌ NOT SET');
  console.log('   DIRECT_DATABASE_URL:', directUrl ? `Set (${directUrl.length} chars)` : '❌ NOT SET');
  console.log('');
  
  if (!dbUrl) {
    console.error('❌ DATABASE_URL is required');
    console.error('   Get it from Prisma Console: https://console.prisma.io/');
    process.exit(1);
  }
  
  if (!directUrl) {
    console.error('❌ DIRECT_DATABASE_URL is required');
    console.error('   Get it from Prisma Console: https://console.prisma.io/');
    process.exit(1);
  }
  
  // Check DATABASE_URL format
  console.log('2. DATABASE_URL Format:');
  if (dbUrl.startsWith('prisma://')) {
    console.log('   ✅ Correct format (Prisma Accelerate URL)');
    if (dbUrl.includes('api_key=')) {
      console.log('   ✅ Contains API key');
    } else {
      console.log('   ⚠️  Missing API key parameter');
    }
  } else {
    console.log('   ⚠️  Should start with prisma://');
    console.log('   Expected: prisma://accelerate.prisma-data.net/?api_key=...');
  }
  console.log('');
  
  // Check DIRECT_DATABASE_URL format
  console.log('3. DIRECT_DATABASE_URL Format:');
  if (directUrl.startsWith('postgresql://')) {
    console.log('   ✅ Correct format (PostgreSQL URL)');
  } else if (directUrl.startsWith('postgres://')) {
    console.log('   ⚠️  Uses postgres:// (should be postgresql://)');
  } else {
    console.log('   ❌ Invalid format');
  }
  
  if (directUrl.includes('sslmode=require')) {
    console.log('   ✅ SSL mode is set');
  } else {
    console.log('   ⚠️  SSL mode not specified (may be required)');
  }
  console.log('');
  
  // Test Prisma Accelerate connection
  console.log('4. Testing Prisma Accelerate Connection...');
  try {
    const prisma = new PrismaClient({
      log: ['error', 'warn'],
    });
    
    // Test query through Accelerate
    const result = await prisma.$queryRaw`SELECT 1 as test, current_database() as database`;
    console.log('   ✅ Prisma Accelerate connection successful!');
    console.log('   Database:', result[0].database);
    
    // Test a simple query
    console.log('\n5. Testing Prisma Query...');
    try {
      // Try to query User table (might not exist yet, that's OK)
      const userCount = await prisma.user.count().catch(() => null);
      if (userCount !== null) {
        console.log(`   ✅ User table exists (${userCount} users)`);
      } else {
        console.log('   ℹ️  User table does not exist yet (run: npx prisma db push)');
      }
    } catch (error) {
      console.log('   ℹ️  Tables not created yet (run: npx prisma db push)');
    }
    
    await prisma.$disconnect();
    
    console.log('\n✅ All tests passed!');
    console.log('\nNext steps:');
    console.log('  1. Run: npx prisma db push (to create tables)');
    console.log('  2. Run: npx prisma generate (to generate Prisma Client)');
    console.log('  3. Start your application');
    
  } catch (error) {
    console.error('\n❌ Connection failed:');
    console.error('   Error:', error.message);
    
    if (error.code === 'P5000' || error.message.includes('Accelerate')) {
      console.error('\n💡 Prisma Accelerate connection issue:');
      console.error('   1. Verify your API key is correct');
      console.error('   2. Check if API key has expired');
      console.error('   3. Verify DATABASE_URL format');
      console.error('   4. Check Prisma Console for service status');
    } else if (error.code === 'P1001') {
      console.error('\n💡 Database connection issue:');
      console.error('   1. Verify DIRECT_DATABASE_URL is correct');
      console.error('   2. Check if database is accessible');
      console.error('   3. Verify network connectivity');
    } else {
      console.error('\n💡 General error:');
      console.error('   1. Check error message above');
      console.error('   2. Verify connection strings in .env');
      console.error('   3. Check Prisma Console for issues');
    }
    
    process.exit(1);
  }
}

testPrismaConnection().catch(console.error);

