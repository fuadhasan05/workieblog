import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo-workie.png';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
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
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          source: 'footer_newsletter',
          subscribed_at: new Date().toISOString()
        }),
      });

      if (response.ok) {
        toast({
          title: "Welcome to Workie! 🎉",
          description: "You've successfully joined 200K+ African Gen-Z professionals!",
        });
        setEmail('');
      } else {
        const error = await response.json();
        toast({
          title: "Subscription failed",
          description: error.message || "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Please check your connection and try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter Section */}
      <div className="relative bg-gradient-sunrise py-12 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mail className="w-6 h-6 text-primary-foreground" />
            <h3 className="font-display text-3xl md:text-4xl font-extrabold text-primary-foreground">
              JOIN 200K+ AFRICAN GEN-Z
            </h3>
          </div>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Career intel, job alerts, and success stories. Real talk for real careers.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <div className="flex-1 relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-5 py-4 bg-white text-gray-900 rounded-xl border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/50 shadow-lg placeholder-gray-500 text-base font-medium transition-all duration-300 group-hover:shadow-xl"
                disabled={isSubmitting}
                required
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="font-display uppercase tracking-wider bg-navy text-white hover:bg-navy/90 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-base font-bold rounded-xl min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed"
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
          <p className="text-primary-foreground/70 text-sm mt-4 max-w-md mx-auto">
            Join Africa's largest career community. No spam, just career growth. 🚀
          </p>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img 
                src={logo} 
                alt="Workie" 
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-background/70 text-sm mb-4">
              The trusted career companion for African Gen-Z. Real talk, real opportunities, real results.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/workie" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background/10 hover:bg-primary hover:scale-110 transition-all duration-300" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/workie" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background/10 hover:bg-primary hover:scale-110 transition-all duration-300" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/workie" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background/10 hover:bg-primary hover:scale-110 transition-all duration-300" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/@workie" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background/10 hover:bg-primary hover:scale-110 transition-all duration-300" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display text-lg font-bold mb-4 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/category/career" className="text-background/70 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Career
                </Link>
              </li>
              <li>
                <Link to="/category/success-stories" className="text-background/70 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/category/wellness" className="text-background/70 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Wellness
                </Link>
              </li>
              <li>
                <Link to="/category/money" className="text-background/70 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Money
                </Link>
              </li>
              <li>
                <Link to="/podcast" className="text-background/70 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Podcast
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-background/70 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Job Board
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-lg font-bold mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/resources" className="text-background/70 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Free Resources
                </Link>
              </li>
              <li>
                <Link to="/newsletters" className="text-background/70 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Newsletters
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-background/70 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="text-background/70 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Advertise
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-background/70 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-lg font-bold mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-background/70 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-background/70 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-background/70 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-background/20 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
          <p>© {new Date().getFullYear()} Workie. All rights reserved.</p>
          <p className="text-xs">Made with 🧡 for African talent everywhere</p>
        </div>
      </div>
    </footer>
  );
}
