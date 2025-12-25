export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string | null;
  jobType: string;
  remote: boolean;
  description: string;
  requirements: string | null;
  applicationUrl: string;
  tags: string[];
  createdAt: string;
  expiresAt: string | null;
}

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Junior Software Developer',
    company: 'TechAfrica',
    location: 'Lagos, Nigeria',
    salary: '₦350,000 - ₦500,000/month',
    jobType: 'FULL_TIME',
    remote: true,
    description: 'Join our growing team building solutions for African businesses. Perfect for recent graduates looking to kickstart their tech career.\n\nYou will work on cutting-edge web and mobile applications serving millions of users across Africa. Our tech stack includes React, Node.js, and PostgreSQL.\n\nWe offer mentorship, learning opportunities, and a clear career growth path.',
    requirements: '• Bachelor\'s degree in Computer Science or related field\n• Basic knowledge of JavaScript, HTML, and CSS\n• Familiarity with React or any modern frontend framework\n• Strong problem-solving skills\n• Good communication skills in English\n• Willingness to learn and grow',
    applicationUrl: 'https://example.com/apply',
    tags: ['Tech', 'Entry Level', 'Remote'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Marketing Coordinator',
    company: 'Flutterwave',
    location: 'Nairobi, Kenya',
    salary: 'KSh 120,000 - 180,000/month',
    jobType: 'FULL_TIME',
    remote: false,
    description: 'Help us expand our brand presence across East Africa. Ideal for creative individuals with a passion for fintech.\n\nYou will coordinate marketing campaigns, manage social media presence, and work with cross-functional teams to drive brand awareness.',
    requirements: '• 1-2 years of marketing experience\n• Excellent written and verbal communication\n• Experience with social media management tools\n• Creative mindset with attention to detail\n• Knowledge of the African fintech landscape is a plus',
    applicationUrl: 'https://example.com/apply',
    tags: ['Marketing', 'Fintech', 'Growth'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Content Writer',
    company: 'Workie Media',
    location: 'Remote - Africa',
    salary: '$800 - $1,200/month',
    jobType: 'FREELANCE',
    remote: true,
    description: 'Create engaging content for African Gen-Z audiences. Perfect for storytellers who understand the African career landscape.\n\nYou will write articles, newsletters, and social media content that resonates with young professionals across the continent.',
    requirements: '• Proven writing portfolio\n• Understanding of African Gen-Z culture and career challenges\n• Ability to meet deadlines\n• SEO knowledge is a plus\n• Available for at least 20 hours per week',
    applicationUrl: 'https://example.com/apply',
    tags: ['Content', 'Freelance', 'Remote'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: null,
  },
  {
    id: '4',
    title: 'Graduate Trainee Program',
    company: 'Dangote Group',
    location: 'Lagos, Nigeria',
    salary: 'Competitive',
    jobType: 'INTERNSHIP',
    remote: false,
    description: '12-month rotational program across different business units. Open to recent graduates from any discipline.\n\nThis comprehensive program gives you exposure to various aspects of our business including operations, finance, marketing, and supply chain.',
    requirements: '• Recent graduate (within last 2 years)\n• Minimum 2.1 or equivalent\n• Strong leadership potential\n• Willingness to relocate within Nigeria\n• Excellent interpersonal skills',
    applicationUrl: 'https://example.com/apply',
    tags: ['Graduate Program', 'Entry Level', 'Training'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'UI/UX Designer',
    company: 'Paystack',
    location: 'Accra, Ghana',
    salary: 'GH₵ 8,000 - 12,000/month',
    jobType: 'FULL_TIME',
    remote: true,
    description: 'Design beautiful payment experiences for millions of Africans. Looking for designers with a portfolio showcasing mobile-first design.\n\nYou will work closely with product and engineering teams to create intuitive interfaces for our payment products.',
    requirements: '• 2+ years of UI/UX design experience\n• Strong portfolio demonstrating mobile-first design\n• Proficiency in Figma or Sketch\n• Understanding of design systems\n• Experience with user research is a plus',
    applicationUrl: 'https://example.com/apply',
    tags: ['Design', 'Fintech', 'Remote'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    title: 'Customer Success Associate',
    company: 'Andela',
    location: 'Remote - Africa',
    salary: '$600 - $900/month',
    jobType: 'FULL_TIME',
    remote: true,
    description: 'Support our developer community across Africa. Great opportunity for people-oriented individuals passionate about tech talent.\n\nYou will onboard new developers, handle inquiries, and ensure our community members have the best experience.',
    requirements: '• Excellent communication skills\n• Experience in customer service or community management\n• Tech-savvy with basic understanding of software development\n• Empathetic and patient personality\n• Flexible with timezone requirements',
    applicationUrl: 'https://example.com/apply',
    tags: ['Customer Success', 'Tech', 'Remote'],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    title: 'Social Media Manager',
    company: 'Jumia',
    location: 'Cairo, Egypt',
    salary: null,
    jobType: 'FULL_TIME',
    remote: false,
    description: 'Lead social media strategy for North Africa region. Ideal for candidates with experience in e-commerce and African markets.\n\nYou will manage content calendars, analyze performance metrics, and coordinate with regional marketing teams.',
    requirements: '• 3+ years of social media management experience\n• Fluency in Arabic and English\n• Experience with e-commerce brands\n• Strong analytical skills\n• Creative content creation abilities',
    applicationUrl: 'https://example.com/apply',
    tags: ['Social Media', 'E-commerce', 'Marketing'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    title: 'Data Analyst Intern',
    company: 'MTN Group',
    location: 'Johannesburg, South Africa',
    salary: 'R15,000/month stipend',
    jobType: 'INTERNSHIP',
    remote: false,
    description: '6-month internship program for students passionate about data. Learn from industry experts in Africa\'s largest telecom.\n\nYou will work on real business problems, analyze customer data, and create insights that drive decision-making.',
    requirements: '• Currently enrolled in a relevant degree program\n• Basic knowledge of SQL and Excel\n• Familiarity with Python or R is a plus\n• Strong analytical mindset\n• Attention to detail',
    applicationUrl: 'https://example.com/apply',
    tags: ['Data', 'Internship', 'Telecom'],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const getJobById = (id: string): Job | undefined => {
  return mockJobs.find((job) => job.id === id);
};

export const getFilteredJobs = (
  jobs: Job[],
  search: string,
  remoteOnly: boolean
): Job[] => {
  return jobs.filter((job) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      job.title.toLowerCase().includes(searchLower) ||
      job.company.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower) ||
      job.tags.some((tag) => tag.toLowerCase().includes(searchLower));

    const matchesRemote = !remoteOnly || job.remote;

    return matchesSearch && matchesRemote;
  });
};
