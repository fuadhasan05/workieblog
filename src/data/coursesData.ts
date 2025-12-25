export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isFree: boolean;
  description: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  instructor: string;
  instructorTitle: string;
  instructorBio: string;
  instructorAvatar: string;
  duration: string;
  lessons: Lesson[];
  students: number;
  rating: number;
  price: number;
  isFree: boolean;
  isPremium: boolean;
  category: string;
  whatYouLearn: string[];
}

export const courses: Course[] = [
  {
    id: '1',
    title: 'Career Acceleration Masterclass',
    description: 'Learn proven strategies to fast-track your career growth, negotiate better, and position yourself for leadership roles.',
    longDescription: 'This comprehensive masterclass is designed to help ambitious professionals accelerate their career trajectory. Whether you\'re looking to climb the corporate ladder, transition into leadership, or pivot to a new industry, this course provides actionable frameworks and real-world strategies that work.',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
    instructor: 'Ire Aderinokun',
    instructorTitle: 'VP Engineering',
    instructorBio: 'Ire is a VP of Engineering with over 15 years of experience building and leading high-performing teams at top tech companies.',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    duration: '6 hours',
    lessons: [
      { id: '1-1', title: 'Introduction: Your Career Roadmap', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: true, description: 'Welcome to the course! Learn how to create a personalized career roadmap.' },
      { id: '1-2', title: 'Identifying Your Unique Value', duration: '20:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: true, description: 'Discover what makes you stand out and how to communicate your value.' },
      { id: '1-3', title: 'Building Strategic Relationships', duration: '25:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: false, description: 'Learn networking strategies that actually work for career growth.' },
      { id: '1-4', title: 'Navigating Office Politics', duration: '18:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: false, description: 'Master the art of navigating complex workplace dynamics.' },
      { id: '1-5', title: 'Getting Visibility with Leadership', duration: '22:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: false, description: 'Strategies to get noticed by decision-makers.' },
      { id: '1-6', title: 'Negotiating Your Next Promotion', duration: '30:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: false, description: 'Proven techniques for negotiating promotions and raises.' },
    ],
    students: 1250,
    rating: 4.9,
    price: 149,
    isFree: false,
    isPremium: true,
    category: 'Career',
    whatYouLearn: [
      'Create a clear career roadmap aligned with your goals',
      'Develop your personal brand and communicate your value',
      'Build strategic relationships that accelerate your growth',
      'Navigate office politics with confidence',
      'Position yourself for promotions and leadership roles',
    ],
  },
  {
    id: '2',
    title: 'Negotiation Skills for Women',
    description: 'Master the art of salary negotiation, promotions, and getting what you deserve in the workplace.',
    longDescription: 'This course addresses the unique challenges women face in negotiations and provides practical tools to overcome them. From salary discussions to project allocations, you\'ll learn how to advocate for yourself effectively.',
    thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop',
    instructor: 'Funke Bucknor-Obruthe',
    instructorTitle: 'Career Coach',
    instructorBio: 'Funke is a renowned career coach who has helped over 500 women negotiate better salaries and promotions.',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop',
    duration: '4 hours',
    lessons: [
      { id: '2-1', title: 'The Psychology of Negotiation', duration: '20:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: true, description: 'Understanding the mindset needed for successful negotiations.' },
      { id: '2-2', title: 'Preparing Your Case', duration: '25:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: true, description: 'How to research, document, and present your achievements.' },
      { id: '2-3', title: 'Salary Negotiation Scripts', duration: '30:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: false, description: 'Word-for-word scripts for common negotiation scenarios.' },
      { id: '2-4', title: 'Handling Objections', duration: '22:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: false, description: 'How to respond when you hear "no" or "not now".' },
    ],
    students: 890,
    rating: 4.8,
    price: 99,
    isFree: false,
    isPremium: true,
    category: 'Skills',
    whatYouLearn: [
      'Overcome negotiation anxiety and build confidence',
      'Research and document your market value',
      'Use proven scripts for salary conversations',
      'Handle objections without backing down',
    ],
  },
  {
    id: '3',
    title: 'Building Your Personal Brand',
    description: 'Create a powerful personal brand that opens doors and attracts opportunities.',
    longDescription: 'Your personal brand is your professional reputation. This course teaches you how to intentionally craft and communicate your brand across all touchpoints, from LinkedIn to in-person networking.',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop',
    instructor: 'Tara Fela-Durotoye',
    instructorTitle: 'Founder, House of Tara',
    instructorBio: 'Tara built House of Tara into one of Africa\'s most recognized beauty brands and is an expert in personal branding.',
    instructorAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop',
    duration: '3 hours',
    lessons: [
      { id: '3-1', title: 'What is Personal Branding?', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: true, description: 'Understanding the fundamentals of personal branding.' },
      { id: '3-2', title: 'Defining Your Brand Identity', duration: '20:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: true, description: 'Discover your unique brand attributes and values.' },
      { id: '3-3', title: 'LinkedIn Optimization', duration: '25:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: true, description: 'Transform your LinkedIn into a powerful branding tool.' },
      { id: '3-4', title: 'Content Strategy for Visibility', duration: '22:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: true, description: 'Create content that showcases your expertise.' },
    ],
    students: 2100,
    rating: 4.7,
    price: 0,
    isFree: true,
    isPremium: false,
    category: 'Branding',
    whatYouLearn: [
      'Define your unique personal brand identity',
      'Optimize your LinkedIn profile for visibility',
      'Create a content strategy that builds authority',
      'Network effectively to grow your brand',
    ],
  },
  {
    id: '4',
    title: 'Financial Freedom Blueprint',
    description: 'Build wealth, invest smartly, and create multiple income streams for financial independence.',
    longDescription: 'This comprehensive course covers everything from budgeting basics to advanced investment strategies. Learn how to build generational wealth while maintaining financial security.',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=400&fit=crop',
    instructor: 'Tomie Balogun',
    instructorTitle: 'Founder, Mosabi',
    instructorBio: 'Tomie is the founder of Mosabi, a financial wellness platform that has helped thousands achieve financial freedom.',
    instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    duration: '8 hours',
    lessons: [
      { id: '4-1', title: 'Financial Mindset Shift', duration: '18:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: true, description: 'Transform your relationship with money.' },
      { id: '4-2', title: 'Budgeting That Works', duration: '25:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: true, description: 'Create a budget you can actually stick to.' },
      { id: '4-3', title: 'Emergency Fund Essentials', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: false, description: 'Build your financial safety net.' },
      { id: '4-4', title: 'Introduction to Investing', duration: '30:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: false, description: 'Learn the basics of stocks, bonds, and index funds.' },
      { id: '4-5', title: 'Real Estate Investing', duration: '35:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: false, description: 'Build wealth through property investment.' },
      { id: '4-6', title: 'Multiple Income Streams', duration: '28:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: false, description: 'Diversify your income for financial security.' },
    ],
    students: 1580,
    rating: 4.9,
    price: 199,
    isFree: false,
    isPremium: true,
    category: 'Money',
    whatYouLearn: [
      'Develop a wealth-building mindset',
      'Create and stick to an effective budget',
      'Build a solid emergency fund',
      'Start investing confidently',
      'Create multiple streams of income',
    ],
  },
  {
    id: '5',
    title: 'Leadership Essentials',
    description: 'Develop the leadership skills needed to inspire teams and drive results at any level.',
    longDescription: 'Whether you\'re a new manager or aspiring executive, this course provides practical leadership frameworks you can apply immediately. Learn to lead with authenticity and impact.',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&h=400&fit=crop',
    instructor: 'Ibukun Awosika',
    instructorTitle: 'Former Chairman, First Bank',
    instructorBio: 'Ibukun served as the Chairman of First Bank of Nigeria and is a renowned leadership expert and entrepreneur.',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop',
    duration: '5 hours',
    lessons: [
      { id: '5-1', title: 'Leadership vs Management', duration: '20:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: true, description: 'Understanding the key differences and when to apply each.' },
      { id: '5-2', title: 'Building Trust with Your Team', duration: '25:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: true, description: 'The foundation of effective leadership.' },
      { id: '5-3', title: 'Effective Communication', duration: '22:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: false, description: 'Communicate with clarity and impact.' },
      { id: '5-4', title: 'Decision Making Under Pressure', duration: '28:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: false, description: 'Make confident decisions in challenging situations.' },
      { id: '5-5', title: 'Developing Future Leaders', duration: '30:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: false, description: 'Create a legacy by developing others.' },
    ],
    students: 760,
    rating: 4.8,
    price: 129,
    isFree: false,
    isPremium: true,
    category: 'Leadership',
    whatYouLearn: [
      'Distinguish between leadership and management',
      'Build trust and psychological safety',
      'Communicate effectively as a leader',
      'Make decisions under pressure',
      'Develop and mentor future leaders',
    ],
  },
  {
    id: '6',
    title: 'Work-Life Balance Strategies',
    description: 'Practical techniques to manage stress, avoid burnout, and thrive in demanding careers.',
    longDescription: 'Burnout is real, but it\'s not inevitable. This course teaches sustainable strategies for managing a demanding career while maintaining your health, relationships, and joy.',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop',
    instructor: 'Dr. Ola Brown',
    instructorTitle: 'Founder, Flying Doctors',
    instructorBio: 'Dr. Ola is the founder of Flying Doctors Nigeria and an advocate for work-life balance in demanding professions.',
    instructorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop',
    duration: '2 hours',
    lessons: [
      { id: '6-1', title: 'Understanding Burnout', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: true, description: 'Recognize the signs before it\'s too late.' },
      { id: '6-2', title: 'Setting Boundaries', duration: '20:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: true, description: 'Learn to say no without guilt.' },
      { id: '6-3', title: 'Energy Management', duration: '18:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: true, description: 'Optimize your energy, not just your time.' },
      { id: '6-4', title: 'Recovery Rituals', duration: '22:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isFree: true, description: 'Build habits that restore and rejuvenate.' },
    ],
    students: 3200,
    rating: 4.6,
    price: 0,
    isFree: true,
    isPremium: false,
    category: 'Wellness',
    whatYouLearn: [
      'Recognize early signs of burnout',
      'Set healthy boundaries at work',
      'Manage your energy effectively',
      'Build sustainable recovery rituals',
    ],
  },
];

export const categories = ['All', 'Career', 'Skills', 'Leadership', 'Money', 'Wellness', 'Branding'];
