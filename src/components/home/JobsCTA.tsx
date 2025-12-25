import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import jobsIllustration from '@/assets/jobs-cta-watercolor.png';

export function JobsCTA() {
  return (
    <section className="mb-16 py-16 bg-navy/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left illustration */}
          <div className="hidden lg:flex justify-center">
            <img 
              src={jobsIllustration} 
              alt="Career opportunity illustration" 
              className="w-48 h-48 object-contain transform -scale-x-100"
            />
          </div>

          {/* Center content */}
          <div className="text-center">
            <span className="inline-block bg-primary/10 text-primary text-xs font-display uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Workie Jobs
            </span>
            
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 leading-tight font-extrabold">
              Ready to
              <br />
              <span className="text-primary">Land The Bag</span>?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              300+ global placements and counting. From Lagos to London, Nairobi to New York.
            </p>
            
            <Link to="/jobs">
              <Button size="lg" className="font-display uppercase tracking-widest px-10">
                Find Opportunities
              </Button>
            </Link>
          </div>

          {/* Right illustration */}
          <div className="hidden lg:flex justify-center">
            <img 
              src={jobsIllustration} 
              alt="Career growth illustration" 
              className="w-48 h-48 object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
