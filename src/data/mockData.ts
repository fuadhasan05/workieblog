export type Category = 'career' | 'success-stories' | 'wellness' | 'money' | 'trends';

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: Category;
  author: Author;
  publishedAt: string;
  readTime: number;
  isFeatured?: boolean;
  isPremium?: boolean;
  tags?: string[];
  views?: number;
}

export interface Video {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  category: Category;
  duration: string;
  publishedAt: string;
  views: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export const tags: Tag[] = [
  { id: '1', name: 'Salary', slug: 'salary' },
  { id: '2', name: 'Negotiation', slug: 'negotiation' },
  { id: '3', name: 'Career Growth', slug: 'career-growth' },
  { id: '4', name: 'Entrepreneurship', slug: 'entrepreneurship' },
  { id: '5', name: 'Remote Work', slug: 'remote-work' },
  { id: '6', name: 'Mental Health', slug: 'mental-health' },
  { id: '7', name: 'Money Management', slug: 'money-management' },
  { id: '8', name: 'Side Hustle', slug: 'side-hustle' },
  { id: '9', name: 'Leadership', slug: 'leadership' },
  { id: '10', name: 'Work-Life Balance', slug: 'work-life-balance' },
];

export const authors: Author[] = [
  {
    id: '1',
    name: 'Grace Ikpang',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop',
    bio: 'Founder & CEO at WorkHERholic',
  },
  {
    id: '2',
    name: 'Adaeze Okonkwo',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    bio: 'Head of Content & Community',
  },
  {
    id: '3',
    name: 'Amara Eze',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    bio: 'Career Coach & Writer',
  },
];

export const articles: Article[] = [
  {
    id: '1',
    slug: 'how-to-negotiate-salary-like-a-boss',
    title: "How To Negotiate Your Salary Like A Boss (And Actually Get What You Deserve)",
    excerpt: "Stop underselling yourself. Here's exactly how to ask for more money—and get it.",
    content: `<p>Let's talk about something that makes most women uncomfortable: asking for more money. Studies show that women are less likely to negotiate their salaries, and when they do, they ask for less than men.</p>
    <p>But here's the thing—negotiation is a skill, not a personality trait. And like any skill, it can be learned.</p>
    <h2>Know Your Worth First</h2>
    <p>Before you walk into any negotiation, you need to know exactly what you're worth. Research salary ranges for your role, your experience level, and your location. Sites like Glassdoor, LinkedIn Salary, and PayScale are your friends.</p>
    <h2>Practice Your Pitch</h2>
    <p>Write down exactly what you want to say. Practice in front of a mirror. Practice with a friend. The more you rehearse, the more confident you'll be.</p>
    <h2>Don't Apologize</h2>
    <p>"Sorry to ask, but..." No. Stop. You're not asking for a favor. You're advocating for fair compensation for the value you bring.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=500&fit=crop',
    category: 'career',
    author: authors[0],
    publishedAt: '2024-01-15T10:00:00Z',
    readTime: 7,
    isFeatured: true,
    tags: ['salary', 'negotiation', 'career-growth'],
    views: 12500,
  },
  {
    id: '2',
    slug: 'she-built-million-dollar-business',
    title: "From Corporate Burnout to CEO: How She Built a Million-Dollar Business",
    excerpt: "Chioma left her banking job with no backup plan. Two years later, she's employing 15 people.",
    content: `<p>When Chioma Nwankwo handed in her resignation letter, her colleagues thought she was crazy. She was on track for promotion, earning well, and had all the markers of success.</p>
    <p>But she was miserable. "I was achieving everyone else's dreams except my own," she says.</p>
    <h2>The Breaking Point</h2>
    <p>It was a Tuesday afternoon when Chioma realized she couldn't do it anymore. She was in a meeting, presenting quarterly results, when she felt nothing. No pride. No excitement. Just emptiness.</p>
    <h2>Taking the Leap</h2>
    <p>"I didn't have a business plan. I just knew I needed to create something that was mine," she recalls.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=500&fit=crop',
    category: 'success-stories',
    author: authors[1],
    publishedAt: '2024-01-14T14:00:00Z',
    readTime: 8,
    isFeatured: true,
    tags: ['entrepreneurship', 'leadership', 'career-growth'],
    views: 18300,
  },
  {
    id: '3',
    slug: 'work-life-balance-myth',
    title: "Work-Life Balance Is A Myth—Here's What To Focus On Instead",
    excerpt: "Why chasing 'balance' is making you more stressed, and what actually works.",
    content: `<p>We've all heard it: "You need better work-life balance." But let's be honest—has anyone actually achieved this mythical state?</p>
    <p>The truth is, balance implies equal distribution. But life doesn't work in neat 50/50 splits.</p>
    <h2>The Problem With "Balance"</h2>
    <p>When we chase balance, we're setting ourselves up for failure. Some weeks work demands more. Some weeks family does. And that's okay.</p>
    <h2>Try Integration Instead</h2>
    <p>What if, instead of separating work and life, we focused on integrating them in a way that feels authentic?</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop',
    category: 'wellness',
    author: authors[2],
    publishedAt: '2024-01-13T09:00:00Z',
    readTime: 6,
    tags: ['work-life-balance', 'mental-health'],
    views: 9800,
  },
  {
    id: '4',
    slug: 'build-emergency-fund-guide',
    title: "The No-BS Guide To Building Your Emergency Fund (Even On A Tight Budget)",
    excerpt: "Start with what you have. Here's how to build financial security step by step.",
    content: `<p>An emergency fund isn't a luxury—it's freedom. It's the difference between a setback and a crisis.</p>
    <p>But how do you save when there's barely enough to cover your bills?</p>
    <h2>Start Small, Start Now</h2>
    <p>Forget the 6-month emergency fund advice. That's the destination, not the starting point. Begin with ₦10,000. Then ₦50,000. Build from there.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=500&fit=crop',
    category: 'money',
    author: authors[0],
    publishedAt: '2024-01-12T11:00:00Z',
    readTime: 5,
    tags: ['money-management', 'side-hustle'],
    views: 7200,
  },
  {
    id: '5',
    slug: 'remote-work-african-women',
    title: "Remote Work Is Changing Everything For African Women—Here's How To Get In",
    excerpt: "Global companies are hiring. Here's how to position yourself for remote opportunities.",
    content: `<p>The remote work revolution has opened doors that were previously closed. African women are now competing for—and winning—positions at top global companies.</p>
    <h2>Where To Find Remote Jobs</h2>
    <p>Platforms like We Work Remotely, Remote OK, and LinkedIn Remote are your best starting points.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop',
    category: 'trends',
    author: authors[1],
    publishedAt: '2024-01-11T16:00:00Z',
    readTime: 7,
    tags: ['remote-work', 'career-growth'],
    views: 15600,
  },
  {
    id: '6',
    slug: 'imposter-syndrome-guide',
    title: "You're Not A Fraud: A Real Talk Guide To Beating Imposter Syndrome",
    excerpt: "That voice telling you you're not good enough? Let's silence it together.",
    content: `<p>You got the job. You're in the room. But that nagging voice keeps asking: "Do you really belong here?"</p>
    <p>Welcome to imposter syndrome—the uninvited guest at every ambitious woman's success party.</p>
    <h2>Understanding the Voice</h2>
    <p>Imposter syndrome isn't a sign of weakness. It's often a sign that you're pushing yourself into new territory.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=500&fit=crop',
    category: 'career',
    author: authors[2],
    publishedAt: '2024-01-10T08:00:00Z',
    readTime: 6,
    tags: ['mental-health', 'career-growth', 'leadership'],
    views: 11200,
  },
  {
    id: '7',
    slug: 'side-hustle-ideas-2024',
    title: "15 Side Hustles That Actually Make Money In 2024 (Tested By Real Women)",
    excerpt: "Forget the get-rich-quick schemes. These are hustles that actually work.",
    content: `<p>Looking to diversify your income? We surveyed over 500 women to find out which side hustles are actually worth your time.</p>
    <h2>Top 5 Side Hustles</h2>
    <p>1. Freelance writing and content creation<br>2. Virtual assistance<br>3. Social media management<br>4. Online tutoring<br>5. E-commerce and dropshipping</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800&h=500&fit=crop',
    category: 'money',
    author: authors[0],
    publishedAt: '2024-01-09T12:00:00Z',
    readTime: 10,
    isPremium: true,
    tags: ['side-hustle', 'money-management', 'entrepreneurship'],
    views: 22400,
  },
  {
    id: '8',
    slug: 'burnout-recovery-guide',
    title: "I Burned Out At 28. Here's Everything I Learned About Recovery",
    excerpt: "The signs I missed, the mistakes I made, and how I rebuilt my career.",
    content: `<p>I thought burnout was just being tired. I was wrong.</p>
    <p>It started with small things—forgetting meetings, dreading Mondays, crying in the bathroom. Then it became bigger things.</p>
    <h2>The Signs I Missed</h2>
    <p>Looking back, the warning signs were everywhere. I was working 12-hour days and calling it "dedication."</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=500&fit=crop',
    category: 'wellness',
    author: authors[1],
    publishedAt: '2024-01-08T15:00:00Z',
    readTime: 8,
    tags: ['mental-health', 'work-life-balance'],
    views: 14100,
  },
];

export const videos: Video[] = [
  {
    id: '1',
    slug: 'salary-negotiation-masterclass',
    title: "Salary Negotiation Masterclass",
    description: "Everything you need to know about asking for what you deserve.",
    thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'career',
    duration: '15:42',
    publishedAt: '2024-01-14T10:00:00Z',
    views: 234000,
  },
  {
    id: '2',
    slug: 'morning-routine-ceos',
    title: "Morning Routines of Successful African Women CEOs",
    description: "A look into how top executives start their days.",
    thumbnail: 'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'success-stories',
    duration: '12:15',
    publishedAt: '2024-01-13T14:00:00Z',
    views: 456000,
  },
  {
    id: '3',
    slug: 'managing-stress-workplace',
    title: "Managing Stress In High-Pressure Environments",
    description: "Practical techniques for staying calm when work gets intense.",
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'wellness',
    duration: '10:33',
    publishedAt: '2024-01-12T09:00:00Z',
    views: 189000,
  },
  {
    id: '4',
    slug: 'investing-beginners',
    title: "Investing 101: A Beginner's Guide",
    description: "Start building wealth with these simple steps.",
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'money',
    duration: '18:20',
    publishedAt: '2024-01-11T16:00:00Z',
    views: 567000,
  },
];

export const categories = [
  { id: 'career', name: 'Career', slug: 'career' },
  { id: 'success-stories', name: 'Success Stories', slug: 'success-stories' },
  { id: 'wellness', name: 'Wellness', slug: 'wellness' },
  { id: 'money', name: 'Money', slug: 'money' },
  { id: 'trends', name: 'Trends', slug: 'trends' },
];

export const getArticlesByCategory = (category: Category) => 
  articles.filter(article => article.category === category);

export const getFeaturedArticles = () => 
  articles.filter(article => article.isFeatured);

export const getLatestArticles = (limit = 6) => 
  [...articles].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  ).slice(0, limit);

export const getArticleBySlug = (slug: string) => 
  articles.find(article => article.slug === slug);

export const getVideoBySlug = (slug: string) => 
  videos.find(video => video.slug === slug);

export const getTagBySlug = (slug: string) => 
  tags.find(tag => tag.slug === slug);

export const getArticlesByTag = (tagSlug: string) => 
  articles.filter(article => article.tags?.includes(tagSlug));

export const searchArticles = (query: string, categoryFilter?: string) => {
  const searchLower = query.toLowerCase();
  return articles.filter(article => {
    const matchesQuery = !query || 
      article.title.toLowerCase().includes(searchLower) ||
      article.excerpt.toLowerCase().includes(searchLower) ||
      article.content.toLowerCase().includes(searchLower);
    
    const matchesCategory = !categoryFilter || article.category === categoryFilter;
    
    return matchesQuery && matchesCategory;
  });
};

export const getRelatedArticles = (currentSlug: string, category: Category, limit = 3) => 
  articles
    .filter(article => article.slug !== currentSlug && article.category === category)
    .slice(0, limit);
