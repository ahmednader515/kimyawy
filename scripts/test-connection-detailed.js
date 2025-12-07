// Detailed connection test with different SSL configurations
const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  const directUrl = process.env.DIRECT_DATABASE_URL;
  
  if (!directUrl) {
    console.error('❌ DIRECT_DATABASE_URL not set');
    process.exit(1);
  }
  
  console.log('=== Detailed Connection Test ===\n');
  console.log('Connection String (first 60 chars):', directUrl.substring(0, 60) + '...\n');
  
  // Parse connection string
  const urlMatch = directUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(\?.*)?/);
  if (!urlMatch) {
    console.error('❌ Could not parse connection string');
    console.error('Expected format: postgresql://user:password@host:port/database?sslmode=require');
    process.exit(1);
  }
  
  const [, user, password, host, port, database, queryString] = urlMatch;
  
  console.log('Parsed Connection Details:');
  console.log('  User:', user);
  console.log('  Host:', host);
  console.log('  Port:', port);
  console.log('  Database:', database);
  console.log('  Query String:', queryString || '(none)');
  console.log('');
  
  // Test different SSL configurations
  const sslConfigs = [
    { name: 'Default (from connection string)', config: {} },
    { name: 'SSL Required (rejectUnauthorized: false)', config: { rejectUnauthorized: false } },
    { name: 'SSL Required (rejectUnauthorized: true)', config: { rejectUnauthorized: true } },
    { name: 'No SSL', config: false },
  ];
  
  for (const { name, config } of sslConfigs) {
    console.log(`Testing: ${name}...`);
    
    const client = new Client({
      host,
      port: parseInt(port),
      user,
      password,
      database,
      ssl: config,
    });
    
    try {
      await client.connect();
      console.log(`✅ SUCCESS with ${name}!`);
      
      // Test a query
      const result = await client.query('SELECT version(), current_database()');
      console.log('  Database Version:', result.rows[0].version.split('\n')[0]);
      console.log('  Current Database:', result.rows[0].current_database);
      
      await client.end();
      console.log('\n✅ Connection is working! Use this SSL configuration.\n');
      return;
      
    } catch (error) {
      console.log(`❌ Failed: ${error.code || error.message}`);
      if (error.message.includes('password')) {
        console.log('  ⚠️  Password authentication failed - check your password');
      } else if (error.message.includes('SSL')) {
        console.log('  ⚠️  SSL configuration issue');
      }
      console.log('');
    }
  }
  
  console.log('❌ All connection attempts failed');
  console.log('\nPossible issues:');
  console.log('1. Password might be incorrect');
  console.log('2. Database name might be wrong');
  console.log('3. User might not have access');
  console.log('4. Aiven service might have restrictions');
  console.log('\n💡 Try:');
  console.log('1. Verify connection string in Aiven Console');
  console.log('2. Check if password needs to be URL-encoded');
  console.log('3. Verify database name is correct');
  console.log('4. Check Aiven service logs for authentication errors');
}

testConnection().catch(console.error);

