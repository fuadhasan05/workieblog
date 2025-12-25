import { Link } from 'react-router-dom';
import { Play, Eye } from 'lucide-react';
import { Video } from '@/data/mockData';

interface VideoCardProps {
  video: Video;
  variant?: 'default' | 'featured';
}

export function VideoCard({ video, variant = 'default' }: VideoCardProps) {
  const formattedViews = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(video.views);

  if (variant === 'featured') {
    return (
      <Link
        to={`/video/${video.slug}`}
        className="group relative block overflow-hidden hover-lift"
      >
        <div className="aspect-video overflow-hidden">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
        
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
            <Play className="h-8 w-8 text-primary-foreground fill-primary-foreground ml-1" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute top-4 right-4 bg-foreground/80 text-background px-2 py-1 text-sm font-medium">
          {video.duration}
        </div>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="category-badge category-videos mb-3">Video</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-background leading-tight mb-2">
            {video.title}
          </h2>
          <p className="text-background/80 text-sm mb-2 line-clamp-2">
            {video.description}
          </p>
          <div className="flex items-center gap-2 text-background/70 text-sm">
            <Eye className="h-4 w-4" />
            <span>{formattedViews} views</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/video/${video.slug}`}
      className="group block hover-lift"
    >
      <div className="relative aspect-video overflow-hidden mb-3">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
            <Play className="h-6 w-6 text-primary-foreground fill-primary-foreground ml-0.5" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-foreground/80 text-background px-2 py-0.5 text-xs font-medium">
          {video.duration}
        </div>
      </div>

      <span className="category-badge category-videos text-[10px] mb-2">Video</span>
      <h3 className="font-display text-base md:text-lg font-bold leading-tight group-hover:text-primary transition-colors mb-2">
        {video.title}
      </h3>
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <Eye className="h-3 w-3" />
        <span>{formattedViews} views</span>
      </div>
    </Link>
  );
}