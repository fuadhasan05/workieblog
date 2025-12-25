import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Briefcase, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { z } from 'zod';

const jobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters').max(100),
  company: z.string().min(2, 'Company name must be at least 2 characters').max(100),
  location: z.string().min(2, 'Location is required').max(100),
  salary: z.string().max(50).optional(),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP']),
  remote: z.boolean(),
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000),
  requirements: z.string().max(3000).optional(),
  applicationUrl: z.string().url('Please enter a valid URL'),
  tags: z.string().max(200),
  contactEmail: z.string().email('Please enter a valid email'),
});

type JobFormData = z.infer<typeof jobSchema>;

const initialFormData: JobFormData = {
  title: '',
  company: '',
  location: '',
  salary: '',
  jobType: 'FULL_TIME',
  remote: false,
  description: '',
  requirements: '',
  applicationUrl: '',
  tags: '',
  contactEmail: '',
};

export default function PostJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: keyof JobFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const result = jobSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit job with INACTIVE status for review
      await apiClient.post('/jobs/submit', {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        status: 'INACTIVE', // Jobs start as inactive for admin review
      });

      setIsSubmitted(true);
      toast.success('Job submitted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <SEO title="Job Submitted" description="Your job listing has been submitted for review." />
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Job Submitted Successfully!
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Thank you for posting with us. Our team will review your listing and it will be live within 24-48 hours.
              You'll receive a confirmation email at <strong>{formData.contactEmail}</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/jobs')} variant="outline">
                View Job Board
              </Button>
              <Button onClick={() => { setIsSubmitted(false); setFormData(initialFormData); }}>
                Post Another Job
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title="Post a Job"
        description="Reach 250,000+ ambitious African women. Post your job listing and find your next great hire."
      />
      
      {/* Hero Section */}
      <section className="bg-primary py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Briefcase className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            Post a Job
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Reach 250,000+ ambitious African women actively seeking new opportunities.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Fill out the form below to submit your job listing. All submissions are reviewed before going live.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="e.g., Senior Product Manager"
                      className={errors.title ? 'border-destructive' : ''}
                    />
                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      placeholder="e.g., Flutterwave"
                      className={errors.company ? 'border-destructive' : ''}
                    />
                    {errors.company && <p className="text-sm text-destructive">{errors.company}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="e.g., Lagos, Nigeria or Remote"
                      className={errors.location ? 'border-destructive' : ''}
                    />
                    {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary Range (Optional)</Label>
                    <Input
                      id="salary"
                      value={formData.salary}
                      onChange={(e) => handleChange('salary', e.target.value)}
                      placeholder="e.g., $60,000 - $80,000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobType">Job Type *</Label>
                    <Select
                      value={formData.jobType}
                      onValueChange={(v) => handleChange('jobType', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FULL_TIME">Full-time</SelectItem>
                        <SelectItem value="PART_TIME">Part-time</SelectItem>
                        <SelectItem value="CONTRACT">Contract</SelectItem>
                        <SelectItem value="FREELANCE">Freelance</SelectItem>
                        <SelectItem value="INTERNSHIP">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-3 pt-8">
                    <Switch
                      id="remote"
                      checked={formData.remote}
                      onCheckedChange={(v) => handleChange('remote', v)}
                    />
                    <Label htmlFor="remote">This is a remote position</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applicationUrl">Application URL *</Label>
                  <Input
                    id="applicationUrl"
                    type="url"
                    value={formData.applicationUrl}
                    onChange={(e) => handleChange('applicationUrl', e.target.value)}
                    placeholder="https://company.com/careers/apply"
                    className={errors.applicationUrl ? 'border-destructive' : ''}
                  />
                  {errors.applicationUrl && <p className="text-sm text-destructive">{errors.applicationUrl}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    placeholder="hr@company.com"
                    className={errors.contactEmail ? 'border-destructive' : ''}
                  />
                  <p className="text-sm text-muted-foreground">We'll notify you when your listing is approved.</p>
                  {errors.contactEmail && <p className="text-sm text-destructive">{errors.contactEmail}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                    placeholder="e.g., Tech, Marketing, Finance, Leadership"
                  />
                  <p className="text-sm text-muted-foreground">Help candidates find your listing with relevant tags.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={6}
                    placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                    className={errors.description ? 'border-destructive' : ''}
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements (Optional)</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => handleChange('requirements', e.target.value)}
                    rows={4}
                    placeholder="List key qualifications, skills, and experience required..."
                  />
                </div>

                <div className="border-t pt-6">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full font-display uppercase tracking-wider"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Job for Review'}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    By submitting, you agree to our posting guidelines. Jobs are typically reviewed within 24-48 hours.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
