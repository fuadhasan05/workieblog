#!/usr/bin/env node

// Test script to verify Firebase user registration
const fetch = require('node-fetch');

async function testFirebaseRegistration() {
  console.log('🔥 Testing Firebase User Registration Flow\n');
  
  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connection...');
    const serverResponse = await fetch('http://localhost:3001/api/firebase-mongo/test-connections');
    
    if (!serverResponse.ok) {
      console.log('❌ Server not responding. Make sure to run: npm run server');
      return;
    }
    console.log('✅ Server is running on port 3001\n');

    // Test 2: Check member registration endpoint
    console.log('2. Testing member registration endpoint...');
    const memberTestData = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'testpassword123'
    };
    
    const memberResponse = await fetch('http://localhost:3001/api/members/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(memberTestData)
    });
    
    if (memberResponse.ok) {
      console.log('✅ Member registration endpoint is working');
      const memberData = await memberResponse.json();
      console.log('   User created:', memberData.member?.email || 'Unknown');
    } else {
      const error = await memberResponse.json();
      if (error.error?.includes('already')) {
        console.log('✅ Member registration endpoint is working (user already exists)');
      } else {
        console.log('❌ Member registration failed:', error.error);
      }
    }
    
    console.log('\n📋 RECOMMENDATIONS:');
    console.log('1. Make sure both servers are running:');
    console.log('   Frontend: npm run dev (port 5173)');
    console.log('   Backend:  npm run server (port 3001)');
    console.log('');
    console.log('2. Test registration in browser:');
    console.log('   Go to: http://localhost:5173/member/signup');
    console.log('   Use any email/password to test');
    console.log('');
    console.log('3. Check browser console (F12) for Firebase logs');
    console.log('   Look for: "Registering with Firebase..." messages');
    console.log('');
    console.log('4. Check server logs for MongoDB sync operations');
    
  } catch (error) {
    console.log('❌ Connection error:', error.message);
    console.log('');
    console.log('Make sure the server is running: npm run server');
  }
}

testFirebaseRegistration();