import { useState, useEffect, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Download, 
  FileText, 
  BookOpen, 
  Target, 
  Users, 
  TrendingUp,
  Briefcase,
  Lightbulb,
  Star,
  Mail
} from 'lucide-react';
import pageResources from '@/assets/page-resources.png';
import { mockResources, getFilteredResources, Resource } from '@/data/mockResourcesData';

const categories = [
  { value: 'ALL', label: 'All Resources' },
  { value: 'CAREER_TOOLS', label: 'Career Tools' },
  { value: 'NETWORKING', label: 'Networking' },
  { value: 'PLANNING', label: 'Planning' },
  { value: 'TEMPLATES', label: 'Templates' },
  { value: 'GUIDES', label: 'Guides' },
];

const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  FILE_TEXT: FileText,
  BOOK_OPEN: BookOpen,
  TARGET: Target,
  USERS: Users,
  TRENDING_UP: TrendingUp,
  BRIEFCASE: Briefcase,
  LIGHTBULB: Lightbulb,
  STAR: Star,
};

const formatDownloadCount = (count: number) => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K+';
  }
  return count.toString();
};

const EMAIL_STORAGE_KEY = 'resource_download_email';

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [pendingResource, setPendingResource] = useState<Resource | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simulate loading delay for demo
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredResources = useMemo(() => {
    return getFilteredResources(resources, selectedCategory);
  }, [resources, selectedCategory]);

  const initiateDownload = (resource: Resource) => {
    const storedEmail = localStorage.getItem(EMAIL_STORAGE_KEY);
    if (storedEmail) {
      handleDownload(resource);
    } else {
      setPendingResource(resource);
      setEmailDialogOpen(true);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pendingResource) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      // Save email for future downloads
      localStorage.setItem(EMAIL_STORAGE_KEY, email);
      setEmailDialogOpen(false);
      
      // Proceed with download
      await handleDownload(pendingResource);
      toast.success('Thanks! Your download is starting.');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
      setPendingResource(null);
      setEmail('');
    }
  };

  const handleDownload = async (resource: Resource) => {
    try {
      setDownloadingId(resource.id);
      
      // For demo: simulate download with public resource files
      const resourceFiles: Record<string, string> = {
        '1': '/resources/cv-template.pdf',
        '2': '/resources/salary-negotiation-script.md',
        '3': '/resources/linkedin-optimization-guide.md',
        '4': '/resources/interview-prep-checklist.md',
        '5': '/resources/weekly-planner-template.md',
        '6': '/resources/remote-work-productivity-guide.md',
        '7': '/resources/networking-email-templates.md',
        '8': '/resources/first-90-days-plan.pdf',
        '9': '/resources/personal-branding-workbook.pdf',
      };

      const fileUrl = resourceFiles[resource.id];
      
      if (fileUrl) {
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = resource.title.replace(/[^a-zA-Z0-9]/g, '_') + '.' + getFileExtension(resource.mimeType);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      
      // Update local download count
      setResources(prev => 
        prev.map(r => 
          r.id === resource.id 
            ? { ...r, downloadCount: r.downloadCount + 1 }
            : r
        )
      );
      
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download resource');
    } finally {
      setDownloadingId(null);
    }
  };

  const getFileExtension = (mimeType: string) => {
    const mimeToExt: Record<string, string> = {
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'application/vnd.ms-powerpoint': 'ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
      'text/plain': 'txt',
      'text/csv': 'csv',
      'application/zip': 'zip',
    };
    return mimeToExt[mimeType] || 'file';
  };

  return (
    <Layout>
      <SEO 
        title="Free Resources"
        description="Download free career resources including resume templates, salary negotiation scripts, and interview prep guides designed for ambitious African women."
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lavender-100 via-pink-50 to-mint-100 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Free Resources
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-xl">
                Career tools, templates, and guides to help you level up. No strings attached.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <img 
                src={pageResources} 
                alt="Woman organizing career resources and documents" 
                className="w-full max-w-md h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 border-b border-border bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="font-display uppercase tracking-wider text-xs"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border shadow-sm">
                  <CardHeader>
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <Skeleton className="h-6 w-3/4 mt-4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No resources available</h3>
              <p className="text-muted-foreground">
                Check back soon for new career resources and tools.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const IconComponent = iconComponents[resource.iconType] || FileText;
                const categoryLabel = categories.find(c => c.value === resource.category)?.label || resource.category;
                
                return (
                  <Card key={resource.id} className="border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded">
                          {categoryLabel}
                        </span>
                      </div>
                      <CardTitle className="font-display text-xl mt-4">{resource.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">{resource.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatDownloadCount(resource.downloadCount)} downloads
                        </span>
                        <Button 
                          size="sm" 
                          className="font-display uppercase tracking-wider"
                          onClick={() => initiateDownload(resource)}
                          disabled={downloadingId === resource.id}
                        >
                          {downloadingId === resource.id ? (
                            'Downloading...'
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Want More Resources?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Subscribe to our newsletter for exclusive resources, career tips, and success stories delivered weekly.
          </p>
          <Button size="lg" className="font-display uppercase tracking-wider">
            Subscribe Now
          </Button>
        </div>
      </section>

      {/* Email Gate Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              Get Your Free Resource
            </DialogTitle>
            <DialogDescription>
              Enter your email to download this resource. We'll also send you career tips and new resources.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEmailDialogOpen(false);
                  setPendingResource(null);
                  setEmail('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !email}
                className="flex-1 font-display uppercase tracking-wider"
              >
                {isSubmitting ? 'Processing...' : 'Download Now'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              By downloading, you agree to receive occasional emails. Unsubscribe anytime.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
