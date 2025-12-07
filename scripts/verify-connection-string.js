// Verify connection string format and extract details
require('dotenv').config();

const directUrl = process.env.DIRECT_DATABASE_URL;

if (!directUrl) {
  console.error('❌ DIRECT_DATABASE_URL not set in .env');
  process.exit(1);
}

console.log('=== Connection String Verification ===\n');

// Check format
console.log('1. Format Check:');
if (directUrl.startsWith('postgresql://')) {
  console.log('   ✅ Uses postgresql:// protocol');
} else if (directUrl.startsWith('postgres://')) {
  console.log('   ⚠️  Uses postgres:// (should be postgresql://)');
  console.log('   Run: node scripts/fix-connection-string.js');
} else {
  console.log('   ❌ Invalid protocol');
}

// Parse components
const urlMatch = directUrl.match(/postgresql?:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(\?.*)?/);

if (urlMatch) {
  const [, user, password, host, port, database, queryString] = urlMatch;
  
  console.log('\n2. Connection Details:');
  console.log('   User:', user);
  console.log('   Password:', password ? `${password.substring(0, 4)}...` : 'MISSING');
  console.log('   Host:', host);
  console.log('   Port:', port);
  console.log('   Database:', database);
  console.log('   Query String:', queryString || '(none)');
  
  // Check SSL
  console.log('\n3. SSL Configuration:');
  if (queryString) {
    if (queryString.includes('sslmode=require')) {
      console.log('   ✅ sslmode=require is set');
    } else if (queryString.includes('sslmode')) {
      console.log('   ⚠️  sslmode is set but not "require"');
    } else {
      console.log('   ⚠️  No sslmode specified (Aiven requires SSL)');
    }
  } else {
    console.log('   ⚠️  No query string - SSL might not be configured');
  }
  
  // Check password encoding
  console.log('\n4. Password Encoding:');
  const decodedPassword = decodeURIComponent(password);
  if (decodedPassword !== password) {
    console.log('   ℹ️  Password appears to be URL-encoded');
  } else {
    console.log('   ℹ️  Password is not URL-encoded');
    if (password.includes('@') || password.includes(':') || password.includes('/') || password.includes('?')) {
      console.log('   ⚠️  Password contains special characters - should be URL-encoded');
    }
  }
  
  // Expected format from Aiven
  console.log('\n5. Expected Aiven Format:');
  console.log('   postgresql://avnadmin:PASSWORD@HOST:PORT/defaultdb?sslmode=require');
  console.log('\n6. Your Connection String:');
  console.log('   ' + directUrl.substring(0, 80) + (directUrl.length > 80 ? '...' : ''));
  
  // Compare
  console.log('\n7. Verification:');
  const issues = [];
  
  if (host !== 'kimyawy-ahmednader4589-3654.c.aivencloud.com') {
    issues.push('Host might be incorrect');
  }
  
  if (port !== '18671') {
    issues.push(`Port is ${port}, expected 18671`);
  }
  
  if (database !== 'defaultdb') {
    issues.push(`Database is "${database}", expected "defaultdb"`);
  }
  
  if (user !== 'avnadmin') {
    issues.push(`User is "${user}", expected "avnadmin"`);
  }
  
  if (!queryString || !queryString.includes('sslmode=require')) {
    issues.push('Missing sslmode=require');
  }
  
  if (issues.length === 0) {
    console.log('   ✅ All components look correct!');
    console.log('\n💡 If connection still fails, the issue might be:');
    console.log('   1. Password is incorrect');
    console.log('   2. Password needs to be refreshed in Aiven Console');
    console.log('   3. Aiven service has authentication restrictions');
    console.log('   4. Network-level blocking (even with VPN)');
  } else {
    console.log('   ⚠️  Potential issues found:');
    issues.forEach(issue => console.log(`      - ${issue}`));
  }
  
} else {
  console.log('❌ Could not parse connection string');
  console.log('Expected format: postgresql://user:password@host:port/database?sslmode=require');
}

