// Test database connection WITHOUT Prisma Accelerate
const { PrismaClient } = require('@prisma/client');

async function testDirectConnection() {
  // Create Prisma client WITHOUT Accelerate extension
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('Testing DIRECT database connection (without Accelerate)...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (hidden)' : 'NOT SET');
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Direct connection successful!', result);
    
    // Try to get database version
    const version = await prisma.$queryRaw`SELECT version()`;
    console.log('Database version:', version);
    
  } catch (error) {
    console.error('❌ Direct connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'P1001') {
      console.error('\n💡 This confirms the database server is unreachable.');
      console.error('Most likely causes:');
      console.error('1. ⚠️  Database is PAUSED in Aiven console (most common on free tier)');
      console.error('2. Network/firewall blocking the connection');
      console.error('3. Database server is down');
      console.error('\n📋 Action items:');
      console.error('1. Log into Aiven console: https://console.aiven.io/');
      console.error('2. Check if your database service is paused');
      console.error('3. If paused, click "Resume" or "Start"');
      console.error('4. Wait a few minutes for the database to fully start');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testDirectConnection();

