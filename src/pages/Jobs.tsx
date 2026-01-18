import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Building2, Clock, Briefcase, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import pageJobs from '@/assets/page-jobs.png';
import { apiClient } from '@/lib/api/client';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP';
  remote: boolean;
  description: string;
  requirements?: string;
  applicationUrl: string;
  tags: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  createdAt: string;
  expiresAt?: string;
}

const jobTypeLabels: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  FREELANCE: 'Freelance',
  INTERNSHIP: 'Internship',
};

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get('/jobs?status=ACTIVE&limit=100');
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBySearch = useMemo(() => {
    let filtered = jobs;

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by remote
    if (remoteOnly) {
      filtered = filtered.filter(job => job.remote);
    }

    return filtered;
  }, [jobs, search, remoteOnly]);

  const allTags = [...new Set(filteredBySearch.flatMap(job => job.tags))];
  
  const filteredJobs = selectedTag 
    ? filteredBySearch.filter(job => job.tags.includes(selectedTag))
    : filteredBySearch;

  return (
    <Layout>
      <SEO 
        title="Job Board"
        description="Find your next career opportunity. Curated job listings from top companies across Africa, focused on roles for ambitious women."
      />
      
      {/* Hero Section with Illustration */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Job Board
              </h1>
              <p className="text-foreground/80 text-lg md:text-xl max-w-2xl">
                Curated opportunities from companies that value diversity and are actively looking for talented women like you.
              </p>
            </div>
            <div className="hidden lg:flex justify-center">
              <img 
                src={pageJobs} 
                alt="Women at job interview" 
                className="w-full max-w-md h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search jobs, companies, locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant={!selectedTag && !remoteOnly ? "outline" : "ghost"} 
              size="sm" 
              className="font-display uppercase tracking-wider"
              onClick={() => { setSelectedTag(null); setRemoteOnly(false); }}
            >
              All Jobs
            </Button>
            <Button 
              variant={remoteOnly ? "outline" : "ghost"} 
              size="sm" 
              className="font-display uppercase tracking-wider"
              onClick={() => setRemoteOnly(!remoteOnly)}
            >
              Remote Only
            </Button>
            {allTags.slice(0, 5).map((tag) => (
              <Button 
                key={tag}
                variant={selectedTag === tag ? "outline" : "ghost"} 
                size="sm" 
                className="font-display uppercase tracking-wider"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-10 w-28" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">No jobs found</h3>
              <p className="text-muted-foreground">Check back soon for new opportunities!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-display text-xl font-bold text-foreground">
                            {job.title}
                          </h3>
                          {job.remote && (
                            <Badge variant="secondary" className="text-xs">
                              Remote
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {jobTypeLabels[job.jobType]}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        {job.salary && (
                          <p className="text-sm font-medium text-primary">{job.salary}</p>
                        )}
                      </div>
                      
                      <Link to={`/jobs/${job.id}`}>
                        <Button className="font-display uppercase tracking-wider shrink-0">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Post Job CTA */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Hiring?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Reach 250,000+ ambitious African women. Post your job listing and find your next great hire.
          </p>
          <Link to="/jobs/post">
            <Button size="lg" className="font-display uppercase tracking-wider">
              Post a Job
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
