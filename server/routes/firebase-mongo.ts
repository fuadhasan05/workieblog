import express from 'express';
import { FirebaseMongoController } from '../controllers/firebase-mongo.controller.js';

const router = express.Router();

// Authentication routes
router.post('/verify-token', FirebaseMongoController.verifyFirebaseToken);
router.post('/sync-user', FirebaseMongoController.syncUser);

// Article management routes
router.post('/articles', FirebaseMongoController.createArticle);
router.get('/articles', FirebaseMongoController.getArticles);
router.post('/articles/sync', FirebaseMongoController.syncArticle);

// Backup and sync routes
router.post('/backup', FirebaseMongoController.backupToFirebase);

// Database info routes
router.get('/firestore/collections', FirebaseMongoController.getFirestoreCollections);
router.get('/mongodb/collections', FirebaseMongoController.getMongoDBCollections);

// Connection testing
router.get('/test-connections', FirebaseMongoController.testConnections);

export default router;