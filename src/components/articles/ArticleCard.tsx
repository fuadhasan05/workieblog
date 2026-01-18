import { Link } from 'react-router-dom';
import { Clock, Crown } from 'lucide-react';
import { Article as MockArticle } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';
import { getImageUrl } from '@/lib/utils/image';

// Support both mock data format (category as string) and API format (category as object)
interface APIArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  publishedAt: string;
  readTime: number;
  isPremium?: boolean;
  isFeatured?: boolean;
  author: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  category: {
    id: string;
    slug: string;
    name: string;
    color?: string;
  };
  tags?: Array<{ id: string; name: string; slug: string }>;
}

export type ArticleType = MockArticle | APIArticle;

interface ArticleCardProps {
  article: ArticleType;
  variant?: 'default' | 'featured' | 'compact' | 'grid';
}

const categoryStyles: Record<string, string> = {
  career: 'bg-category-career',
  'success-stories': 'bg-category-success',
  wellness: 'bg-category-wellness',
  trends: 'bg-category-trends',
  money: 'bg-category-money',
};

// Helper to get category string from either format
const getCategorySlug = (category: string | { slug: string }): string => {
  return typeof category === 'string' ? category : category.slug;
};

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });

  if (variant === 'featured') {
    return (
      <Link 
        to={`/article/${article.slug}`}
        className="group relative block overflow-hidden rounded-lg hover-glow"
      >
        <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          <img
            src={getImageUrl(article.featuredImage)}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <span className={`category-badge ${categoryStyles[getCategorySlug(article.category)] || 'bg-primary'} text-white mb-3`}>
            {getCategorySlug(article.category)}
          </span>
          {article.isPremium && (
            <span className="ml-2 inline-flex items-center gap-1 category-badge bg-accent text-accent-foreground">
              <Crown className="h-3 w-3" /> Premium
            </span>
          )}
          <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-background leading-tight mb-3">
            {article.title}
          </h2>
          <p className="text-background/80 text-lg hidden md:block mb-4 max-w-2xl">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-4 text-background/70 text-sm">
            <span className="font-medium">{article.author.name}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.readTime} min read
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Girlboss-style grid card
  if (variant === 'grid') {
    return (
      <Link
        to={`/article/${article.slug}`}
        className="group block"
      >
        <div className="aspect-[4/3] overflow-hidden rounded-lg mb-3">
          <img
            src={getImageUrl(article.featuredImage)}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
            {typeof article.category === 'string' 
              ? article.category.replace('-', ' ') 
              : article.category.name}
          </span>
          <h3 className="font-display text-lg font-semibold leading-tight group-hover:text-primary transition-colors mb-2">
            {article.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/article/${article.slug}`}
        className="group flex gap-4 p-2 rounded-lg transition-all duration-300 hover:bg-secondary/50"
      >
        <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
          <img
            src={getImageUrl(article.featuredImage)}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`category-badge ${categoryStyles[getCategorySlug(article.category)] || 'bg-primary'} text-white text-[10px] mb-1`}>
            {getCategorySlug(article.category)}
          </span>
          <h3 className="font-display text-sm font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <span className="text-muted-foreground text-xs mt-1 block">{timeAgo}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/article/${article.slug}`}
      className="group block rounded-lg overflow-hidden bg-card hover-border-glow"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={getImageUrl(article.featuredImage)}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`category-badge ${categoryStyles[getCategorySlug(article.category)] || 'bg-primary'} text-white`}>
            {getCategorySlug(article.category)}
          </span>
          {article.isPremium && (
            <span className="inline-flex items-center gap-1 category-badge bg-accent text-accent-foreground">
              <Crown className="h-3 w-3" /> Premium
            </span>
          )}
        </div>
        <h3 className="font-display text-lg md:text-xl font-bold leading-tight group-hover:text-primary transition-colors mb-2">
          {article.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">{article.author.name}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readTime} min
          </span>
        </div>
      </div>
    </Link>
  );
}