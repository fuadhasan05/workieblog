import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import jobsIllustration from '@/assets/jobs-watercolor-african.png';

// Sample featured jobs - in production, fetch from API
const featuredJobs = [
  {
    id: '1',
    title: 'Junior Software Developer',
    company: 'Flutterwave',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    isRemote: true,
  },
  {
    id: '2',
    title: 'Marketing Associate',
    company: 'Paystack',
    location: 'Nairobi, Kenya',
    type: 'Full-time',
    isRemote: false,
  },
  {
    id: '3',
    title: 'Product Design Intern',
    company: 'Andela',
    location: 'Remote - Africa',
    type: 'Internship',
    isRemote: true,
  },
];

export function OpenJobsSection() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            HOT OPPORTUNITIES
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Fresh roles for African talent</p>
        </div>
        <Link to="/jobs">
          <Button variant="ghost" className="gap-2 font-display uppercase tracking-wider">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Illustration */}
        <div className="hidden lg:flex items-center justify-center">
          <img 
            src={jobsIllustration} 
            alt="African professionals collaborating" 
            className="w-full max-w-[200px] h-auto object-contain"
          />
        </div>

        {/* Job cards */}
        {featuredJobs.map((job) => (
          <Link
            key={job.id}
            to={`/jobs/${job.id}`}
            className="group bg-card border border-border rounded-lg p-5 hover:shadow-lg transition-all duration-300 hover:border-primary/30"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              {job.isRemote && (
                <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded-full font-medium">
                  Remote
                </span>
              )}
            </div>
            
            <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
              {job.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-3">{job.company}</p>
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {job.type}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link to="/post-job">
          <Button variant="outline" className="font-display uppercase tracking-wider">
            Post a Job
          </Button>
        </Link>
      </div>
    </section>
  );
}
