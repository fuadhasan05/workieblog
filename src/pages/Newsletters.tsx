import { Layout } from '@/components/layout/Layout';
import { ArrowRight } from 'lucide-react';
import pageNewsletters from '@/assets/page-newsletters.png';

const newsletters = [
  {
    title: 'WorkHERHolic',
    description: 'The Sidekick For Every Ambitious African Woman Looking To Level Up.',
    url: 'https://www.workherholic.com/',
  },
  {
    title: 'GoFigure',
    description: 'For marketing, CX, and business professionals who rely on numbers to win.',
    url: 'https://salesmogul.substack.com/',
  },
  {
    title: 'CoCreate',
    description: "Deep dive into the latest tech trends, leadership strategies, and success stories shaping Africa's digital future",
    url: 'https://cocreatebycareerbuddy.substack.com/',
  },
  {
    title: 'New Local',
    description: 'Navigate the job market, connect with your community, and unlock your potential as a new immigrant in Canada',
    url: 'https://newlocal.beehiiv.com/',
  },
  {
    title: 'Workie',
    description: 'We empower new graduates and entry-level professionals with the tools and resources to build a high-impact career.',
    url: 'https://workie.substack.com/',
  },
  {
    title: 'Workshift',
    description: 'Helping startup founders stay ahead of the curve with expert insights on workplace trends and eco-friendly business practices.',
    url: 'https://bit.ly/workshiftbycb',
  },
];

export default function Newsletters() {
  return (
    <Layout>
      {/* Hero Section with Illustration */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-100 via-lavender-50 to-peach-100 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Supercharge your career<br />with CareerBuddy Daily
              </h1>
              <p className="text-foreground/80 text-lg md:text-xl max-w-2xl">
                Super Relatable. Zero Fluff. Read by over 100k African professionals globally
              </p>
            </div>
            <div className="hidden lg:flex justify-center">
              <img 
                src={pageNewsletters} 
                alt="Woman reading newsletter on phone" 
                className="w-full max-w-md h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Cards */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsletters.map((newsletter) => (
              <div
                key={newsletter.title}
                className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {newsletter.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 min-h-[60px]">
                  {newsletter.description}
                </p>
                <a
                  href={newsletter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
