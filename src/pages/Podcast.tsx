import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Clock, Calendar, Headphones } from 'lucide-react';

const episodes = [
  {
    id: '1',
    title: 'Breaking Into Tech: A Conversation with Ire Aderinokun',
    description: 'Ire shares her journey from self-taught developer to leading one of Africa\'s biggest tech communities.',
    duration: '45:32',
    date: '2024-01-15',
    thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
    guest: 'Ire Aderinokun',
    guestTitle: 'VP Engineering, Buycoins',
  },
  {
    id: '2',
    title: 'The Art of Negotiation: Getting What You Deserve',
    description: 'Career coach Funke Bucknor-Obruthe breaks down the strategies that helped her clients secure 40%+ raises.',
    duration: '38:15',
    date: '2024-01-08',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    guest: 'Funke Bucknor-Obruthe',
    guestTitle: 'Founder, Zapphaire Events',
  },
  {
    id: '3',
    title: 'From Corporate to Entrepreneur: Making the Leap',
    description: 'Tara Fela-Durotoye shares the fears, failures, and triumphs of building House of Tara.',
    duration: '52:18',
    date: '2024-01-01',
    thumbnail: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop',
    guest: 'Tara Fela-Durotoye',
    guestTitle: 'Founder, House of Tara',
  },
  {
    id: '4',
    title: 'Building Wealth: Investment Strategies for Beginners',
    description: 'Tomie Balogun demystifies investing and shares practical tips for growing your money.',
    duration: '41:45',
    date: '2023-12-25',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=400&fit=crop',
    guest: 'Tomie Balogun',
    guestTitle: 'Founder, Mosabi',
  },
  {
    id: '5',
    title: 'Leadership Lessons from the C-Suite',
    description: 'Ibukun Awosika reflects on her journey to becoming the first female chairman of First Bank.',
    duration: '48:22',
    date: '2023-12-18',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop',
    guest: 'Ibukun Awosika',
    guestTitle: 'Former Chairman, First Bank',
  },
  {
    id: '6',
    title: 'Work-Life Integration: A New Approach',
    description: 'Dr. Ola Brown discusses managing a demanding career while prioritizing mental health.',
    duration: '36:50',
    date: '2023-12-11',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
    guest: 'Dr. Ola Brown',
    guestTitle: 'Founder, Flying Doctors Nigeria',
  },
];

export default function Podcast() {
  return (
    <Layout>
      <SEO 
        title="Podcast"
        description="Listen to inspiring conversations with successful African women sharing their career journeys, lessons learned, and advice for ambitious professionals."
      />
      
      {/* Hero Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Headphones className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            The WorkHERholic Podcast
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Real conversations with inspiring African women. Career stories, lessons learned, and advice you can actually use.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="secondary" className="font-display uppercase tracking-wider">
              Apple Podcasts
            </Button>
            <Button variant="secondary" className="font-display uppercase tracking-wider">
              Spotify
            </Button>
            <Button variant="secondary" className="font-display uppercase tracking-wider">
              Google Podcasts
            </Button>
          </div>
        </div>
      </section>

      {/* Episodes Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-foreground mb-8">
            Latest Episodes
          </h2>
          
          <div className="space-y-6">
            {episodes.map((episode) => (
              <Card key={episode.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 md:h-48 flex-shrink-0">
                      <img 
                        src={episode.thumbnail} 
                        alt={episode.guest}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(episode.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {episode.duration}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">
                        {episode.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {episode.description}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-foreground">{episode.guest}</p>
                          <p className="text-sm text-muted-foreground">{episode.guestTitle}</p>
                        </div>
                        <Button size="sm" className="font-display uppercase tracking-wider">
                          <Play className="w-4 h-4 mr-2" />
                          Listen Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Never Miss an Episode
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Subscribe to get notified when new episodes drop, plus exclusive behind-the-scenes content.
          </p>
          <Button size="lg" className="font-display uppercase tracking-wider">
            Subscribe to Podcast Updates
          </Button>
        </div>
      </section>
    </Layout>
  );
}
