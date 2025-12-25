import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tag as TagIcon } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getTagBySlug, getArticlesByTag, tags as allTags, Article } from '@/data/mockData';

export default function TagPage() {
  const { slug } = useParams();
  const [tag, setTag] = useState<{ id: string; name: string; slug: string } | null>(null);
  const [posts, setPosts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      if (slug) {
        const foundTag = getTagBySlug(slug);
        setTag(foundTag || null);
        
        if (foundTag) {
          const tagPosts = getArticlesByTag(slug);
          setPosts(tagPosts);
        }
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!tag) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Tag Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The tag you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button className="font-display uppercase tracking-wider">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Tag Header */}
        <div className="mb-8 pb-4 border-b-4 border-primary">
          <div className="flex items-center gap-3 mb-2">
            <TagIcon className="w-8 h-8 text-primary" />
            <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight">
              #{tag.name}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {posts.length} article{posts.length !== 1 ? 's' : ''} tagged with "{tag.name}"
          </p>
        </div>

        {/* Articles Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const postTags = post.tags?.map(tagSlug => 
                allTags.find(t => t.slug === tagSlug)
              ).filter(Boolean) || [];

              return (
                <Link
                  key={post.id}
                  to={`/article/${post.slug}`}
                  className="group block"
                >
                  <article className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-colors h-full">
                    {post.featuredImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <span className="text-xs font-display uppercase tracking-wider text-primary">
                        {post.category.charAt(0).toUpperCase() + post.category.slice(1).replace('-', ' ')}
                      </span>
                      <h3 className="font-display text-lg font-bold mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {postTags.slice(0, 3).map((t) => t && (
                          <Badge key={t.id} variant="secondary" className="text-xs">
                            #{t.name}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                        <span>{post.author.name}</span>
                        <span>•</span>
                        <span>
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              No articles with this tag yet.
            </p>
            <Link to="/">
              <Button variant="outline" className="font-display uppercase tracking-wider">
                Browse All Articles
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
