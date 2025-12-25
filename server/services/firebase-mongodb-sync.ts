import { adminDb } from '../utils/firebase-admin.js';
import { connectToMongoDB } from '../utils/mongodb.js';
import { User, Article, Category } from '../models/mongodb.js';

export class FirebaseMongoDB_SyncService {
  
  /**
   * Sync user data from Firebase to MongoDB
   */
  static async syncUserFromFirebaseToMongoDB(firebaseUser: any) {
    try {
      await connectToMongoDB();
      
      let user = await User.findOne({ firebaseUid: firebaseUser.uid });
      
      if (!user) {
        user = new User({
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          avatar: firebaseUser.photoURL,
          role: 'user',
          isActive: true,
        });
      } else {
        // Update existing user
        user.email = firebaseUser.email;
        user.name = firebaseUser.displayName || user.name;
        user.avatar = firebaseUser.photoURL || user.avatar;
      }
      
      await user.save();
      return user;
    } catch (error) {
      console.error('Error syncing user from Firebase to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Sync article from MongoDB to Firebase Firestore
   */
  static async syncArticleFromMongoDBToFirebase(articleId: string) {
    try {
      await connectToMongoDB();
      
      const article = await Article.findById(articleId)
        .populate('author', 'name email avatar')
        .populate('categories', 'name slug color');
        
      if (!article) {
        throw new Error('Article not found');
      }

      // Prepare Firebase document
      const firebaseArticle = {
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        author: {
          id: article.author._id.toString(),
          name: (article.author as any).name,
          email: (article.author as any).email,
          avatar: (article.author as any).avatar,
        },
        categories: (article.categories as any[]).map(cat => ({
          id: cat._id.toString(),
          name: cat.name,
          slug: cat.slug,
          color: cat.color,
        })),
        tags: article.tags,
        featuredImage: article.featuredImage,
        status: article.status,
        publishedAt: article.publishedAt?.toISOString(),
        views: article.views,
        likes: article.likes,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
        mongoId: article._id.toString(),
      };

      // Save to Firebase
      const docRef = adminDb.collection('articles').doc(article.slug);
      await docRef.set(firebaseArticle);

      // Mark as synced in MongoDB
      article.isFirebaseSync = true;
      await article.save();

      return firebaseArticle;
    } catch (error) {
      console.error('Error syncing article from MongoDB to Firebase:', error);
      throw error;
    }
  }

  /**
   * Sync article from Firebase to MongoDB
   */
  static async syncArticleFromFirebaseToMongoDB(firebaseArticleData: any, slug: string) {
    try {
      await connectToMongoDB();
      
      let article = await Article.findOne({ slug });
      
      if (!article) {
        // Create new article
        article = new Article({
          title: firebaseArticleData.title,
          slug: firebaseArticleData.slug,
          content: firebaseArticleData.content,
          excerpt: firebaseArticleData.excerpt,
          author: firebaseArticleData.author.id,
          tags: firebaseArticleData.tags || [],
          featuredImage: firebaseArticleData.featuredImage,
          status: firebaseArticleData.status || 'draft',
          publishedAt: firebaseArticleData.publishedAt ? new Date(firebaseArticleData.publishedAt) : null,
          views: firebaseArticleData.views || 0,
          likes: firebaseArticleData.likes || 0,
          isFirebaseSync: true,
        });
      } else {
        // Update existing article
        article.title = firebaseArticleData.title;
        article.content = firebaseArticleData.content;
        article.excerpt = firebaseArticleData.excerpt;
        article.tags = firebaseArticleData.tags || [];
        article.featuredImage = firebaseArticleData.featuredImage;
        article.status = firebaseArticleData.status || article.status;
        article.publishedAt = firebaseArticleData.publishedAt ? new Date(firebaseArticleData.publishedAt) : article.publishedAt;
        article.views = firebaseArticleData.views || article.views;
        article.likes = firebaseArticleData.likes || article.likes;
        article.isFirebaseSync = true;
      }
      
      await article.save();
      return article;
    } catch (error) {
      console.error('Error syncing article from Firebase to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Get articles from both Firebase and MongoDB
   */
  static async getArticlesFromBothSources() {
    try {
      await connectToMongoDB();
      
      // Get from MongoDB
      const mongoArticles = await Article.find({ status: 'published' })
        .populate('author', 'name email avatar')
        .populate('categories', 'name slug color')
        .sort({ publishedAt: -1 });

      // Get from Firebase
      const firebaseSnapshot = await adminDb.collection('articles')
        .where('status', '==', 'published')
        .orderBy('publishedAt', 'desc')
        .get();

      const firebaseArticles = firebaseSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        source: 'firebase',
      }));

      return {
        mongodb: mongoArticles.map(article => ({
          ...article.toObject(),
          source: 'mongodb',
        })),
        firebase: firebaseArticles,
      };
    } catch (error) {
      console.error('Error getting articles from both sources:', error);
      throw error;
    }
  }

  /**
   * Backup MongoDB data to Firebase
   */
  static async backupMongoDBToFirebase() {
    try {
      await connectToMongoDB();
      
      // Backup users
      const users = await User.find();
      for (const user of users) {
        await adminDb.collection('users_backup').doc(user._id.toString()).set({
          ...user.toObject(),
          _id: user._id.toString(),
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        });
      }

      // Backup articles
      const articles = await Article.find().populate('author categories');
      for (const article of articles) {
        await adminDb.collection('articles_backup').doc(article._id.toString()).set({
          ...article.toObject(),
          _id: article._id.toString(),
          createdAt: article.createdAt.toISOString(),
          updatedAt: article.updatedAt.toISOString(),
          publishedAt: article.publishedAt?.toISOString(),
        });
      }

      // Backup categories
      const categories = await Category.find();
      for (const category of categories) {
        await adminDb.collection('categories_backup').doc(category._id.toString()).set({
          ...category.toObject(),
          _id: category._id.toString(),
          createdAt: category.createdAt.toISOString(),
          updatedAt: category.updatedAt.toISOString(),
        });
      }

      console.log('Backup completed successfully');
      return { success: true, message: 'Backup completed' };
    } catch (error) {
      console.error('Error during backup:', error);
      throw error;
    }
  }
}