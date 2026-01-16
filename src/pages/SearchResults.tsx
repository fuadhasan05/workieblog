import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Button } from '@/components/ui/button';
import { Article } from '@/data/mockData';
import { apiClient } from '@/lib/api/client';

interface SearchFilters {
  category: string;
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [filters, setFilters] = useState<SearchFilters>({
    category: searchParams.get('category') || '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    searchArticlesData();
  }, [query, filters]);

  const loadCategories = async () => {
    try {
      const data = await apiClient.get('/categories');
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const searchArticlesData = async () => {
    try {
      setLoading(true);
      let url = '/posts?status=PUBLISHED';
      
      if (query) {
        url += `&search=${encodeURIComponent(query)}`;
      }
      
      if (filters.category) {
        url += `&category=${filters.category}`;
      }

      const data = await apiClient.get(url);
      setArticles(data.posts || []);
    } catch (error) {
      console.error('Failed to search articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setLoading(true);
  };

  const clearFilters = () => {
    setFilters({ category: '' });
    setLoading(true);
  };

  const hasActiveFilters = filters.category;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Search header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-4">
            {query ? `Search Results for "${query}"` : 'Search Articles'}
          </h1>
          {!loading && (
            <p className="text-muted-foreground">
              Found {articles.length} {articles.length === 1 ? 'article' : 'articles'}
            </p>
          )}
        </div>

        {/* Search bar and filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search articles..."
                value={query}
                onChange={(e) => {
                  const newParams = new URLSearchParams(searchParams);
                  if (e.target.value) {
                    newParams.set('q', e.target.value);
                  } else {
                    newParams.delete('q');
                  }
                  setSearchParams(newParams);
                  setLoading(true);
                }}
                className="w-full pl-12 pr-4 py-3 bg-secondary border-2 border-foreground focus:border-primary focus:outline-none font-body"
              />
            </div>

            {/* Filter toggle button */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="font-display uppercase tracking-wider"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
                  1
                </span>
              )}
            </Button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="bg-secondary border-2 border-foreground p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold uppercase">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border focus:border-primary focus:outline-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Searching...</p>
          </div>
        )}

        {/* No results */}
        {!loading && articles.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-display text-2xl font-bold mb-2">No Results Found</h2>
            <p className="text-muted-foreground mb-6">
              {query
                ? `We couldn't find any articles matching "${query}"`
                : 'Try adjusting your search or filters'}
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Results grid */}
        {!loading && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
