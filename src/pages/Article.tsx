import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Link as LinkIcon, Crown, Lock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { SEO } from '@/components/SEO';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { Article as ArticleType } from '@/data/mockData';
import { getImageUrl } from '@/lib/utils/image';

const categoryStyles: Record<string, string> = {
  career: 'bg-purple-100 text-purple-800',
  'success-stories': 'bg-amber-100 text-amber-800',
  wellness: 'bg-teal-100 text-teal-800',
  money: 'bg-emerald-100 text-emerald-800',
  trends: 'bg-orange-100 text-orange-800',
};

export default function Article() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [article, setArticle] = useState<ArticleType | undefined>(undefined);
  const [relatedArticles, setRelatedArticles] = useState<ArticleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      if (!slug) return;

      const data = await apiClient.get(`/posts/${slug}`);
      setArticle(data.post);

      if (data.post?.category?.slug) {
        const relatedData = await apiClient.get(`/posts?category=${data.post.category.slug}&limit=3&status=PUBLISHED`);
        setRelatedArticles(relatedData.posts.filter((p: any) => p.id !== data.post.id).slice(0, 3));
      }
    } catch (error) {
      console.error('Failed to load article:', error);
      setArticle(undefined);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading article...</p>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The article you're looking for doesn't exist or has been removed.
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

  const publishDate = new Date(article.publishedAt);
  const timeAgo = formatDistanceToNow(publishDate, { addSuffix: true });
  const formattedDate = format(publishDate, 'MMMM d, yyyy');

  // Determine if content should be paywalled
  const shouldShowPaywall = article.isPremium && !isSubscribed;
  const contentPreview = shouldShowPaywall
    ? article.content.slice(0, 500) + '...'
    : article.content;

  // Get tag objects for display
  const articleTags = article.tags || [];

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = article.title;
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast({
        title: 'Link copied!',
        description: 'The article link has been copied to your clipboard.',
      });
      return;
    }

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const categoryName = article.category?.name || 'Uncategorized';
  const categorySlug = article.category?.slug || 'uncategorized';

  return (
    <Layout>
      <SEO
        title={article.title}
        description={article.excerpt}
        image={article.featuredImage}
        url={window.location.href}
        type="article"
        author={article.author.name}
        publishedTime={article.publishedAt}
        tags={article.tags}
      />
      <article>
        {/* Hero Image */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={getImageUrl(article.featuredImage)}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
          
          {/* Article header overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto max-w-4xl">
              <div className="flex items-center gap-2 mb-4">
                <Link
                  to={`/category/${categorySlug}`}
                  className={`px-3 py-1 rounded-full text-xs font-display uppercase tracking-wider ${categoryStyles[categorySlug] || 'bg-primary/10 text-primary'}`}
                >
                  {categoryName}
                </Link>
                {article.isPremium && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-display uppercase tracking-wider bg-accent text-accent-foreground">
                    <Crown className="h-3 w-3" /> Premium
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-background leading-tight mb-4">
                {article.title}
              </h1>
              <p className="text-background/80 text-lg md:text-xl max-w-2xl">
                {article.excerpt}
              </p>
            </div>
          </div>
        </div>

        {/* Article content */}
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 py-6 border-b border-border mb-8">
            {/* Author */}
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-display font-bold">{article.author.name}</p>
                <p className="text-muted-foreground text-sm">{article.author.bio}</p>
              </div>
            </div>

            <div className="flex-1" />

            {/* Date and read time */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1" title={formattedDate}>
                <Calendar className="h-4 w-4" />
                {timeAgo}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.readTime} min read
              </span>
            </div>

            {/* Share buttons */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">
                <Share2 className="h-4 w-4" />
              </span>
              <button
                onClick={() => handleShare('twitter')}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
                aria-label="Copy link"
              >
                <LinkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Article body */}
          <div className="mb-12">
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-display prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-p:text-foreground/90 prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-primary prose-blockquote:italic
                prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: contentPreview }}
            />

            {/* Tags */}
            {articleTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {articleTags.map((tag) => tag && (
                  <Link key={tag.id} to={`/tag/${tag.slug}`}>
                    <Badge variant="secondary" className="hover:bg-secondary/80">
                      #{tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Paywall for premium content */}
            {shouldShowPaywall && (
              <div className="relative mt-8">
                {/* Gradient overlay */}
                <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

                {/* Paywall card */}
                <div className="bg-secondary border-2 border-primary rounded-lg p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                    <Lock className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2">Premium Content</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Subscribe to unlock this article and get unlimited access to all premium content, exclusive newsletters, and more.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/pricing">
                      <Button size="lg" className="font-display uppercase tracking-wider">
                        <Crown className="h-4 w-4 mr-2" />
                        Subscribe Now
                      </Button>
                    </Link>
                    <Link to="/member/login">
                      <Button size="lg" variant="outline" className="font-display uppercase tracking-wider">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="border-t border-border pt-8">
              <h3 className="font-display text-2xl font-bold mb-6 uppercase tracking-tight">
                More Stories You'll Love
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <ArticleCard key={related.id} article={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </Layout>
  );
}
