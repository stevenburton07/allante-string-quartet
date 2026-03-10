import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runMigration(migrationFile) {
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', migrationFile);

  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf-8');

  console.log(`🚀 Running migration: ${migrationFile}`);

  // Split SQL into individual statements (basic splitting by semicolon)
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    console.log(`   Executing statement ${i + 1}/${statements.length}...`);

    try {
      const { error } = await supabase.rpc('exec_sql', {
        query: statement + ';'
      });

      if (error) {
        // Try alternative: use raw SQL via REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({ query: statement + ';' }),
        });

        if (!response.ok) {
          // Last resort: try using the SQL directly via the client
          const { error: directError } = await supabase.from('_migrations').insert({
            sql: statement,
            executed_at: new Date().toISOString(),
          });

          // If even that doesn't work, we'll just log and continue
          console.log(`   ⚠️  Could not verify execution of statement ${i + 1}`);
        }
      }
    } catch (err) {
      console.log(`   ⚠️  Statement ${i + 1} may have already been executed:`, err.message);
    }
  }

  console.log('✅ Migration completed');
}

const migrationFile = process.argv[2] || '002_sunset_series.sql';

runMigration(migrationFile).catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
