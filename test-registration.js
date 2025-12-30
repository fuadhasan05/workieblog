import axios from 'axios';

async function testRegistration() {
  const baseURL = 'http://localhost:3001';
  
  console.log('🧪 Testing Registration and Firebase Integration');
  console.log('=' .repeat(50));
  
  // Test 1: Check if server is running
  console.log('\n1. 🔍 Checking server status...');
  try {
    const response = await axios.get(`${baseURL}/api/firebase-mongo/test-connections`);
    console.log('✅ Server is running');
    console.log('📊 Connection status:', response.data);
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    return;
  }
  
  // Test 2: Test traditional member registration
  console.log('\n2. 👤 Testing traditional member registration...');
  try {
    const memberData = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testpassword123'
    };
    
    const response = await axios.post(`${baseURL}/api/members/register`, memberData);
    console.log('✅ Traditional registration successful');
    console.log('📄 Response:', response.data);
  } catch (error) {
    console.log('❌ Traditional registration failed:', error.response?.data || error.message);
  }
  
  // Test 3: Check MongoDB connection
  console.log('\n3. 🗃️ Checking MongoDB integration...');
  try {
    const response = await axios.get(`${baseURL}/api/firebase-mongo/get-mongo-info`);
    console.log('✅ MongoDB connected');
    console.log('📊 Collections:', response.data.collections || 'No data');
  } catch (error) {
    console.log('❌ MongoDB connection issue:', error.response?.data || error.message);
  }
  
  // Test 4: Firebase Admin verification (requires manual token)
  console.log('\n4. 🔥 Firebase token verification test (requires manual token)');
  console.log('💡 To test Firebase registration:');
  console.log('   1. Open the signup page in browser');
  console.log('   2. Register with Firebase option checked');
  console.log('   3. Check console for detailed logs');
  
  console.log('\n🏁 Test completed!');
  console.log('📝 Next steps:');
  console.log('   - Open http://localhost:5173 in browser');
  console.log('   - Go to member signup page');
  console.log('   - Try registering with both options');
}

// Run the test
testRegistration().catch(console.error);