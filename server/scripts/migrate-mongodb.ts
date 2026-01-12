import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Source database connection (OLD - has your data)
const SOURCE_URI = 'mongodb+srv://workie:zieGzWjs64ad8LPf@cluster0.gqatlzi.mongodb.net/workieblog?retryWrites=true&w=majority';

// Target database connection (NEW - empty, will receive data)
const TARGET_URI = 'mongodb+srv://all-data:i0lrxx6DoXjQvE46@cluster0.gqatlzi.mongodb.net/workieblog?retryWrites=true&w=majority';

if (!TARGET_URI) {
  console.error('❌ MONGODB_URI not found in .env file');
  process.exit(1);
}

// Collection names to migrate
const COLLECTIONS = [
  'users',
  'posts',
  'categories',
  'tags',
  'authors',
  'members',
  'subscribers',
  'subscriptions',
  'payments',
  'savedposts',
  'analytics',
  'jobs',
  'resources',
  'media',
];

async function migrateData() {
  let sourceConnection: typeof mongoose | null = null;
  let targetConnection: typeof mongoose | null = null;

  try {
    console.log('🔄 Starting MongoDB migration...\n');

    // Connect to source database
    console.log('📡 Connecting to SOURCE database...');
    sourceConnection = await mongoose.createConnection(SOURCE_URI).asPromise();
    console.log('✅ Connected to source database\n');

    // Connect to target database
    console.log('📡 Connecting to TARGET database...');
    targetConnection = await mongoose.createConnection(TARGET_URI).asPromise();
    console.log('✅ Connected to target database\n');

    // Get all collections from source
    const sourceCollections = await sourceConnection.db.listCollections().toArray();
    console.log(`📦 Found ${sourceCollections.length} collections in source database\n`);

    let totalDocuments = 0;
    let migratedCollections = 0;

    // Migrate each collection
    for (const collectionInfo of sourceCollections) {
      const collectionName = collectionInfo.name;
      
      // Skip system collections
      if (collectionName.startsWith('system.')) {
        continue;
      }

      try {
        console.log(`\n📂 Migrating collection: ${collectionName}`);
        
        // Get source collection
        const sourceCollection = sourceConnection.db.collection(collectionName);
        const documents = await sourceCollection.find({}).toArray();
        
        if (documents.length === 0) {
          console.log(`   ⚠️  Collection is empty, skipping...`);
          continue;
        }

        console.log(`   📊 Found ${documents.length} documents`);

        // Get target collection
        const targetCollection = targetConnection.db.collection(collectionName);

        // Check if target collection has data
        const existingCount = await targetCollection.countDocuments();
        if (existingCount > 0) {
          console.log(`   ⚠️  Target collection already has ${existingCount} documents`);
          console.log(`   🗑️  Clearing existing data...`);
          await targetCollection.deleteMany({});
        }

        // Insert documents
        console.log(`   ⬆️  Inserting documents...`);
        await targetCollection.insertMany(documents);
        
        totalDocuments += documents.length;
        migratedCollections++;
        
        console.log(`   ✅ Successfully migrated ${documents.length} documents`);

      } catch (error: any) {
        console.error(`   ❌ Error migrating ${collectionName}:`, error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Migration completed successfully!');
    console.log('='.repeat(60));
    console.log(`📊 Collections migrated: ${migratedCollections}`);
    console.log(`📄 Total documents migrated: ${totalDocuments}`);
    console.log('='.repeat(60) + '\n');

  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    // Close connections
    if (sourceConnection) {
      await sourceConnection.close();
      console.log('🔌 Disconnected from source database');
    }
    if (targetConnection) {
      await targetConnection.close();
      console.log('🔌 Disconnected from target database');
    }
  }
}

// Run migration
console.log('🚀 MongoDB Data Migration Tool');
console.log('================================\n');
console.log('Source:', SOURCE_URI.replace(/:[^:@]+@/, ':****@'));
console.log('Target:', TARGET_URI.replace(/:[^:@]+@/, ':****@'));
console.log('\n⚠️  WARNING: This will OVERWRITE existing data in the target database!');
console.log('Press Ctrl+C within 5 seconds to cancel...\n');

setTimeout(() => {
  migrateData()
    .then(() => {
      console.log('✅ Migration process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration process failed:', error);
      process.exit(1);
    });
}, 5000);
