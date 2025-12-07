// Test database connection script
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (hidden)' : 'NOT SET');
    console.log('DIRECT_DATABASE_URL:', process.env.DIRECT_DATABASE_URL ? 'Set (hidden)' : 'NOT SET');
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Connection successful!', result);
    
    // Try to get database version
    const version = await prisma.$queryRaw`SELECT version()`;
    console.log('Database version:', version);
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'P1001') {
      console.error('\n💡 Troubleshooting tips:');
      console.error('1. Check if your Aiven database is paused (log into Aiven console)');
      console.error('2. Verify your DATABASE_URL includes SSL parameters: ?sslmode=require');
      console.error('3. Check your network connection and firewall settings');
      console.error('4. Verify the connection string in your Aiven console');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

