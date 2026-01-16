import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/data/mockData';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { apiClient } from '@/lib/api/client';

interface CategorySectionProps {
  category: Category;
  title: string;
}

const categoryColors: Record<Category, string> = {
  career: 'border-category-career',
  'success-stories': 'border-category-success',
  wellness: 'border-category-wellness',
  money: 'border-category-money',
  trends: 'border-category-trends',
};

export function CategorySection({ category, title }: CategorySectionProps) {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategoryArticles();
  }, [category]);

  const loadCategoryArticles = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get(`/posts?status=PUBLISHED&category=${category}&limit=4`);
      setArticles(data.posts || []);
    } catch (error) {
      console.error('Failed to load category articles:', error);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1);

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className={`flex items-center justify-between mb-6 pb-2 border-b-4 ${categoryColors[category]}`}>
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">
            {title}
          </h2>
        </div>
        <div className="text-center py-8">Loading...</div>
      </section>
    );
  }

  if (!mainArticle) return null;

  return (
    <section className="mb-12">
      <div className={`flex items-center justify-between mb-6 pb-2 border-b-4 ${categoryColors[category]}`}>
        <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">
          {title}
        </h2>
        <Link
          to={`/category/${category}`}
          className="flex items-center gap-2 text-primary font-display uppercase text-sm tracking-wider hover:gap-3 transition-all"
        >
          More {title} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ArticleCard article={mainArticle} />
        </div>
        <div className="space-y-4">
          {sideArticles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
