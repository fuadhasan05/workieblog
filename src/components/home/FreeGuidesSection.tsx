import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import guideCV from '@/assets/guide-cv-watercolor.png';
import guideResilience from '@/assets/guide-resilience-watercolor.png';
import guidePlanner from '@/assets/guide-planner-watercolor.png';
import guideSalary from '@/assets/guide-salary-watercolor.png';

const guides = [
  {
    id: '1',
    title: 'CV That Gets Callbacks',
    subtitle: 'Stand out from 1000+ applicants',
    gradient: 'from-primary/20 via-accent/10 to-mint/20',
    image: guideCV,
  },
  {
    id: '2',
    title: 'Bouncing Back from Rejection',
    subtitle: 'Got the "we regret to inform you" email? Here\'s what to do',
    gradient: 'from-navy/10 via-primary/10 to-mint/20',
    image: guideResilience,
  },
  {
    id: '3',
    title: 'Career Planner Template',
    subtitle: 'Map your next 90 days of career moves',
    gradient: 'from-mint/20 via-accent/10 to-primary/20',
    image: guidePlanner,
  },
  {
    id: '4',
    title: 'Salary Negotiation Script',
    subtitle: 'Know your worth and ask for it',
    gradient: 'from-accent/20 via-primary/10 to-navy/10',
    image: guideSalary,
  },
];

export function FreeGuidesSection() {
  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2 font-bold">
          Free Career Toolkits
        </h2>
        <p className="text-muted-foreground mb-4">Actionable resources to level up your career game</p>
        <Link 
          to="/resources" 
          className="inline-flex items-center gap-1 text-sm font-display uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
        >
          Get All Resources
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {guides.map((guide) => (
          <Link
            key={guide.id}
            to={`/resources/${guide.id}`}
            className="group block"
          >
            <div className={`aspect-square rounded-xl bg-gradient-to-br ${guide.gradient} p-4 flex flex-col justify-between mb-3 group-hover:shadow-lg transition-shadow duration-300 overflow-hidden relative`}>
              <img 
                src={guide.image} 
                alt={guide.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-2 rounded">
                <h3 className="font-display text-base md:text-lg font-semibold text-foreground leading-tight">
                  {guide.title.split(' ').slice(0, 3).join(' ')}
                  <br />
                  <span className="text-primary">{guide.title.split(' ').slice(3).join(' ')}</span>
                </h3>
              </div>
            </div>
            <h4 className="font-display text-base italic text-foreground mb-1">
              {guide.title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {guide.subtitle}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
