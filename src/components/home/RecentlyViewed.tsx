import { Link } from 'react-router-dom';
import { History, X } from 'lucide-react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { Button } from '@/components/ui/button';
import { ImageWithLoader } from '@/components/ui/ImageWithLoader';

const categoryStyles: Record<string, string> = {
  news: 'category-news',
  entertainment: 'category-entertainment',
  relationships: 'category-relationships',
  lifestyle: 'category-lifestyle',
  videos: 'category-videos',
};

export function RecentlyViewed() {
  const { recentlyViewed, clearHistory, hasHistory } = useRecentlyViewed();

  if (!hasHistory) return null;

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-display text-xl uppercase tracking-wider font-bold">
            Recently Viewed
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="text-muted-foreground hover:text-foreground gap-1"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        {recentlyViewed.map((article) => (
          <Link
            key={article.id}
            to={`/article/${article.slug}`}
            className="flex-shrink-0 w-64 group"
          >
            <div className="relative aspect-[16/10] overflow-hidden mb-2">
              <ImageWithLoader
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className={`category-badge ${categoryStyles[article.category] || ''} text-[10px]`}>
              {article.category}
            </span>
            <h3 className="font-display text-sm font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors mt-1">
              {article.title}
            </h3>
          </Link>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
