// Fix connection string format - change postgres:// to postgresql://
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const envPath = path.join(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found');
  process.exit(1);
}

let envContent = fs.readFileSync(envPath, 'utf8');
let modified = false;

// Check and fix DATABASE_URL
if (envContent.includes('DATABASE_URL=')) {
  const urlMatch = envContent.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);
  if (urlMatch && urlMatch[1].startsWith('postgres://')) {
    const newUrl = urlMatch[1].replace(/^postgres:\/\//, 'postgresql://');
    envContent = envContent.replace(
      /DATABASE_URL=["']?[^"'\n]+["']?/,
      `DATABASE_URL="${newUrl}"`
    );
    console.log('✅ Fixed DATABASE_URL: Changed postgres:// to postgresql://');
    modified = true;
  }
}

// Check and fix DIRECT_DATABASE_URL
if (envContent.includes('DIRECT_DATABASE_URL=')) {
  const urlMatch = envContent.match(/DIRECT_DATABASE_URL=["']?([^"'\n]+)["']?/);
  if (urlMatch && urlMatch[1].startsWith('postgres://')) {
    const newUrl = urlMatch[1].replace(/^postgres:\/\//, 'postgresql://');
    envContent = envContent.replace(
      /DIRECT_DATABASE_URL=["']?[^"'\n]+["']?/,
      `DIRECT_DATABASE_URL="${newUrl}"`
    );
    console.log('✅ Fixed DIRECT_DATABASE_URL: Changed postgres:// to postgresql://');
    modified = true;
  }
}

if (modified) {
  // Backup original
  const backupPath = envPath + '.backup';
  fs.writeFileSync(backupPath, fs.readFileSync(envPath));
  console.log(`\n📦 Backup created: ${backupPath}`);
  
  // Write updated content
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file updated');
  console.log('\n⚠️  Please verify the connection strings are correct before proceeding');
} else {
  console.log('ℹ️  No changes needed - connection strings already use postgresql:// or are in correct format');
}

