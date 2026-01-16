import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { VideoCard } from '@/components/videos/VideoCard';
import { apiClient } from '@/lib/api/client';

export default function Videos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get('/videos');
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Failed to load videos:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const featuredVideo = videos[0];
  const otherVideos = videos.slice(1);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading videos...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2">
            Videos
          </h1>
          <p className="text-muted-foreground text-lg">
            All the content you need, but make it video.
          </p>
        </div>

        {/* Featured Video */}
        {featuredVideo && (
          <div className="mb-12">
            <VideoCard video={featuredVideo} variant="featured" />
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {/* Load More */}
        {videos.length > 6 && (
          <div className="text-center mt-12">
            <button className="font-display uppercase tracking-wider bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-colors">
              Load More Videos
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}