import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#][^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local');
  process.exit(1);
}

// Extract connection details from Supabase URL
const urlMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
if (!urlMatch) {
  console.error('❌ Invalid Supabase URL format');
  process.exit(1);
}

const projectRef = urlMatch[1];

// Supabase connection string format
// Note: You need to get the direct connection string from Supabase dashboard
// Project Settings -> Database -> Connection string (Direct)
const connectionString = `postgresql://postgres:[YOUR-PASSWORD]@db.${projectRef}.supabase.co:5432/postgres`;

console.log(`📊 Connecting to Supabase project: ${projectRef}`);
console.log(`⚠️  Please update the connection string in this script with your database password`);
console.log(`   You can find it in: Supabase Dashboard > Project Settings > Database > Connection String`);
console.log('');

// For now, let's use an alternative approach with the service role key
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
  process.exit(1);
}

// Use the connection pooler with service role key as password
const client = new Client({
  host: `db.${projectRef}.supabase.co`,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.argv[3] || '', // Pass password as argument
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration(migrationFile) {
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', migrationFile);

  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf-8');

  console.log(`🚀 Running migration: ${migrationFile}`);

  try {
    await client.connect();
    console.log('✅ Connected to database');

    await client.query(sql);
    console.log('✅ Migration executed successfully');

  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

const migrationFile = process.argv[2] || '002_sunset_series.sql';

if (!process.argv[3]) {
  console.log('');
  console.log('📝 Usage: node scripts/run-sql-migration.mjs <migration-file> <database-password>');
  console.log('');
  console.log('   Get your database password from:');
  console.log('   Supabase Dashboard > Project Settings > Database > Database Password');
  console.log('');
  console.log('   Example:');
  console.log(`   node scripts/run-sql-migration.mjs 002_sunset_series.sql YOUR_DB_PASSWORD`);
  console.log('');
  process.exit(1);
}

runMigration(migrationFile);
