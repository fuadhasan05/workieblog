import { useState, useEffect } from 'react';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { apiClient } from '@/lib/api/client';

export function HeroSection() {
  const [featuredArticles, setFeaturedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedArticles();
  }, []);

  const loadFeaturedArticles = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get('/posts?isFeatured=true&status=PUBLISHED&limit=2');
      setFeaturedArticles(data.posts || []);
    } catch (error) {
      console.error('Failed to load featured articles:', error);
      setFeaturedArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const mainFeatured = featuredArticles[0];
  const secondaryFeatured = featuredArticles[1];

  if (loading || !mainFeatured) return null;

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main featured article */}
        <div className="lg:col-span-2">
          <ArticleCard article={mainFeatured} variant="featured" />
        </div>

        {/* Secondary featured */}
        {secondaryFeatured && (
          <div className="lg:col-span-1">
            <ArticleCard article={secondaryFeatured} variant="featured" />
          </div>
        )}
      </div>
    </section>
  );
}