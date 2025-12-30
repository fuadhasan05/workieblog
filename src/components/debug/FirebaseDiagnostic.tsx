import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

export default function FirebaseDiagnostic() {
  const [status, setStatus] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const addStatus = (message: string) => {
    setStatus(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const runDiagnostic = async () => {
    setStatus([]);
    
    try {
      addStatus('🔍 Starting Firebase Diagnostic...');
      
      // Check Firebase Config
      addStatus(`🔧 Firebase Config Check:`);
      addStatus(`   API Key: ${import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}`);
      addStatus(`   Auth Domain: ${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing'}`);
      addStatus(`   Project ID: ${import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}`);
      
      // Check Firebase Services
      addStatus(`🔥 Firebase Services Check:`);
      addStatus(`   Auth Instance: ${auth ? '✅ Connected' : '❌ Failed'}`);
      addStatus(`   Firestore Instance: ${db ? '✅ Connected' : '❌ Failed'}`);
      addStatus(`   Current User: ${currentUser ? `✅ ${currentUser.email}` : '❌ Not authenticated'}`);
      
      // Test Firestore Connection
      addStatus(`📊 Testing Firestore Connection...`);
      const testDoc = doc(db, 'test', 'diagnostic');
      await setDoc(testDoc, { test: true, timestamp: new Date() });
      addStatus(`   ✅ Write test successful`);
      
      const docSnap = await getDoc(testDoc);
      if (docSnap.exists()) {
        addStatus(`   ✅ Read test successful`);
      } else {
        addStatus(`   ❌ Read test failed`);
      }
      
      await deleteDoc(testDoc);
      addStatus(`   ✅ Delete test successful`);
      
      // Check Auth Configuration
      addStatus(`🔐 Firebase Auth Check:`);
      addStatus(`   Auth Domain: ${auth.app.options.authDomain}`);
      addStatus(`   Project ID: ${auth.app.options.projectId}`);
      
      // Test if we can access Firebase console
      addStatus(`🌐 Firebase Console URLs:`);
      addStatus(`   Authentication: https://console.firebase.google.com/project/${auth.app.options.projectId}/authentication/users`);
      addStatus(`   Firestore: https://console.firebase.google.com/project/${auth.app.options.projectId}/firestore/data`);
      
      addStatus(`✅ Diagnostic Complete!`);
      
    } catch (error: any) {
      addStatus(`❌ Diagnostic Error: ${error.message}`);
      console.error('Firebase diagnostic error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Firebase Configuration Diagnostic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={runDiagnostic}>
              Run Firebase Diagnostic
            </Button>
            <Button onClick={() => setStatus([])} variant="outline">
              Clear
            </Button>
          </div>

          {currentUser && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">✅ Current User (Authenticated):</h3>
              <p className="text-green-700">UID: {currentUser.uid}</p>
              <p className="text-green-700">Email: {currentUser.email}</p>
              <p className="text-green-700">Display Name: {currentUser.displayName}</p>
              <p className="text-green-700">Email Verified: {currentUser.emailVerified ? 'Yes' : 'No'}</p>
            </div>
          )}

          {status.length > 0 && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="font-mono text-sm max-h-96 overflow-y-auto space-y-1">
                {status.map((line, index) => (
                  <div key={index} className={
                    line.includes('✅') ? 'text-green-600' :
                    line.includes('❌') ? 'text-red-600' :
                    line.includes('🔍') || line.includes('🔧') ? 'text-blue-600 font-bold' :
                    'text-gray-700'
                  }>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}