import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getArticlesByCategory, getLatestArticles, Article, Category } from '@/data/mockData';
import { ArticleCard } from '@/components/articles/ArticleCard';

const tabs = [
  { id: 'all', label: 'ALL', slug: null },
  { id: 'career', label: 'CAREER', slug: 'career' },
  { id: 'success-stories', label: 'SUCCESS STORIES', slug: 'success-stories' },
  { id: 'wellness', label: 'WELLNESS', slug: 'wellness' },
  { id: 'money', label: 'MONEY', slug: 'money' },
  { id: 'trends', label: 'TRENDS', slug: 'trends' },
];

export function CategoryTabs() {
  const [activeTab, setActiveTab] = useState('all');

  const getArticles = (): Article[] => {
    if (activeTab === 'all') {
      return getLatestArticles(6);
    }
    const tab = tabs.find(t => t.id === activeTab);
    if (tab?.slug) {
      return getArticlesByCategory(tab.slug as Category).slice(0, 6);
    }
    return getLatestArticles(6);
  };

  const articles = getArticles();

  return (
    <section className="py-8">
      {/* Category tabs */}
      <div className="border-b border-border mb-8 overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium tracking-wide transition-colors relative whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Article grid - 3 columns like girlboss */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="grid" />
        ))}
      </div>

      {/* View more link */}
      {activeTab !== 'all' && (
        <div className="mt-8 text-center">
          <Link
            to={`/category/${tabs.find(t => t.id === activeTab)?.slug || ''}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all {tabs.find(t => t.id === activeTab)?.label.toLowerCase()}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
