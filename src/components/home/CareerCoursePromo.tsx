import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import careerIllustration from '@/assets/career-watercolor.png';

export function CareerCoursePromo() {
  return (
    <section className="mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Left side - Purple banner */}
        <div className="bg-primary p-8 md:p-10 relative overflow-hidden">
          <h2 className="font-display text-3xl md:text-4xl text-primary-foreground leading-tight">
            <span className="italic">Designing</span> the Next
            <br />
            <span className="italic">Chapter</span> of Your <span className="italic">Career</span>
          </h2>
        </div>

        {/* Middle - Description */}
        <div className="space-y-5">
          <p className="text-foreground/80 leading-relaxed">
            Ready for some career therapy? We created this course in collaboration with executive coach 
            to help you get unstuck and find your true career calling. Your next professional milestone 
            is closer than you think.
          </p>
          <Link to="/courses">
            <Button variant="outline" className="font-display uppercase tracking-wider px-8">
              Learn More
            </Button>
          </Link>
        </div>

        {/* Right side - Illustration */}
        <div className="hidden lg:flex justify-center">
          <img 
            src={careerIllustration} 
            alt="Woman working on laptop" 
            className="w-64 h-64 object-contain"
          />
        </div>
      </div>
    </section>
  );
}
