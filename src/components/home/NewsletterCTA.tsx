import { useState } from 'react';
import { Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api/client';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await apiClient.post('/subscribers', { 
        email,
        source: 'newsletter_cta'
      });

      toast({
        title: "You're in! 🎉",
        description: "Welcome to the Workie community! Check your inbox for confirmation.",
      });
      setEmail('');
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mb-12">
      <div className="relative bg-gradient-to-br from-primary via-primary to-accent p-8 md:p-12 text-center overflow-hidden rounded-lg">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            <div className="bg-background/20 backdrop-blur-sm p-4 rounded-full">
              <Mail className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
            CAREER TIPS IN YOUR INBOX
          </h2>
          <p className="text-primary-foreground/90 mb-6 max-w-lg mx-auto">
            Get the best career advice, success stories, and industry insights delivered weekly. 
            Join thousands of ambitious women leveling up their careers.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="flex-1 relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/95 text-foreground rounded-lg border-2 border-transparent focus:border-white focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg transition-all duration-300 group-hover:shadow-xl disabled:opacity-70"
                disabled={isSubmitting}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="font-display uppercase tracking-wider bg-foreground text-background hover:bg-foreground/90 gap-2 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Joining...
                </div>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Subscribe
                </>
              )}
            </Button>
          </form>

          <p className="text-primary-foreground/60 text-xs mt-4">
            No spam, unsubscribe anytime. We respect your inbox.
          </p>
        </div>
      </div>
    </section>
  );
}