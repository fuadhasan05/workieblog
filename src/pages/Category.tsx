import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Category as CategoryType } from '@/data/mockData';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';

// Import category header images
import categoryCareer from '@/assets/category-career.png';
import categorySuccess from '@/assets/category-success.png';
import categoryWellness from '@/assets/category-wellness.png';
import categoryMoney from '@/assets/category-money.png';
import categoryTrends from '@/assets/category-trends.png';

const categoryDescriptions: Record<CategoryType, string> = {
  career: "Career advice, job search tips, and how to level up professionally.",
  'success-stories': "Inspiring stories of African women who made it happen.",
  wellness: "Work-life balance, mental health, and living your best life.",
  money: "Financial advice, investing tips, and building wealth.",
  trends: "Workplace trends, industry insights, and what's next.",
};

const categoryImages: Record<CategoryType, string> = {
  career: categoryCareer,
  'success-stories': categorySuccess,
  wellness: categoryWellness,
  money: categoryMoney,
  trends: categoryTrends,
};

const categoryGradients: Record<CategoryType, string> = {
  career: 'from-purple-100 via-pink-50 to-lavender-100',
  'success-stories': 'from-amber-100 via-coral-50 to-pink-100',
  wellness: 'from-teal-100 via-mint-50 to-sage-100',
  money: 'from-emerald-100 via-green-50 to-cream-100',
  trends: 'from-orange-100 via-coral-50 to-peach-100',
};

export default function Category() {
  const { slug } = useParams();
  const [category, setCategory] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryData();
  }, [slug]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      const [categoriesData, postsData] = await Promise.all([
        apiClient.get('/categories'),
        apiClient.get(`/posts?category=${slug}&status=PUBLISHED`)
      ]);
      
      const foundCategory = categoriesData.categories?.find((c: any) => c.slug === slug);
      setCategory(foundCategory);
      setArticles(postsData.posts || []);
    } catch (error) {
      console.error('Failed to load category:', error);
      setCategory(null);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }
  
  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The category you're looking for doesn't exist.
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

  const headerImage = categoryImages[category.slug as CategoryType];
  const gradient = categoryGradients[category.slug as CategoryType] || 'from-primary/10 to-primary/5';

  return (
    <Layout>
      {/* Category Header with Watercolor Illustration */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} mb-8`}>
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight mb-4 text-foreground">
                {category.name}
              </h1>
              <p className="text-foreground/80 text-lg md:text-xl max-w-lg">
                {categoryDescriptions[category.slug as CategoryType] || 'Explore articles in this category.'}
              </p>
            </div>
            {headerImage && (
              <div className="hidden lg:flex justify-center">
                <img 
                  src={headerImage} 
                  alt={`${category.name} illustration`}
                  className="w-full max-w-md h-auto object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              No articles in this category yet.
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
