import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useFirestore = (collectionName: string) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all documents from a collection
  const getDocuments = async (constraints: QueryConstraint[] = []) => {
    try {
      setLoading(true);
      setError(null);
      
      const collectionRef = collection(db, collectionName);
      const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
      
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setDocuments(docs);
      return docs;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get a single document
  const getDocument = async (documentId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      } else {
        throw new Error('Document not found');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add a document
  const addDocument = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      return docRef.id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a document
  const updateDocument = async (documentId: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      
      return documentId;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a document
  const deleteDocument = async (documentId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);
      
      return documentId;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time updates
  const subscribeToCollection = (constraints: QueryConstraint[] = []) => {
    const collectionRef = collection(db, collectionName);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
    
    return onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDocuments(docs);
    }, (err) => {
      setError(err.message);
    });
  };

  return {
    documents,
    loading,
    error,
    getDocuments,
    getDocument,
    addDocument,
    updateDocument,
    deleteDocument,
    subscribeToCollection,
  };
};

// Specific hooks for different collections
export const useArticles = () => {
  const firestore = useFirestore('articles');
  
  const getPublishedArticles = () => {
    return firestore.getDocuments([
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(20)
    ]);
  };

  const getArticlesByAuthor = (authorId: string) => {
    return firestore.getDocuments([
      where('author.id', '==', authorId),
      orderBy('createdAt', 'desc')
    ]);
  };

  const getArticlesByCategory = (categorySlug: string) => {
    return firestore.getDocuments([
      where('categories', 'array-contains-any', [categorySlug]),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc')
    ]);
  };

  return {
    ...firestore,
    getPublishedArticles,
    getArticlesByAuthor,
    getArticlesByCategory,
  };
};

export const useUsers = () => {
  const firestore = useFirestore('users_backup');
  
  const getUserByEmail = async (email: string) => {
    const users = await firestore.getDocuments([
      where('email', '==', email),
      limit(1)
    ]);
    return users[0] || null;
  };

  return {
    ...firestore,
    getUserByEmail,
  };
};