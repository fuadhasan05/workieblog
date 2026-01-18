import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, User } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api/client';
import { getImageUrl } from '@/lib/utils/image';

interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  publishedAt: string;
  readTime: number | null;
  category: { name: string; slug: string } | null;
  tags: { id: string; name: string; slug: string }[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function Author() {
  const { slug } = useParams();
  const [author, setAuthor] = useState<Author | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchAuthor = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient.get(`/authors/${slug}?page=${page}&limit=9`);
        setAuthor(data.author);
        setPosts(data.posts);
        setPagination(data.pagination);
      } catch (err: any) {
        setError(err.message || 'Failed to load author');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchAuthor();
    }
  }, [slug, page]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center mb-12">
            <Skeleton className="w-24 h-24 rounded-full mb-4" />
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !author) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Author Not Found</h1>
          <p className="text-muted-foreground mb-8">
            {error || "The author you're looking for doesn't exist."}
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
        {/* Author Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          {author.avatar ? (
            <img
              src={getImageUrl(author.avatar)}
              alt={author.name}
              className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-primary"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 border-4 border-primary">
              <User className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            {author.name}
          </h1>
          {author.bio && (
            <p className="text-muted-foreground max-w-2xl mb-4">{author.bio}</p>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{pagination?.total || 0} articles published</span>
          </div>
        </div>

        {/* Articles Grid */}
        {posts.length > 0 ? (
          <>
            <h2 className="font-display text-2xl font-bold mb-6 border-b-4 border-primary pb-2">
              Articles by {author.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/article/${post.slug}`}
                  className="group block"
                >
                  <article className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-colors">
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
                      {post.category && (
                        <span className="text-xs font-display uppercase tracking-wider text-primary">
                          {post.category.name}
                        </span>
                      )}
                      <h3 className="font-display text-lg font-bold mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                        <span>
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        {post.readTime && (
                          <>
                            <span>•</span>
                            <span>{post.readTime} min read</span>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              No articles published yet.
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
