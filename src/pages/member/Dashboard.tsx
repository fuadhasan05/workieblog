import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useMember } from '@/contexts/MemberContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { Crown, Bookmark, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function MemberDashboard() {
  const { member, isAuthenticated, isLoading, logout } = useMember();
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loadingSaved, setLoadingSaved] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadSavedArticles();
      loadSubscription();
    }
  }, [isAuthenticated]);

  const loadSavedArticles = async () => {
    try {
      const data = await apiClient.get('/saved-articles');
      setSavedArticles(data.savedArticles);
    } catch (error) {
      console.error('Failed to load saved articles:', error);
    } finally {
      setLoadingSaved(false);
    }
  };

  const loadSubscription = async () => {
    try {
      const data = await apiClient.get('/subscriptions/status');
      setSubscription(data);
    } catch (error) {
      console.error('Failed to load subscription:', error);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const data = await apiClient.post('/subscriptions/create-portal-session');
      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error.message || 'Failed to open billing portal');
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/member/login" replace />;
  }

  const getTierBadge = (tier: string) => {
    const variants: any = {
      FREE: { variant: 'secondary', icon: null },
      PREMIUM: { variant: 'default', icon: Crown },
      VIP: { variant: 'destructive', icon: Crown }
    };
    const config = variants[tier] || variants.FREE;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        {Icon && <Icon className="w-3 h-3" />}
        {tier}
      </Badge>
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {member?.name}!</h1>
          <p className="text-gray-600">Manage your membership and saved articles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Membership Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Membership</span>
                {getTierBadge(member?.membershipTier || 'FREE')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{member?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">
                    {member?.createdAt && format(new Date(member.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>

              {member?.membershipTier !== 'FREE' && subscription?.startDate && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Subscription Start</p>
                    <p className="font-medium">
                      {format(new Date(subscription.startDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                  {subscription?.endDate && (
                    <div>
                      <p className="text-sm text-gray-600">Renewal/End Date</p>
                      <p className="font-medium">
                        {format(new Date(subscription.endDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {member?.membershipTier === 'FREE' ? (
                  <Link to="/pricing">
                    <Button className="bg-pink-600 hover:bg-pink-700">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade Membership
                    </Button>
                  </Link>
                ) : (
                  <Button onClick={handleManageSubscription} variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Subscription
                  </Button>
                )}
                <Button onClick={handleLogout} variant="outline">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bookmark className="w-5 h-5 mr-2" />
                Saved Articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-600 mb-2">
                {savedArticles.length}
              </div>
              <p className="text-sm text-gray-600">Articles saved for later</p>
            </CardContent>
          </Card>
        </div>

        {/* Saved Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Your Saved Articles</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSaved ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading saved articles...</p>
              </div>
            ) : savedArticles.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You haven't saved any articles yet</p>
                <Link to="/">
                  <Button variant="outline">Browse Articles</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedArticles.map(({ post, savedAt }) => (
                  <Link
                    key={post.id}
                    to={`/article/${post.slug}`}
                    className="group block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {post.featuredImage && (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <Badge variant="secondary" className="mb-2">
                        {post.category.name}
                      </Badge>
                      <h3 className="font-semibold group-hover:text-pink-600 transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Saved {format(new Date(savedAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
