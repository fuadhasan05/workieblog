import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { 
  FileText, 
  Users, 
  Eye, 
  TrendingUp, 
  Briefcase, 
  PlusCircle, 
  Edit3, 
  UserPlus,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, postsData, jobsData] = await Promise.all([
        apiClient.get('/analytics/dashboard'),
        apiClient.get('/posts?limit=5&status=all').catch(() => ({ posts: [] })),
        apiClient.get('/jobs?limit=5').catch(() => ({ jobs: [] }))
      ]);
      setStats(statsData);
      setRecentPosts(postsData.posts || []);
      setRecentJobs(jobsData.jobs || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'outline'; icon: React.ReactNode }> = {
      PUBLISHED: { variant: 'default', icon: <CheckCircle className="w-3 h-3 mr-1" /> },
      DRAFT: { variant: 'secondary', icon: <Edit3 className="w-3 h-3 mr-1" /> },
      SCHEDULED: { variant: 'outline', icon: <Clock className="w-3 h-3 mr-1" /> },
      ACTIVE: { variant: 'default', icon: <CheckCircle className="w-3 h-3 mr-1" /> },
      INACTIVE: { variant: 'secondary', icon: <AlertCircle className="w-3 h-3 mr-1" /> },
    };
    const { variant, icon } = config[status] || config.DRAFT;
    return (
      <Badge variant={variant} className="flex items-center text-xs">
        {icon}
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your content.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/posts/new">
            <Button className="bg-pink-600 hover:bg-pink-700">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/admin/posts/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed hover:border-pink-300">
            <CardContent className="flex items-center justify-center py-6">
              <div className="text-center">
                <FileText className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <p className="text-sm font-medium">New Post</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/jobs">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed hover:border-pink-300">
            <CardContent className="flex items-center justify-center py-6">
              <div className="text-center">
                <Briefcase className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Add Job</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/team">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed hover:border-pink-300">
            <CardContent className="flex items-center justify-center py-6">
              <div className="text-center">
                <UserPlus className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Add Team Member</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/media">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed hover:border-pink-300">
            <CardContent className="flex items-center justify-center py-6">
              <div className="text-center">
                <PlusCircle className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Upload Media</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.totalViews || 0).toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.totalSubscribers || 0).toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">Active subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts Published</CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.postsPublished || 0}</div>
            <p className="text-xs text-gray-600 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{stats?.subscriberGrowth?.length || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">New subscribers</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>Your latest content</CardDescription>
            </div>
            <Link to="/admin/posts">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No posts yet</p>
              ) : (
                recentPosts.map((post: any) => (
                  <div key={post.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="font-medium text-gray-900 hover:text-pink-600 truncate block"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {post.author?.name || 'Unknown'}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(post.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      {getStatusBadge(post.status)}
                      <span className="text-xs text-gray-500">{post.views || 0} views</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Jobs</CardTitle>
              <CardDescription>Latest job listings</CardDescription>
            </div>
            <Link to="/admin/jobs">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No jobs yet</p>
              ) : (
                recentJobs.map((job: any) => (
                  <div key={job.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{job.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{job.company}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500">{job.location}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {getStatusBadge(job.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Posts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top Performing Posts</CardTitle>
            <CardDescription>Posts with the most views</CardDescription>
          </div>
          <Link to="/admin/analytics">
            <Button variant="ghost" size="sm">
              View Analytics
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.popularPosts?.slice(0, 5).map((post: any, index: number) => (
              <div key={post.id} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/admin/posts/${post.id}/edit`}
                    className="font-medium text-gray-900 hover:text-pink-600 truncate block"
                  >
                    {post.title}
                  </Link>
                  <p className="text-sm text-gray-500">{post.category?.name || 'Uncategorized'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{(post.views || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">views</p>
                </div>
              </div>
            ))}
            {(!stats?.popularPosts || stats.popularPosts.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
