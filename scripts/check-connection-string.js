// Check connection string format
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_DATABASE_URL;

console.log('=== Connection String Analysis ===\n');

if (!dbUrl) {
  console.error('❌ DATABASE_URL is not set in .env file');
  process.exit(1);
}

console.log('DATABASE_URL:');
console.log('  - Length:', dbUrl.length);
console.log('  - Has sslmode:', dbUrl.includes('sslmode'));
console.log('  - Has sslmode=require:', dbUrl.includes('sslmode=require'));
console.log('  - Has @prisma:', dbUrl.includes('@prisma'));
console.log('  - Has @prisma-data.net:', dbUrl.includes('@prisma-data.net'));

if (directUrl) {
  console.log('\nDIRECT_DATABASE_URL:');
  console.log('  - Length:', directUrl.length);
  console.log('  - Has sslmode:', directUrl.includes('sslmode'));
  console.log('  - Has sslmode=require:', directUrl.includes('sslmode=require'));
}

// Extract host and port
const hostMatch = dbUrl.match(/@([^:]+):(\d+)/);
if (hostMatch) {
  console.log('\nConnection Details:');
  console.log('  - Host:', hostMatch[1]);
  console.log('  - Port:', hostMatch[2]);
}

// Check if it's an Accelerate URL
if (dbUrl.includes('@prisma-data.net')) {
  console.log('\n⚠️  This appears to be a Prisma Accelerate URL');
  console.log('   The error suggests Accelerate cannot reach your Aiven database.');
  console.log('   Possible causes:');
  console.log('   1. Aiven firewall/IP allowlist blocking Accelerate servers');
  console.log('   2. Network connectivity issue from Accelerate to Aiven');
  console.log('   3. SSL/TLS handshake failure');
} else {
  console.log('\n✅ This appears to be a direct database URL');
  console.log('   Make sure it includes: ?sslmode=require');
}

console.log('\n=== Recommendations ===');
console.log('1. Check Aiven console → Service settings → IP allowlist');
console.log('2. Ensure connection string includes: ?sslmode=require');
console.log('3. Try using DIRECT_DATABASE_URL for db push operations');
console.log('4. Consider temporarily disabling Accelerate to test direct connection');

