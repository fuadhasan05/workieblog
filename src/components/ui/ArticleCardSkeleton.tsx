import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';

interface ArticleCardSkeletonProps {
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export function ArticleCardSkeleton({ variant = 'default', className }: ArticleCardSkeletonProps) {
  if (variant === 'featured') {
    return (
      <div className={cn('relative aspect-[16/9] md:aspect-[21/9] overflow-hidden', className)}>
        <Skeleton className="absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <Skeleton className="h-5 w-24 mb-3" />
          <Skeleton className="h-8 md:h-10 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2 mb-4" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex gap-3', className)}>
        <Skeleton className="w-20 h-16 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-3 w-16 mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('group', className)}>
      <Skeleton className="aspect-[16/10] w-full mb-4" />
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export function HeroCarouselSkeleton() {
  return (
    <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-lg">
      <Skeleton className="absolute inset-0" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <Skeleton className="h-6 w-28 mb-4" />
        <Skeleton className="h-10 md:h-14 w-3/4 mb-3" />
        <Skeleton className="h-5 w-1/2 mb-6" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrendingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-8 w-8 flex-shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
