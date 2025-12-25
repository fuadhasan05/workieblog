import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Heart, Users, Lightbulb, Globe, Rocket, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const values = [
  {
    icon: Heart,
    title: 'Authentic',
    description: 'We talk about real struggles, acknowledge systemic issues, and share genuine success stories. No toxic positivity here.',
  },
  {
    icon: Zap,
    title: 'Action-Oriented',
    description: 'Every piece of content has clear takeaways. We provide specific tactics, not just theory—checklists, templates, frameworks.',
  },
  {
    icon: Users,
    title: 'Relatable',
    description: 'We speak as peers, not professors. We understand the unique African context and shared cultural moments.',
  },
  {
    icon: TrendingUp,
    title: 'Empowering',
    description: 'We position you as capable and resourceful. We provide tools for independence, never patronizing.',
  },
];

const stats = [
  { number: '200K+', label: 'Newsletter Subscribers' },
  { number: '300+', label: 'Global Placements' },
  { number: '10M+', label: 'Cross-Platform Reach' },
  { number: '15+', label: 'African Countries' },
];

const milestones = [
  { year: '2019', event: 'Founded with a mission to help African graduates land meaningful opportunities' },
  { year: '2020', event: 'Launched our first newsletter, reaching 10,000 subscribers in 6 months' },
  { year: '2021', event: 'Achieved first 100 global placements for African talent' },
  { year: '2022', event: 'Reached 100,000+ newsletter subscribers milestone' },
  { year: '2023', event: 'Launched job board with 300+ successful placements' },
  { year: '2024', event: 'Rebranded as Workie—the definitive career companion for African Gen-Z' },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-sunrise py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-primary/10 text-primary text-sm font-display uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              About Workie
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6">
              Your Career Starts Here
            </h1>
            <p className="text-foreground/80 text-lg md:text-xl max-w-2xl mx-auto">
              The trusted friend who helps African Gen-Z navigate the chaos of early career with real talk, real opportunities, and real results.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-navy text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-extrabold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
              The Workie Story
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                Let's be real—navigating your first job search in Africa can feel like trying to find your way through Lagos traffic with no Google Maps. You're told to "network," but no one explains how. You're told to "build skills," but which ones actually matter? You send 50 applications and hear back from... maybe 2.
              </p>
              <p>
                We've been there. That frustration, that confusion, that feeling of being left out of some secret career playbook that everyone else seems to have—that's exactly why Workie exists.
              </p>
              <p>
                What started as a newsletter sharing real career advice (not the corporate fluff) has grown into a movement. With 300+ global placements and a community of 200,000+ ambitious students and recent graduates across Africa, we've proven that African talent doesn't need handouts—we need access to the same opportunities and intel that others take for granted.
              </p>
              <p className="font-semibold text-foreground">
                Workie is here to be that friend who's already figured it out and is pulling you up with them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-stretch max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg bg-background">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                    <Target className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">Our Mission</h2>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To empower <span className="font-semibold text-foreground">10 million African students and recent graduates</span> to land meaningful opportunities and build careers without borders.
                </p>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground italic">
                    "Get the career clarity and real opportunities that campus career centers can't provide."
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-navy text-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                    <Rocket className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h2 className="font-display text-2xl font-bold">Our Vision</h2>
                </div>
                <p className="text-white/80 text-lg leading-relaxed">
                  Every African Gen-Z knows Workie before they write their first CV.
                </p>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-sm text-white/60 italic">
                    500K newsletter subscribers, 2M Instagram followers, 100K monthly job board users by 2026.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Brand Personality Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How We Show Up
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're not your typical career platform. Here's what makes Workie different.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="border-0 shadow-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-sunrise rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Workie Ecosystem
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to navigate your career journey, all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-sm text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">Newsletter</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Weekly career intel, job alerts, and success stories. Real talk, no fluff.
                </p>
                <p className="text-primary font-semibold">200K+ subscribers</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-mint/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-mint" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">Job Board</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Curated opportunities from Lagos to London, Nairobi to New York.
                </p>
                <p className="text-mint font-semibold">300+ placements</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">Community</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Connect with ambitious peers, mentors, and industry insiders.
                </p>
                <p className="text-accent font-semibold">10M+ reach</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Journey So Far
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {milestone.year}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 flex-1 bg-primary/20 mt-2" />
                    )}
                  </div>
                  <div className="pb-6 pt-3">
                    <p className="text-foreground">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-sunrise">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Ready to Level Up Your Career?
          </h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8">
            Join 200,000+ African Gen-Z students and graduates who are getting real career intel, landing opportunities, and building careers without borders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/newsletters">
              <Button size="lg" className="font-display uppercase tracking-wider px-8">
                Join the Newsletter
              </Button>
            </Link>
            <Link to="/jobs">
              <Button size="lg" variant="outline" className="font-display uppercase tracking-wider px-8 bg-background/80">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
