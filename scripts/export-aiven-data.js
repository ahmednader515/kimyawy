// Export Aiven Database using Node.js (alternative to pg_dump)
// This works without PostgreSQL client tools installed

const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function exportDatabase() {
  const directUrl = process.env.DIRECT_DATABASE_URL;
  
  if (!directUrl) {
    console.error('❌ DIRECT_DATABASE_URL not set in .env');
    process.exit(1);
  }
  
  console.log('=== Export Aiven Database ===\n');
  console.log('Connecting to Aiven database...');
  
  const client = new Client({
    connectionString: directUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  
  try {
    await client.connect();
    console.log('✅ Connected successfully!\n');
    
    // Get all table names
    console.log('Fetching table list...');
    const tablesResult = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);
    
    const tables = tablesResult.rows.map(row => row.tablename);
    console.log(`Found ${tables.length} tables: ${tables.join(', ')}\n`);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const outputFile = `aiven-backup-${timestamp}.sql`;
    const stream = fs.createWriteStream(outputFile);
    
    // Write header
    stream.write(`-- Aiven Database Export\n`);
    stream.write(`-- Exported on: ${new Date().toISOString()}\n`);
    stream.write(`-- Database: ${directUrl.match(/\/([^?]+)/)?.[1] || 'unknown'}\n\n`);
    
    // Export each table
    for (const table of tables) {
      console.log(`Exporting table: ${table}...`);
      
      // Get table structure
      const structureResult = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `, [table]);
      
      // Get table data
      const dataResult = await client.query(`SELECT * FROM "${table}";`);
      
      // Write CREATE TABLE statement
      stream.write(`\n-- Table: ${table}\n`);
      stream.write(`DROP TABLE IF EXISTS "${table}" CASCADE;\n`);
      stream.write(`CREATE TABLE "${table}" (\n`);
      
      const columns = structureResult.rows.map((col, idx) => {
        let def = `  "${col.column_name}" ${col.data_type}`;
        if (col.is_nullable === 'NO') def += ' NOT NULL';
        if (col.column_default) def += ` DEFAULT ${col.column_default}`;
        return def;
      });
      
      stream.write(columns.join(',\n'));
      stream.write(`\n);\n\n`);
      
      // Write INSERT statements
      if (dataResult.rows.length > 0) {
        stream.write(`-- Data for table: ${table}\n`);
        for (const row of dataResult.rows) {
          const keys = Object.keys(row);
          const values = keys.map(key => {
            const val = row[key];
            if (val === null) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            if (val instanceof Date) return `'${val.toISOString()}'`;
            return val;
          });
          stream.write(`INSERT INTO "${table}" (${keys.map(k => `"${k}"`).join(', ')}) VALUES (${values.join(', ')});\n`);
        }
        stream.write(`\n`);
        console.log(`  ✅ Exported ${dataResult.rows.length} rows`);
      } else {
        console.log(`  ℹ️  Table is empty`);
      }
    }
    
    stream.end();
    
    console.log(`\n✅ Database exported successfully!`);
    console.log(`   File: ${outputFile}`);
    const stats = fs.statSync(outputFile);
    console.log(`   Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`\nNext step: Import to local database`);
    console.log(`  node scripts/import-to-local-db.js ${outputFile}`);
    
    await client.end();
    
  } catch (error) {
    console.error('\n❌ Export failed:');
    console.error('Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Connection refused. Make sure you can connect to Aiven.');
      console.error('   Try using a VPN or different network.');
    }
    process.exit(1);
  }
}

exportDatabase();


