import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { videos } from '@/data/mockData';
import { VideoCard } from '@/components/videos/VideoCard';
import videoIllustration from '@/assets/video-section.png';

export function VideoSection() {
  const featuredVideo = videos[0];
  const otherVideos = videos.slice(1, 3);

  return (
    <section className="mb-12 bg-secondary py-10 -mx-4 px-4 md:-mx-8 md:px-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6 pb-2 border-b-4 border-category-videos">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">
            Watch Now
          </h2>
          <Link
            to="/videos"
            className="flex items-center gap-2 text-primary font-display uppercase text-sm tracking-wider hover:gap-3 transition-all"
          >
            All Videos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured video */}
          {featuredVideo && (
            <div className="lg:col-span-2">
              <VideoCard video={featuredVideo} variant="featured" />
            </div>
          )}

          {/* Other videos and illustration */}
          <div className="flex flex-col gap-4">
            {otherVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
            <div className="hidden lg:flex justify-center items-center flex-1">
              <img 
                src={videoIllustration} 
                alt="Woman watching video content" 
                className="w-40 h-40 object-contain opacity-80"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
