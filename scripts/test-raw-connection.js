// Test raw PostgreSQL connection without Prisma
const { Client } = require('pg');
require('dotenv').config();

async function testRawConnection() {
  const directUrl = process.env.DIRECT_DATABASE_URL;
  
  if (!directUrl) {
    console.error('❌ DIRECT_DATABASE_URL not set');
    process.exit(1);
  }
  
  console.log('Testing raw PostgreSQL connection...');
  console.log('Connection string (first 50 chars):', directUrl.substring(0, 50) + '...');
  
  const client = new Client({
    connectionString: directUrl,
    ssl: {
      rejectUnauthorized: false, // For Aiven, we might need this
    },
  });
  
  try {
    console.log('\nAttempting to connect...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT version(), current_database()');
    console.log('\nDatabase Info:');
    console.log('  Version:', result.rows[0].version);
    console.log('  Database:', result.rows[0].current_database);
    
    await client.end();
    console.log('\n✅ Connection test passed!');
    
  } catch (error) {
    console.error('\n❌ Connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', error);
    
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.error('\n💡 Network connectivity issue detected');
      console.error('Possible causes:');
      console.error('1. Windows Firewall blocking outbound connections on port 18671');
      console.error('2. Router/ISP blocking the connection');
      console.error('3. VPN or proxy interfering');
      console.error('4. Aiven service temporarily unavailable');
    } else if (error.message.includes('starting up')) {
      console.error('\n💡 Database is still starting up. Wait a few minutes and try again.');
    }
    
    process.exit(1);
  }
}

testRawConnection();

