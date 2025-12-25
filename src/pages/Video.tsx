import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Eye, Calendar, Share2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { getVideoBySlug, videos } from '@/data/mockData';
import { VideoCard } from '@/components/videos/VideoCard';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export default function Video() {
  const { slug } = useParams();
  const video = getVideoBySlug(slug || '');
  const relatedVideos = videos.filter(v => v.slug !== slug).slice(0, 3);

  if (!video) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Video Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The video you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/videos">
            <Button className="font-display uppercase tracking-wider">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Videos
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true });
  const formattedViews = new Intl.NumberFormat('en-US').format(video.views);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back link */}
        <Link 
          to="/videos" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-display uppercase text-sm tracking-wider">Back to Videos</span>
        </Link>

        {/* Video Player */}
        <div className="aspect-video bg-foreground mb-6">
          <iframe
            src={video.videoUrl}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Info */}
        <div className="max-w-4xl">
          <span className="category-badge category-videos mb-3">Video</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {video.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {formattedViews} views
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {timeAgo}
            </span>
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>

          <p className="text-lg text-foreground/80 mb-8">
            {video.description}
          </p>
        </div>

        {/* Related Videos */}
        <div className="border-t border-border pt-8 mt-8">
          <h2 className="font-display text-2xl font-bold mb-6 uppercase tracking-tight">
            More Videos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedVideos.map((relatedVideo) => (
              <VideoCard key={relatedVideo.id} video={relatedVideo} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}