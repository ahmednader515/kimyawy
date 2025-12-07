// Test direct database connection
const { PrismaClient } = require('@prisma/client');

async function testDirectConnection() {
  console.log('Testing DIRECT database connection...\n');
  
  // Check environment variables
  const dbUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_DATABASE_URL;
  
  console.log('Environment Variables:');
  console.log('  DATABASE_URL:', dbUrl ? `Set (${dbUrl.length} chars)` : 'NOT SET');
  console.log('  DIRECT_DATABASE_URL:', directUrl ? `Set (${directUrl.length} chars)` : 'NOT SET');
  
  if (!directUrl && !dbUrl) {
    console.error('\n❌ No database URL found in environment variables');
    process.exit(1);
  }
  
  // Use directUrl if available, otherwise fallback to DATABASE_URL
  const connectionUrl = directUrl || dbUrl;
  
  console.log('\nConnection String Analysis:');
  console.log('  Protocol:', connectionUrl.startsWith('postgres://') ? 'postgres://' : 
                              connectionUrl.startsWith('postgresql://') ? 'postgresql://' : 'Unknown');
  console.log('  Has sslmode:', connectionUrl.includes('sslmode'));
  console.log('  Has sslmode=require:', connectionUrl.includes('sslmode=require'));
  
  // Extract connection details (without password)
  const urlMatch = connectionUrl.match(/(postgres(ql)?):\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
  if (urlMatch) {
    console.log('\nConnection Details:');
    console.log('  Protocol:', urlMatch[1]);
    console.log('  User:', urlMatch[3]);
    console.log('  Host:', urlMatch[5]);
    console.log('  Port:', urlMatch[6]);
    console.log('  Database:', urlMatch[7]);
  }
  
  // Check if it's an Accelerate URL
  if (connectionUrl.includes('@prisma-data.net')) {
    console.log('\n⚠️  WARNING: This appears to be a Prisma Accelerate URL');
    console.log('   For DIRECT connection, you should use the Aiven connection string directly');
  }
  
  // Try to create Prisma client with direct connection
  console.log('\nAttempting direct connection...');
  
  try {
    // Create Prisma client WITHOUT Accelerate
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: connectionUrl,
        },
      },
      log: ['error', 'warn'],
    });
    
    // Test connection
    const result = await prisma.$queryRaw`SELECT version() as version, current_database() as database`;
    console.log('\n✅ Connection successful!');
    console.log('Database info:', result[0]);
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('\n❌ Connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'P1001') {
      console.error('\n💡 Troubleshooting:');
      console.error('1. Verify the connection string format:');
      console.error('   - Should start with postgresql:// (not postgres://)');
      console.error('   - Should include ?sslmode=require');
      console.error('   - Password should be URL-encoded if it contains special characters');
      console.error('2. Test network connectivity:');
      console.error('   - Check if port 18671 is accessible from your network');
      console.error('   - Check Windows Firewall settings');
      console.error('3. Verify credentials in Aiven console');
    }
    
    process.exit(1);
  }
}

testDirectConnection().catch(console.error);

