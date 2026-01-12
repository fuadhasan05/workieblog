import { Request, Response } from 'express';
import { adminAuth, adminDb } from '../utils/firebase-admin.js';
import { connectToMongoDB } from '../utils/mongodb.js';
import { User, Article, Category, Member } from '../models/mongodb.js';
import { FirebaseMongoDB_SyncService } from '../services/firebase-mongodb-sync.js';

export class FirebaseMongoController {
  
  /**
   * Verify Firebase token and sync user
   */
  static async verifyFirebaseToken(req: Request, res: Response) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ error: 'Firebase token is required' });
      }

      console.log('Verifying Firebase token...');

      // Verify the Firebase ID token
      const decodedToken = await adminAuth.verifyIdToken(token);
      console.log('Token verified, getting user details...');
      
      const firebaseUser = await adminAuth.getUser(decodedToken.uid);
      console.log('Firebase user retrieved:', firebaseUser.email);
      
      // Sync user to MongoDB
      console.log('Syncing user to MongoDB...');
      const mongoUser = await FirebaseMongoDB_SyncService.syncUserFromFirebaseToMongoDB(firebaseUser);
      console.log('User synced to MongoDB:', mongoUser.email);
      
      res.json({
        success: true,
        message: 'User verified and synced successfully',
        user: {
          id: mongoUser._id,
          firebaseUid: mongoUser.firebaseUid,
          email: mongoUser.email,
          name: mongoUser.name,
          avatar: mongoUser.avatar,
          role: mongoUser.role,
        },
        firebase: {
          uid: decodedToken.uid,
          email: decodedToken.email,
        }
      });
    } catch (error) {
      console.error('Error verifying Firebase token:', error);
      
      // Provide more specific error messages
      if (error.code === 'auth/id-token-expired') {
        res.status(401).json({ error: 'Firebase token has expired. Please sign in again.' });
      } else if (error.code === 'auth/id-token-revoked') {
        res.status(401).json({ error: 'Firebase token has been revoked. Please sign in again.' });
      } else if (error.code === 'auth/invalid-id-token') {
        res.status(401).json({ error: 'Invalid Firebase token format.' });
      } else if (error.message && error.message.includes('MongoDB')) {
        res.status(500).json({ error: 'Database connection error. Please try again.' });
      } else {
        res.status(401).json({ error: 'Failed to verify Firebase token' });
      }
    }
  }

  /**
   * Create article in both MongoDB and Firebase
   */
  static async createArticle(req: Request, res: Response) {
    try {
      await connectToMongoDB();
      
      const articleData = req.body;
      
      // Create in MongoDB first
      const mongoArticle = new Article(articleData);
      await mongoArticle.save();
      
      // Sync to Firebase
      const firebaseArticle = await FirebaseMongoDB_SyncService.syncArticleFromMongoDBToFirebase(
        mongoArticle._id.toString()
      );
      
      res.status(201).json({
        success: true,
        mongodb: mongoArticle,
        firebase: firebaseArticle,
      });
    } catch (error) {
      console.error('Error creating article:', error);
      res.status(500).json({ error: 'Failed to create article' });
    }
  }

  /**
   * Get articles from both sources
   */
  static async getArticles(req: Request, res: Response) {
    try {
      const articles = await FirebaseMongoDB_SyncService.getArticlesFromBothSources();
      
      res.json({
        success: true,
        data: articles,
      });
    } catch (error) {
      console.error('Error getting articles:', error);
      res.status(500).json({ error: 'Failed to get articles' });
    }
  }

  /**
   * Sync specific article between Firebase and MongoDB
   */
  static async syncArticle(req: Request, res: Response) {
    try {
      const { articleId, direction } = req.body; // direction: 'mongo-to-firebase' or 'firebase-to-mongo'
      
      let result;
      if (direction === 'mongo-to-firebase') {
        result = await FirebaseMongoDB_SyncService.syncArticleFromMongoDBToFirebase(articleId);
      } else if (direction === 'firebase-to-mongo') {
        // Get article from Firebase first
        const firebaseDoc = await adminDb.collection('articles').doc(articleId).get();
        if (!firebaseDoc.exists) {
          return res.status(404).json({ error: 'Article not found in Firebase' });
        }
        result = await FirebaseMongoDB_SyncService.syncArticleFromFirebaseToMongoDB(
          firebaseDoc.data(),
          articleId
        );
      } else {
        return res.status(400).json({ error: 'Invalid sync direction' });
      }
      
      res.json({
        success: true,
        result,
        direction,
      });
    } catch (error) {
      console.error('Error syncing article:', error);
      res.status(500).json({ error: 'Failed to sync article' });
    }
  }

  /**
   * Backup MongoDB data to Firebase
   */
  static async backupToFirebase(req: Request, res: Response) {
    try {
      const result = await FirebaseMongoDB_SyncService.backupMongoDBToFirebase();
      res.json(result);
    } catch (error) {
      console.error('Error during backup:', error);
      res.status(500).json({ error: 'Backup failed' });
    }
  }

  /**
   * Get Firebase Firestore collections info
   */
  static async getFirestoreCollections(req: Request, res: Response) {
    try {
      const collections = await adminDb.listCollections();
      const collectionsInfo = await Promise.all(
        collections.map(async (collection) => {
          const snapshot = await collection.limit(1).get();
          return {
            id: collection.id,
            path: collection.path,
            documentCount: snapshot.size,
          };
        })
      );

      res.json({
        success: true,
        collections: collectionsInfo,
      });
    } catch (error) {
      console.error('Error getting Firestore collections:', error);
      res.status(500).json({ error: 'Failed to get collections' });
    }
  }

  /**
   * Get MongoDB collections info
   */
  static async getMongoDBCollections(req: Request, res: Response) {
    try {
      await connectToMongoDB();
      
      const userCount = await User.countDocuments();
      const articleCount = await Article.countDocuments();
      const categoryCount = await Category.countDocuments();
      
      res.json({
        success: true,
        collections: [
          { name: 'users', count: userCount },
          { name: 'articles', count: articleCount },
          { name: 'categories', count: categoryCount },
        ],
      });
    } catch (error) {
      console.error('Error getting MongoDB collections:', error);
      res.status(500).json({ error: 'Failed to get collections' });
    }
  }

  /**
   * Sync user directly from client data (for Firebase Auth signup)
   */
  static async syncUser(req: Request, res: Response) {
    try {
      const { uid, email, displayName, photoURL, emailVerified, membershipTier, provider } = req.body;
      
      if (!uid || !email) {
        return res.status(400).json({ error: 'uid and email are required' });
      }

      console.log('[SyncUser] Syncing member to MongoDB:', email);
      await connectToMongoDB();
      
      // Check if member exists by firebaseUid or email
      let member = await Member.findOne({ firebaseUid: uid });
      
      if (!member) {
        member = await Member.findOne({ email: email.toLowerCase() });
      }
      
      if (!member) {
        console.log('[SyncUser] Creating new member in MongoDB...');
        member = new Member({
          firebaseUid: uid,
          email: email.toLowerCase(),
          name: displayName || email.split('@')[0],
          avatar: photoURL || null,
          password: '', // Not used for Firebase auth
          membershipTier: membershipTier || 'FREE',
          membershipStatus: 'ACTIVE',
          emailVerified: emailVerified || false,
          isActive: true,
        });
      } else {
        console.log('[SyncUser] Updating existing member in MongoDB...');
        member.firebaseUid = uid;
        member.name = displayName || member.name;
        member.avatar = photoURL || member.avatar;
        member.emailVerified = emailVerified || member.emailVerified;
        member.lastLoginAt = new Date();
      }
      
      const savedMember = await member.save();
      console.log('[SyncUser] Member saved successfully:', savedMember.email);
      
      res.status(200).json({
        success: true,
        message: 'Member synced to MongoDB successfully',
        member: {
          id: savedMember._id,
          firebaseUid: savedMember.firebaseUid,
          email: savedMember.email,
          name: savedMember.name,
          avatar: savedMember.avatar,
          membershipTier: savedMember.membershipTier,
          membershipStatus: savedMember.membershipStatus,
          emailVerified: savedMember.emailVerified,
        }
      });
    } catch (error: any) {
      console.error('[SyncUser] Error syncing member to MongoDB:', error);
      res.status(500).json({ error: error.message || 'Failed to sync member' });
    }
  }

  /**
   * Test both connections
   */
  static async testConnections(req: Request, res: Response) {
    try {
      // Test MongoDB
      await connectToMongoDB();
      const mongoStatus = 'Connected';
      
      // Test Firebase
      const firebaseTest = await adminDb.collection('_test').doc('connection').set({
        timestamp: new Date().toISOString(),
        test: true,
      });
      const firebaseStatus = 'Connected';
      
      // Clean up test document
      await adminDb.collection('_test').doc('connection').delete();
      
      res.json({
        success: true,
        connections: {
          mongodb: mongoStatus,
          firebase: firebaseStatus,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error testing connections:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        connections: {
          mongodb: 'Failed',
          firebase: 'Failed',
        },
      });
    }
  }
}