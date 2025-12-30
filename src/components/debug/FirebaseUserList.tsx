import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function FirebaseUserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      console.log('Loading users from Firestore...');
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setUsers(usersList);
      console.log('Loaded users:', usersList);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentUser = async () => {
    if (currentUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          console.log('Current user data in Firestore:', userDoc.data());
        } else {
          console.log('Current user not found in Firestore');
        }
      } catch (error) {
        console.error('Error checking current user:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔥 Firebase User Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={loadUsers} disabled={loading}>
              {loading ? 'Loading...' : 'Load Users from Firestore'}
            </Button>
            <Button onClick={checkCurrentUser} variant="outline">
              Check Current User
            </Button>
          </div>

          {currentUser && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">Current Firebase Auth User:</h3>
              <p className="text-green-700">Email: {currentUser.email}</p>
              <p className="text-green-700">UID: {currentUser.uid}</p>
              <p className="text-green-700">Display Name: {currentUser.displayName}</p>
            </div>
          )}

          {users.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-3">Users in Firestore ({users.length}):</h3>
              <div className="space-y-2">
                {users.map((user, index) => (
                  <div key={user.id} className="bg-white p-3 rounded border">
                    <p><strong>#{index + 1}</strong></p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Name:</strong> {user.displayName}</p>
                    <p><strong>UID:</strong> {user.uid}</p>
                    <p><strong>Created:</strong> {user.createdAt}</p>
                    <p><strong>Tier:</strong> {user.membershipTier}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {users.length === 0 && !loading && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800">No users found in Firestore. Try registering a new user!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}