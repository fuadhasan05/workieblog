import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, Mail, Megaphone, BarChart3, Target, Zap, Clock, Sparkles } from 'lucide-react';
import pageAdvertise from '@/assets/page-advertise.png';

const stats = [
  { label: 'Monthly Web & Social Traffic', value: '1.3M+' },
  { label: 'Monthly Impressions on Instagram', value: '4.5M+' },
  { label: 'Newsletter Subscribers', value: '250K+' },
  { label: 'Cross Platform Reach', value: '10M+' },
];

const clients = [
  'Zikoko', 'Bolt', 'Moniepoint', 'Flutterwave', 'PiggyVest', 'RemotePass',
  'Earnipay', 'AltSchool', 'Shuttlers', 'ALX', 'TechCabal', 'Bamboo'
];

const whyPartner = [
  {
    icon: Users,
    title: 'We Attract Captive Audiences',
    description: 'Reach highly engaged millennial and Gen Z audiences across our products and platforms.',
  },
  {
    icon: Sparkles,
    title: 'High Impact & Memorable Campaigns',
    description: 'We create authentic and creative campaigns that cannot be replicated by any other publisher.',
  },
  {
    icon: TrendingUp,
    title: 'Relevant & Timely Branded Content',
    description: 'We seamlessly incorporate our clients into organic, trending moments for optimal engagement.',
  },
  {
    icon: Clock,
    title: "We're Flexible & Fast",
    description: 'Have a quick turnaround? We can develop and launch custom programming within 24 hours.',
  },
];

const adFormats = [
  {
    icon: Mail,
    title: 'Newsletter Sponsorship',
    description: 'Reach our engaged audience of 100K+ professionals directly in their inbox with dedicated or sponsored newsletter placements.',
  },
  {
    icon: Megaphone,
    title: 'Display Advertising',
    description: 'Premium banner placements across our website with high visibility and targeted reach to career-focused professionals.',
  },
  {
    icon: Target,
    title: 'Sponsored Content',
    description: 'Native articles and branded content that resonates with our audience while highlighting your brand story.',
  },
  {
    icon: BarChart3,
    title: 'Custom Campaigns',
    description: 'Tailored multi-channel campaigns combining newsletter, web, and social to maximize your brand impact.',
  },
];

export default function Advertise() {
  return (
    <Layout>
      {/* Hero Section with Illustration */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-coral-50 to-gold-100 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Partner With CareerBuddy
              </h1>
              <p className="text-foreground/80 text-lg md:text-xl max-w-2xl mb-8">
                Connect your brand with Africa's most engaged community of ambitious professionals and career-focused individuals.
              </p>
              <Button 
                size="lg" 
                className="font-display uppercase tracking-wider"
                onClick={() => window.location.href = 'mailto:advertise@careerbuddyhq.com'}
              >
                Get in Touch
              </Button>
            </div>
            <div className="hidden lg:flex justify-center">
              <img 
                src={pageAdvertise} 
                alt="Woman with megaphone and marketing charts" 
                className="w-full max-w-md h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground text-sm mb-6 uppercase tracking-wider">
            Trusted by Industry Leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {clients.map((client) => (
              <span key={client} className="text-muted-foreground font-medium text-sm md:text-base">
                {client}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Partner With Us?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Partner with CareerBuddy and craft a narrative that propels your organization into the hearts and minds of Africa's most coveted professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {whyPartner.map((item) => (
              <Card key={item.title} className="border-0 shadow-sm">
                <CardContent className="p-6 flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Brands Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-medium uppercase tracking-wider mb-2">
              Reach Your Target Audience
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Our Media Brands
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-display text-2xl font-bold mb-3">CareerBuddy</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  CareerBuddy's digital community provides relatable & engaging content to a community of over 70k young professionals to help them grow and thrive in their careers. We curate content that offers our audience access to opportunities and resources to help them build a satisfying career and life.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a href="https://www.instagram.com/careerbuddyhq/" target="_blank" rel="noopener noreferrer" className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors">
                    Instagram
                  </a>
                  <a href="https://careerbuddynewsletter.substack.com/" target="_blank" rel="noopener noreferrer" className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors">
                    Newsletter
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-display text-2xl font-bold mb-3">WorkHERholic</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  At WorkHERholic, we drive conversation and inspire action for our community of African millennial and Gen-Z women who are daily crushing goals and looking for opportunities to connect, learn, and thrive! We are perfect for the African woman who wants to get ahead in her career and have fun while at it.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a href="https://www.instagram.com/workherholic/" target="_blank" rel="noopener noreferrer" className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors">
                    Instagram
                  </a>
                  <a href="https://workherholic.substack.com/" target="_blank" rel="noopener noreferrer" className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors">
                    Newsletter
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ad Formats Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Advertising Options
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from a variety of formats to best showcase your brand and reach your goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {adFormats.map((format) => (
              <Card key={format.title} className="border-0 shadow-sm">
                <CardContent className="p-6 flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <format.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">{format.title}</h3>
                    <p className="text-muted-foreground text-sm">{format.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Reach Our Audience?
          </h2>
          <p className="text-background/70 max-w-xl mx-auto mb-8">
            Let's discuss how we can help you connect with Africa's most ambitious professionals. Reach out to our partnerships team today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="font-display uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => window.location.href = 'mailto:advertise@careerbuddyhq.com'}
            >
              Email Us
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="font-display uppercase tracking-wider border-background text-background hover:bg-background hover:text-foreground"
              onClick={() => window.location.href = 'mailto:advertise@careerbuddyhq.com?subject=Media Kit Request'}
            >
              Request Media Kit
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
