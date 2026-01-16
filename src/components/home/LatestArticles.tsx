import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { apiClient } from '@/lib/api/client';

export function LatestArticles() {
  const [latestArticles, setLatestArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLatestArticles();
  }, []);

  const loadLatestArticles = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get('/posts?limit=6&status=PUBLISHED');
      setLatestArticles(data.posts || []);
    } catch (error) {
      console.error('Failed to load latest articles:', error);
      setLatestArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-gradient-to-r from-primary to-accent">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">
            <span className="text-gradient">Latest Stories</span>
          </h2>
        </div>
        <div className="text-center py-12">Loading articles...</div>
      </section>
    );
  }

  if (latestArticles.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-gradient-to-r from-primary to-accent">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">
            <span className="text-gradient">Latest Stories</span>
          </h2>
        </div>
        <div className="text-center py-12">No articles available yet.</div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-gradient-to-r from-primary to-accent">
        <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">
          <span className="text-gradient">Latest Stories</span>
        </h2>
        <Link
          to="/articles"
          className="flex items-center gap-2 text-primary font-display uppercase text-sm tracking-wider hover:gap-3 transition-all group"
        >
          View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {latestArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}