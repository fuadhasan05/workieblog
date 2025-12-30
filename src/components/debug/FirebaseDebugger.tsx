import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function FirebaseDebugger() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('test123456');
  const [name, setName] = useState('Test User');
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (message: string) => {
    setDebugInfo(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testFirebaseRegistration = async () => {
    setIsLoading(true);
    setDebugInfo([]);
    
    try {
      addDebugInfo('🚀 Starting Firebase registration test...');
      
      // Step 1: Create user in Firebase Auth
      addDebugInfo('📝 Creating user in Firebase Authentication...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      addDebugInfo(`✅ Firebase Auth user created with UID: ${userCredential.user.uid}`);
      
      // Step 2: Update profile
      addDebugInfo('👤 Updating user profile...');
      await updateProfile(userCredential.user, {
        displayName: name
      });
      addDebugInfo('✅ User profile updated');
      
      // Step 3: Store user in Firestore
      addDebugInfo('💾 Storing user in Firestore...');
      const userDoc = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: name,
        photoURL: userCredential.user.photoURL,
        emailVerified: userCredential.user.emailVerified,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
      addDebugInfo('✅ User stored in Firestore');
      
      // Step 4: Get Firebase token and sync with backend
      addDebugInfo('🔑 Getting Firebase ID token...');
      const idToken = await userCredential.user.getIdToken();
      addDebugInfo('✅ Firebase ID token obtained');
      
      addDebugInfo('🔄 Syncing with backend...');
      const response = await fetch('http://localhost:3001/api/firebase-mongo/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: idToken })
      });
      
      if (response.ok) {
        const data = await response.json();
        addDebugInfo('✅ Backend sync successful');
        addDebugInfo(`📊 MongoDB User ID: ${data.user?.id}`);
        toast.success('Firebase registration test completed successfully!');
      } else {
        const errorData = await response.json();
        addDebugInfo(`❌ Backend sync failed: ${errorData.error}`);
        toast.error('Backend sync failed');
      }
      
    } catch (error: any) {
      addDebugInfo(`❌ Error: ${error.message}`);
      console.error('Firebase registration test error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use. Try a different email.');
      } else {
        toast.error(`Registration failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearDebugInfo = () => {
    setDebugInfo([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔥 Firebase Registration Debugger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-x-2">
            <Button 
              onClick={testFirebaseRegistration} 
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? 'Testing...' : 'Test Firebase Registration'}
            </Button>
            
            <Button 
              onClick={clearDebugInfo} 
              variant="outline"
              disabled={isLoading}
            >
              Clear Debug Info
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {debugInfo.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {debugInfo.map((info, index) => (
                <div key={index} className="mb-1">
                  {info}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}