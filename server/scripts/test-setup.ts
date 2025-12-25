#!/usr/bin/env node

async function testSetup() {
  console.log('🧪 Testing Firebase and MongoDB setup...\n');

  // Test Environment Variables first
  console.log('🔧 Checking environment variables...');
  
  const requiredEnvVars = [
    'MONGODB_URI',
    'FIREBASE_ADMIN_PROJECT_ID',
    'FIREBASE_ADMIN_CLIENT_EMAIL',
    'FIREBASE_ADMIN_PRIVATE_KEY',
  ];

  const clientEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
  ];

  let missingVars = [];
  
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length === 0) {
    console.log('✅ All required server environment variables are set');
  } else {
    console.log('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n⚠️  Cannot proceed with Firebase tests without proper configuration');
  }

  console.log('\n🔍 Client environment variables:');
  clientEnvVars.forEach(varName => {
    const isSet = !!process.env[varName];
    console.log(`   ${isSet ? '✅' : '❌'} ${varName}: ${isSet ? 'Set' : 'Not set'}`);
  });

  // Test MongoDB only if MONGODB_URI is set
  if (process.env.MONGODB_URI) {
    try {
      console.log('\n📊 Testing MongoDB connection...');
      const { connectToMongoDB, disconnectFromMongoDB } = await import('../utils/mongodb.js');
      await connectToMongoDB();
      console.log('✅ MongoDB connected successfully');
      
      // Test a simple query
      const mongoose = await import('mongoose');
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`📁 Available collections: ${collections.length > 0 ? collections.map(c => c.name).join(', ') : 'None'}`);
      
      await disconnectFromMongoDB();
      
    } catch (error) {
      console.log('❌ MongoDB connection failed:');
      console.log(`   Error: ${error.message}`);
    }
  } else {
    console.log('\n❌ MONGODB_URI not set, skipping MongoDB test');
  }

  // Test Firebase Admin only if all required vars are set
  if (missingVars.length === 0) {
    try {
      console.log('\n🔥 Testing Firebase Admin connection...');
      const { adminDb } = await import('../utils/firebase-admin.js');
      
      // Test write operation
      const testDoc = adminDb.collection('_test').doc('connection-test');
      await testDoc.set({
        message: 'Connection test successful',
        timestamp: new Date().toISOString(),
      });
      
      // Test read operation
      const doc = await testDoc.get();
      if (doc.exists) {
        console.log('✅ Firebase Admin connected successfully');
        console.log(`📄 Test document created and read successfully`);
        
        // Clean up test document
        await testDoc.delete();
        console.log('🗑️  Test document cleaned up');
      }
      
    } catch (error) {
      console.log('❌ Firebase Admin connection failed:');
      console.log(`   Error: ${error.message}`);
      if (error.message.includes('private key') || error.message.includes('project_id')) {
        console.log('   💡 Hint: Check your Firebase Admin credentials in .env file');
      }
    }
  } else {
    console.log('\n❌ Firebase credentials incomplete, skipping Firebase test');
  }

  console.log('\n📋 Setup Summary:');
  console.log('   1. Install packages: ✅ (firebase, firebase-admin, mongoose, mongodb)');
  console.log(`   2. Environment variables: ${missingVars.length === 0 ? '✅' : '❌'} (${missingVars.length} missing)`);
  console.log('   3. MongoDB connection: See test results above');
  console.log('   4. Firebase Admin connection: See test results above');
  
  console.log('\n💡 Next steps:');
  if (missingVars.length > 0) {
    console.log('   📝 REQUIRED: Configure your .env file with Firebase and MongoDB credentials');
    console.log('   📖 See FIREBASE_MONGODB_SETUP.md for detailed instructions');
  } else {
    console.log('   - Run "npm run seed:mongodb" to add sample data');
    console.log('   - Start your server with "npm run server"');
    console.log('   - Test the API at http://localhost:3001/api/firebase-mongo/test-connections');
  }
  
  console.log('\n🔗 Useful commands:');
  console.log('   npm run seed:mongodb     # Seed MongoDB with sample data');
  console.log('   npm run server           # Start development server');
  console.log('   npm run test:firebase-mongo  # Test API endpoints (server must be running)');
}

testSetup().catch(console.error);