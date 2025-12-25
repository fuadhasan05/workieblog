import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getArticlesByCategory, Category } from '@/data/mockData';
import { ArticleCard } from '@/components/articles/ArticleCard';

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
  const articles = getArticlesByCategory(category).slice(0, 4);
  const mainArticle = articles[0];
  const sideArticles = articles.slice(1);

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
