import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Source database (OLD)
const SOURCE_URI = 'mongodb+srv://workie:zieGzWjs64ad8LPf@cluster0.gqatlzi.mongodb.net/workieblog?retryWrites=true&w=majority';

// Target database (NEW - from .env)
const TARGET_URI = process.env.MONGODB_URI || '';

async function testConnection(uri: string, name: string) {
  console.log(`\n🔍 Testing ${name} connection...`);
  console.log(`   URI: ${uri.replace(/:[^:@]+@/, ':****@')}`);
  
  try {
    const connection = await mongoose.createConnection(uri).asPromise();
    console.log(`   ✅ Connected successfully!`);
    
    // List collections
    const collections = await connection.db.listCollections().toArray();
    console.log(`   📦 Found ${collections.length} collections:`);
    
    // Count documents in each collection
    for (const coll of collections) {
      if (!coll.name.startsWith('system.')) {
        const count = await connection.db.collection(coll.name).countDocuments();
        console.log(`      - ${coll.name}: ${count} documents`);
      }
    }
    
    await connection.close();
    console.log(`   🔌 Connection closed`);
    return true;
  } catch (error: any) {
    console.error(`   ❌ Connection failed!`);
    console.error(`   Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 MongoDB Connection Test');
  console.log('='.repeat(60));
  
  if (!TARGET_URI) {
    console.error('\n❌ MONGODB_URI not found in .env file');
    process.exit(1);
  }
  
  // Test source database
  const sourceOk = await testConnection(SOURCE_URI, 'SOURCE (Old Database)');
  
  // Test target database
  const targetOk = await testConnection(TARGET_URI, 'TARGET (New Database)');
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results:');
  console.log('='.repeat(60));
  console.log(`Source Database: ${sourceOk ? '✅ OK' : '❌ FAILED'}`);
  console.log(`Target Database: ${targetOk ? '✅ OK' : '❌ FAILED'}`);
  console.log('='.repeat(60));
  
  if (sourceOk && targetOk) {
    console.log('\n✨ Both databases are accessible! You can run the migration.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Fix connection issues before running migration.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
