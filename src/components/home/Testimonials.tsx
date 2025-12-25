import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "WorkHERholic's salary negotiation guide helped me secure a 35% raise. I never would have had the confidence without it.",
    name: 'Adaora N.',
    role: 'Product Manager, Lagos',
  },
  {
    quote: "Finally, career content that understands the African context. This newsletter is my Monday morning ritual.",
    name: 'Naledi M.',
    role: 'Marketing Director, Johannesburg',
  },
  {
    quote: "The community here is incredible. I've found mentors, job referrals, and lifelong friends.",
    name: 'Amina K.',
    role: 'Software Engineer, Nairobi',
  },
];

export function Testimonials() {
  return (
    <section className="py-16 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">What Our Community Says</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join 250,000+ ambitious women who trust WorkHERholic for career guidance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="border border-border/50 bg-card/50 backdrop-blur-sm hover-border-glow transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Quote className="w-5 h-5 text-white" />
                </div>
                <p className="text-foreground mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-border/50 pt-4">
                  <p className="font-display font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
