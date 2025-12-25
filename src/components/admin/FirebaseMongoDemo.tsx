import React, { useEffect, useState } from 'react';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import { useFirestore } from '../../hooks/useFirestore';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Database, Cloud, Sync, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

interface ConnectionStatus {
  mongodb: string;
  firebase: string;
}

interface DatabaseInfo {
  collections: Array<{
    name: string;
    count: number;
  }>;
}

export const FirebaseMongoDemo: React.FC = () => {
  const { user, signInWithGoogle, logout, loading: authLoading } = useFirebaseAuth();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [mongoInfo, setMongoInfo] = useState<DatabaseInfo | null>(null);
  const [firebaseInfo, setFirebaseInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  // Test database connections
  const testConnections = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/firebase-mongo/test-connections');
      if (response.data.success) {
        setConnectionStatus(response.data.connections);
        setMessage('Connections tested successfully!');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setMessage('Connection test failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Get database information
  const getDatabaseInfo = async () => {
    setLoading(true);
    try {
      // Get MongoDB info
      const mongoResponse = await axios.get('/api/firebase-mongo/mongodb/collections');
      if (mongoResponse.data.success) {
        setMongoInfo({ collections: mongoResponse.data.collections });
      }

      // Get Firebase info
      const firebaseResponse = await axios.get('/api/firebase-mongo/firestore/collections');
      if (firebaseResponse.data.success) {
        setFirebaseInfo({ collections: firebaseResponse.data.collections });
      }
    } catch (error) {
      console.error('Failed to get database info:', error);
      setMessage('Failed to fetch database information.');
    } finally {
      setLoading(false);
    }
  };

  // Create sample article
  const createSampleArticle = async () => {
    if (!user?.mongoUser) {
      setMessage('Please sign in first to create articles.');
      return;
    }

    setSyncLoading(true);
    try {
      const articleData = {
        title: `Sample Article ${new Date().getTime()}`,
        slug: `sample-article-${new Date().getTime()}`,
        content: 'This is a sample article created from the Firebase-MongoDB demo component.',
        excerpt: 'Sample article excerpt for testing purposes.',
        author: user.mongoUser.id,
        tags: ['demo', 'test', 'firebase', 'mongodb'],
        status: 'published',
        publishedAt: new Date().toISOString(),
      };

      const response = await axios.post('/api/firebase-mongo/articles', articleData);
      if (response.data.success) {
        setMessage('Sample article created successfully in both MongoDB and Firebase!');
        // Refresh database info
        getDatabaseInfo();
      }
    } catch (error) {
      console.error('Failed to create article:', error);
      setMessage('Failed to create sample article. Check console for details.');
    } finally {
      setSyncLoading(false);
    }
  };

  // Backup MongoDB to Firebase
  const backupToFirebase = async () => {
    setSyncLoading(true);
    try {
      const response = await axios.post('/api/firebase-mongo/backup');
      if (response.data.success) {
        setMessage('MongoDB backup to Firebase completed successfully!');
        getDatabaseInfo();
      }
    } catch (error) {
      console.error('Backup failed:', error);
      setMessage('Backup failed. Check console for details.');
    } finally {
      setSyncLoading(false);
    }
  };

  useEffect(() => {
    testConnections();
    getDatabaseInfo();
  }, []);

  const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
    return status === 'Connected' ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Firebase & MongoDB Integration Demo</h1>
        <p className="text-gray-600">
          This demo shows the integration between Firebase Authentication, Firestore, and MongoDB
        </p>
      </div>

      {/* Authentication Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Firebase Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          {authLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </div>
          ) : user ? (
            <div className="space-y-4">
              <div>
                <p><strong>Firebase User:</strong> {user.email}</p>
                <p><strong>Display Name:</strong> {user.displayName}</p>
                <p><strong>MongoDB User ID:</strong> {user.mongoUser?.id}</p>
                <p><strong>Role:</strong> {user.mongoUser?.role}</p>
              </div>
              <Button onClick={logout} variant="outline">
                Sign Out
              </Button>
            </div>
          ) : (
            <div>
              <p className="mb-4">Sign in to test Firebase authentication and MongoDB sync</p>
              <Button onClick={signInWithGoogle}>
                Sign in with Google
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <StatusIcon status={connectionStatus?.mongodb || ''} />
              <span>MongoDB: {connectionStatus?.mongodb || 'Testing...'}</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusIcon status={connectionStatus?.firebase || ''} />
              <span>Firebase: {connectionStatus?.firebase || 'Testing...'}</span>
            </div>
          </div>
          <Button 
            onClick={testConnections} 
            disabled={loading}
            variant="outline"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Connections'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Database Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MongoDB Info */}
        <Card>
          <CardHeader>
            <CardTitle>MongoDB Collections</CardTitle>
          </CardHeader>
          <CardContent>
            {mongoInfo ? (
              <div className="space-y-2">
                {mongoInfo.collections.map((collection, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{collection.name}</span>
                    <span className="text-gray-500">{collection.count} documents</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>Loading MongoDB information...</p>
            )}
          </CardContent>
        </Card>

        {/* Firebase Info */}
        <Card>
          <CardHeader>
            <CardTitle>Firebase Collections</CardTitle>
          </CardHeader>
          <CardContent>
            {firebaseInfo ? (
              <div className="space-y-2">
                {firebaseInfo.collections.map((collection: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span>{collection.id}</span>
                    <span className="text-gray-500">{collection.path}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>Loading Firebase information...</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sync className="w-5 h-5" />
            Database Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={createSampleArticle} 
              disabled={syncLoading || !user}
            >
              {syncLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Sample Article'
              )}
            </Button>
            
            <Button 
              onClick={backupToFirebase} 
              disabled={syncLoading}
              variant="outline"
            >
              {syncLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Backing up...
                </>
              ) : (
                'Backup MongoDB to Firebase'
              )}
            </Button>
            
            <Button 
              onClick={getDatabaseInfo} 
              disabled={loading}
              variant="outline"
            >
              Refresh Database Info
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Messages */}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>First, ensure both MongoDB and Firebase are properly configured (see FIREBASE_MONGODB_SETUP.md)</li>
            <li>Test the database connections using the "Test Connections" button</li>
            <li>Sign in with Google to test Firebase authentication and user synchronization</li>
            <li>Create a sample article to see data synchronization between databases</li>
            <li>Use the backup feature to sync all MongoDB data to Firebase</li>
            <li>Check the browser console for detailed logs and any error messages</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};