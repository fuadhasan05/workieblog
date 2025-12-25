import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logo from '@/assets/logo-workie.png';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background">
      {/* Top banner - girlboss style yellow */}
      <div className="bg-secondary text-foreground py-2 text-center text-sm">
        <span className="uppercase tracking-wide">
          FINALLY, AN EMAIL YOU'LL ACTUALLY LOOK FORWARD TO.{' '}
        </span>
        <Link to="/newsletters" className="underline font-semibold hover:no-underline">
          SUBSCRIBE
        </Link>
        <span> TO US TODAY!</span>
      </div>

      {/* Secondary nav */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-end gap-6 py-2 text-sm">
            <Link to="/member/login" className="hover:text-primary transition-colors">
              Account
            </Link>
            <span className="text-muted-foreground">Cart (0)</span>
            <span className="text-muted-foreground">Checkout</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img 
                src={logo} 
                alt="Workie" 
                className="h-6 md:h-8 w-auto object-contain dark:brightness-0 dark:invert" 
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 outline-none">
                  READ
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-background border border-border shadow-lg z-50">
                  <DropdownMenuItem asChild>
                    <Link to="/category/career" className="cursor-pointer">Career</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/category/success-stories" className="cursor-pointer">Success Stories</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/category/wellness" className="cursor-pointer">Wellness</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/category/trends" className="cursor-pointer">Trends</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/category/money" className="cursor-pointer">Money</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                to="/newsletters"
                className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                NEWSLETTER
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 outline-none">
                  COURSES
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-background border border-border shadow-lg z-50">
                  <DropdownMenuItem asChild>
                    <Link to="/courses" className="cursor-pointer">All Courses</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/videos" className="cursor-pointer">Watch Now</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                to="/jobs"
                className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                OPEN JOBS
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 outline-none">
                  RESOURCES
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-background border border-border shadow-lg z-50">
                  <DropdownMenuItem asChild>
                    <Link to="/resources" className="cursor-pointer">Free Resources</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/about" className="cursor-pointer">About Us</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Search and actions */}
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <Input
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-40 lg:w-48 h-9 text-sm"
                />
                <Button type="submit" variant="ghost" size="icon" className="h-9 w-9 -ml-9">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <ThemeToggle />
              <Link to="/pricing">
                <Button variant="link" className="text-sm font-medium underline">
                  SUBSCRIBE
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background border-b border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-4">
            <form onSubmit={handleSearch} className="mb-4">
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </form>
            <Link
              to="/category/career"
              className="block py-3 text-sm font-medium border-b border-border"
              onClick={() => setIsMenuOpen(false)}
            >
              Career
            </Link>
            <Link
              to="/category/success-stories"
              className="block py-3 text-sm font-medium border-b border-border"
              onClick={() => setIsMenuOpen(false)}
            >
              Success Stories
            </Link>
            <Link
              to="/category/wellness"
              className="block py-3 text-sm font-medium border-b border-border"
              onClick={() => setIsMenuOpen(false)}
            >
              Wellness
            </Link>
            <Link
              to="/newsletters"
              className="block py-3 text-sm font-medium border-b border-border"
              onClick={() => setIsMenuOpen(false)}
            >
              Newsletter
            </Link>
            <Link
              to="/courses"
              className="block py-3 text-sm font-medium border-b border-border"
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              to="/jobs"
              className="block py-3 text-sm font-medium border-b border-border"
              onClick={() => setIsMenuOpen(false)}
            >
              Open Jobs
            </Link>
            <Link
              to="/resources"
              className="block py-3 text-sm font-medium border-b border-border"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <div className="pt-4 flex flex-col gap-2">
              <Link to="/pricing" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Subscribe</Button>
              </Link>
              <Link to="/member/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
