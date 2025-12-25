import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'recently-viewed-articles';
const MAX_ITEMS = 10;

export interface RecentlyViewedArticle {
  id: string;
  slug: string;
  title: string;
  featuredImage: string;
  category: string;
  viewedAt: number;
}

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedArticle[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const addToRecentlyViewed = useCallback((article: Omit<RecentlyViewedArticle, 'viewedAt'>) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== article.id);
      const newItem: RecentlyViewedArticle = {
        ...article,
        viewedAt: Date.now(),
      };
      const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentlyViewed([]);
  }, []);

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearHistory,
    hasHistory: recentlyViewed.length > 0,
  };
}
