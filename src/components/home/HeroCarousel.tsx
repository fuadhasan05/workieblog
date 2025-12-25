import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import { getFeaturedArticles, Article } from '@/data/mockData';
import { HeroCarouselSkeleton } from '@/components/ui/ArticleCardSkeleton';
import { ImageWithLoader } from '@/components/ui/ImageWithLoader';
import { formatDistanceToNow } from 'date-fns';

const categoryStyles: Record<string, string> = {
  career: 'bg-category-career',
  'success-stories': 'bg-category-success',
  wellness: 'bg-category-wellness',
  trends: 'bg-category-trends',
  money: 'bg-category-money',
};

const AUTOPLAY_INTERVAL = 6000;

export function HeroCarousel() {
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setArticles(getFeaturedArticles());
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi || isPaused || articles.length <= 1) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [emblaApi, isPaused, articles.length]);

  if (isLoading) {
    return <HeroCarouselSkeleton />;
  }

  if (articles.length === 0) return null;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {articles.map((article) => (
            <div key={article.id} className="flex-[0_0_100%] min-w-0">
              <Link
                to={`/article/${article.slug}`}
                className="relative block aspect-[16/9] md:aspect-[21/9] overflow-hidden"
              >
                <ImageWithLoader
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <span className={`category-badge ${categoryStyles[article.category] || 'bg-primary'} text-white mb-4`}>
                    {article.category.replace('-', ' ')}
                  </span>
                  <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-white/80 text-sm md:text-base mb-4 line-clamp-2 max-w-2xl">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-white/70 text-sm">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                    />
                    <div>
                      <span className="text-white font-medium">{article.author.name}</span>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime} min read</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      {articles.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots navigation */}
      {articles.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === selectedIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/75'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {!isPaused && articles.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            key={selectedIndex}
            className="h-full bg-primary"
            style={{
              animation: `progress ${AUTOPLAY_INTERVAL}ms linear`,
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
