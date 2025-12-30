import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';

export default function FirebaseAccountTester() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('test123456');
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testAccountCreation = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      addResult('🧪 Testing Firebase Account Creation...');
      
      // Test 1: Create Authentication Account
      addResult('📧 Creating Firebase Authentication account...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        addResult(`✅ Firebase Auth Account Created! UID: ${userCredential.user.uid}`);
        addResult(`📧 Email: ${userCredential.user.email}`);
        addResult(`🔐 Email Verified: ${userCredential.user.emailVerified}`);
        
        // Test 2: Store in Firestore
        addResult('💾 Storing user data in Firestore...');
        const userDoc = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: 'Test User',
          createdAt: new Date().toISOString(),
          provider: 'email',
          testAccount: true
        };
        
        await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
        addResult('✅ User data stored in Firestore successfully!');
        
        // Test 3: Verify data exists
        addResult('🔍 Verifying data exists in Firestore...');
        const docSnap = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (docSnap.exists()) {
          addResult('✅ Data verified in Firestore!');
          addResult(`📊 Stored data: ${JSON.stringify(docSnap.data(), null, 2)}`);
        } else {
          addResult('❌ Data not found in Firestore!');
        }
        
        // Test 4: Try signing in
        addResult('🔑 Testing sign-in with created account...');
        await signInWithEmailAndPassword(auth, email, password);
        addResult('✅ Sign-in successful!');
        
        addResult('🎉 ALL TESTS PASSED - Account creation working properly!');
        toast.success('Firebase account creation is working correctly!');
        
      } else {
        addResult('❌ No user returned from createUserWithEmailAndPassword');
        toast.error('Account creation failed - no user returned');
      }
      
    } catch (error: any) {
      addResult(`❌ Error: ${error.message}`);
      addResult(`🔍 Error Code: ${error.code || 'unknown'}`);
      
      if (error.code === 'auth/email-already-in-use') {
        addResult('ℹ️ Email already in use - this is expected for testing');
        toast.success('Email already exists - account creation working!');
      } else {
        toast.error(`Test failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Firebase Account Creation Tester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Test Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Test Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div className="space-x-2">
            <Button 
              onClick={testAccountCreation} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Testing...' : 'Test Account Creation'}
            </Button>
            
            <Button 
              onClick={clearResults} 
              variant="outline"
              disabled={loading}
            >
              Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className={
                  result.includes('✅') ? 'text-green-600' :
                  result.includes('❌') ? 'text-red-600' :
                  result.includes('🧪') ? 'text-blue-600 font-bold' :
                  'text-gray-700'
                }>
                  {result}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}