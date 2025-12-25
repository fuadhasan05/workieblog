import { getFeaturedArticles } from '@/data/mockData';
import { ArticleCard } from '@/components/articles/ArticleCard';

export function HeroSection() {
  const featuredArticles = getFeaturedArticles();
  const mainFeatured = featuredArticles[0];
  const secondaryFeatured = featuredArticles[1];

  if (!mainFeatured) return null;

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