#!/usr/bin/env node

/**
 * Simple Firebase connection test
 */

async function testFirebaseOnly() {
  console.log('🔥 Testing Firebase Admin SDK connection...\n');
  
  try {
    // Import Firebase Admin
    const { adminDb } = await import('../utils/firebase-admin.js');
    
    console.log('✅ Firebase Admin SDK imported successfully');
    
    // Test a simple write operation
    const testDoc = adminDb.collection('_connection_test').doc('test');
    await testDoc.set({
      message: 'Firebase connection test',
      timestamp: new Date().toISOString(),
      success: true
    });
    
    console.log('✅ Firebase write operation successful');
    
    // Test read operation
    const doc = await testDoc.get();
    if (doc.exists) {
      const data = doc.data();
      console.log('✅ Firebase read operation successful');
      console.log('📄 Retrieved data:', JSON.stringify(data, null, 2));
    }
    
    // Clean up test document
    await testDoc.delete();
    console.log('✅ Test document cleaned up');
    
    console.log('\n🎉 Firebase Admin SDK is working correctly!');
    console.log('🔥 Project ID: cometolearn-34c6d');
    console.log('✨ All Firebase operations are functional');
    
  } catch (error) {
    console.log('❌ Firebase connection failed:');
    console.log('Error:', error.message);
    
    if (error.message.includes('private key')) {
      console.log('\n💡 Check your Firebase Admin private key in .env');
    } else if (error.message.includes('project_id')) {
      console.log('\n💡 Check your Firebase project ID');
    } else if (error.message.includes('permission')) {
      console.log('\n💡 Check Firebase project permissions');
    }
  }
}

testFirebaseOnly().catch(console.error);