import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api/client';
import { Mail } from 'lucide-react';
import heroNewsletter from '@/assets/hero-african-watercolor.png';

export function HeroNewsletter() {
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
        source: 'hero_newsletter'
      });

      toast({
        title: "Welcome to Workie! 🎉",
        description: "You've successfully joined 200K+ African Gen-Z professionals!",
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
    <section className="relative overflow-hidden min-h-[400px] md:min-h-[450px]">
      {/* Light fade gradient background - WorkHERholic style */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-orange-50/80 to-amber-50/60" />
      
      {/* Subtle soft glow effects */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-[50%] h-[70%] bg-rose-100/50 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] right-0 w-[40%] h-[60%] bg-orange-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-[20%] w-[50%] h-[50%] bg-amber-100/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          {/* Left side - Headline */}
          <div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight font-extrabold">
              Your Career
              <br />
              <span className="text-primary">Starts Here</span>
            </h1>
          </div>

          {/* Middle - Description and form */}
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="font-semibold text-foreground text-lg">
                Real talk. Real opportunities. Real results.
              </p>
              <p className="text-foreground/80">
                Career intel, job opportunities, and success stories for African Gen-Z navigating the 
                education-to-career transition. No fluff, just actionable advice.
              </p>
              <p className="italic text-foreground/70 font-display">
                Join 200,000+ ambitious students and grads across Africa.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <div className="flex-1 relative group">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-lg shadow-lg transition-all duration-300 group-hover:shadow-xl text-base"
                  disabled={isSubmitting}
                  required
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 min-w-[120px] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Joining...
                  </div>
                ) : (
                  'Join Workie'
                )}
              </Button>
            </form>

            <p className="text-xs text-foreground/60">
              By subscribing, you agree to receive the Workie newsletter. Unsubscribe anytime.
            </p>
          </div>

          {/* Right side - Illustration */}
          <div className="hidden lg:flex justify-center">
            <img 
              src={heroNewsletter} 
              alt="Career growth illustration" 
              className="w-64 h-64 object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
