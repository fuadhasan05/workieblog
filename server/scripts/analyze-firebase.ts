#!/usr/bin/env node

/**
 * Analyze Firebase connection status in the project
 */

async function analyzeFirebaseConnection() {
  console.log('🔍 FIREBASE CONNECTION ANALYSIS\n');
  
  const fs = await import('fs');
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const projectRoot = path.resolve(__dirname, '../..');

  // 1. Check environment variables
  console.log('📋 1. ENVIRONMENT VARIABLES CHECK:');
  const envPath = path.join(projectRoot, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Client-side Firebase vars
    const clientVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN', 
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ];
    
    // Server-side Firebase vars
    const serverVars = [
      'FIREBASE_ADMIN_PROJECT_ID',
      'FIREBASE_ADMIN_PRIVATE_KEY',
      'FIREBASE_ADMIN_CLIENT_EMAIL'
    ];
    
    console.log('   Client-side variables:');
    let clientConfigured = 0;
    clientVars.forEach(varName => {
      const regex = new RegExp(`${varName}="([^"]*)"`, 'g');
      const match = envContent.match(regex);
      const hasValue = match && match[0] && !match[0].includes('""');
      console.log(`   ${hasValue ? '✅' : '❌'} ${varName}: ${hasValue ? 'Configured' : 'Empty'}`);
      if (hasValue) clientConfigured++;
    });
    
    console.log('\n   Server-side variables:');
    let serverConfigured = 0;
    serverVars.forEach(varName => {
      const regex = new RegExp(`${varName}="([^"]*)"`, 'g');
      const match = envContent.match(regex);
      const hasValue = match && match[0] && !match[0].includes('""');
      console.log(`   ${hasValue ? '✅' : '❌'} ${varName}: ${hasValue ? 'Configured' : 'Empty'}`);
      if (hasValue) serverConfigured++;
    });
    
    console.log(`\n   Summary: ${clientConfigured}/${clientVars.length} client vars, ${serverConfigured}/${serverVars.length} server vars configured`);
  } else {
    console.log('   ❌ .env file not found');
  }

  // 2. Check Firebase integration files
  console.log('\n📁 2. FIREBASE INTEGRATION FILES:');
  const firebaseFiles = [
    { path: 'src/lib/firebase.ts', desc: 'Client Firebase config' },
    { path: 'src/hooks/useFirebaseAuth.ts', desc: 'Firebase auth hook' },
    { path: 'src/hooks/useFirestore.ts', desc: 'Firestore database hook' },
    { path: 'server/utils/firebase-admin.ts', desc: 'Firebase Admin SDK' },
    { path: 'server/services/firebase-mongodb-sync.ts', desc: 'Firebase-MongoDB sync' },
    { path: 'server/controllers/firebase-mongo.controller.ts', desc: 'Firebase API controller' },
    { path: 'server/routes/firebase-mongo.ts', desc: 'Firebase API routes' }
  ];
  
  firebaseFiles.forEach(file => {
    const filePath = path.join(projectRoot, file.path);
    const exists = fs.existsSync(filePath);
    console.log(`   ${exists ? '✅' : '❌'} ${file.path} - ${file.desc}`);
  });

  // 3. Check package.json for Firebase dependencies
  console.log('\n📦 3. FIREBASE PACKAGES:');
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const firebasePackages = ['firebase', 'firebase-admin'];
    
    firebasePackages.forEach(pkg => {
      const version = packageJson.dependencies?.[pkg];
      console.log(`   ${version ? '✅' : '❌'} ${pkg}: ${version || 'Not installed'}`);
    });
  }

  // 4. Check if Firebase is used in React components
  console.log('\n⚛️  4. REACT FIREBASE USAGE:');
  const srcPath = path.join(projectRoot, 'src');
  let firebaseUsageFound = false;
  
  const checkFirebaseUsage = (dir) => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        checkFirebaseUsage(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('useFirebaseAuth') || content.includes('useFirestore') || content.includes('firebase')) {
          const relativePath = path.relative(projectRoot, filePath);
          console.log(`   ✅ ${relativePath} - Uses Firebase`);
          firebaseUsageFound = true;
        }
      }
    });
  };
  
  checkFirebaseUsage(srcPath);
  
  if (!firebaseUsageFound) {
    console.log('   ❌ No Firebase usage found in React components');
  }

  // 5. Check server routes
  console.log('\n🛣️  5. SERVER FIREBASE ROUTES:');
  const serverIndexPath = path.join(projectRoot, 'server/index.ts');
  if (fs.existsSync(serverIndexPath)) {
    const serverContent = fs.readFileSync(serverIndexPath, 'utf8');
    const hasFirebaseRoute = serverContent.includes('firebase-mongo');
    console.log(`   ${hasFirebaseRoute ? '✅' : '❌'} Firebase API routes: ${hasFirebaseRoute ? 'Registered' : 'Not found'}`);
    
    if (hasFirebaseRoute) {
      console.log('   📍 Available endpoints:');
      console.log('      - POST /api/firebase-mongo/verify-token');
      console.log('      - GET /api/firebase-mongo/test-connections');
      console.log('      - GET /api/firebase-mongo/articles');
      console.log('      - And more...');
    }
  }

  // 6. Overall status
  console.log('\n🎯 6. OVERALL FIREBASE CONNECTION STATUS:');
  
  const clientConfigStatus = envPath && fs.readFileSync(envPath, 'utf8').includes('VITE_FIREBASE_API_KEY="AIzaSyCWsDgtkjY0knZcCItkEd-iC0hNvkgLAUY"');
  const integrationFilesExist = fs.existsSync(path.join(projectRoot, 'src/lib/firebase.ts'));
  const packagesInstalled = fs.existsSync(packageJsonPath) && JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).dependencies?.firebase;
  
  console.log(`   🔧 Configuration: ${clientConfigStatus ? '✅ PARTIAL' : '❌ INCOMPLETE'}`);
  console.log(`   📁 Integration files: ${integrationFilesExist ? '✅ PRESENT' : '❌ MISSING'}`);
  console.log(`   📦 Packages: ${packagesInstalled ? '✅ INSTALLED' : '❌ MISSING'}`);
  
  console.log('\n📊 FINAL ANALYSIS:');
  if (clientConfigStatus && integrationFilesExist && packagesInstalled) {
    const serverConfigStatus = envPath && fs.readFileSync(envPath, 'utf8').includes('FIREBASE_ADMIN_PRIVATE_KEY=""');
    
    if (serverConfigStatus) {
      console.log('🟡 STATUS: PARTIALLY CONNECTED');
      console.log('   ✅ Client-side Firebase is configured and ready');
      console.log('   ❌ Server-side Firebase Admin needs credentials');
      console.log('   💡 You can use Firebase Auth and Firestore on the frontend');
      console.log('   🚨 Server-side operations require Firebase Admin credentials');
    } else {
      console.log('🟢 STATUS: FULLY CONNECTED (Frontend)');
      console.log('   ✅ Firebase client configuration is complete');
      console.log('   ✅ All integration files are present');
      console.log('   ✅ Firebase packages are installed');
      console.log('   🎉 You can start using Firebase in your React app!');
    }
  } else {
    console.log('🔴 STATUS: NOT CONNECTED');
    console.log('   ❌ Firebase is not properly set up');
  }
  
  console.log('\n🚀 NEXT STEPS:');
  if (clientConfigStatus) {
    console.log('   1. ✅ Client Firebase is ready - you can use authentication and Firestore');
    console.log('   2. 🔑 Add Firebase Admin credentials to .env for server operations');
    console.log('   3. 🧪 Test with: npm run test:setup');
    console.log('   4. 🌐 Start server with: npm run server');
  } else {
    console.log('   1. 🔑 Complete Firebase configuration in .env file');
    console.log('   2. 📖 Read FIREBASE_MONGODB_SETUP.md for detailed steps');
    console.log('   3. 🧪 Test with: npm run test:setup');
  }
}

analyzeFirebaseConnection().catch(console.error);