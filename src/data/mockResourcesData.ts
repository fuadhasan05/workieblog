export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  iconType: string;
  downloadCount: number;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'CV Template for African Graduates',
    description: 'A modern, ATS-friendly CV template designed specifically for African job seekers entering the global market.',
    category: 'TEMPLATES',
    iconType: 'FILE_TEXT',
    downloadCount: 2847,
    fileSize: 245000,
    mimeType: 'application/pdf',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Salary Negotiation Script',
    description: 'Word-for-word scripts and strategies to confidently negotiate your salary and benefits package.',
    category: 'CAREER_TOOLS',
    iconType: 'TARGET',
    downloadCount: 1923,
    fileSize: 156000,
    mimeType: 'application/pdf',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'LinkedIn Optimization Guide',
    description: 'Step-by-step guide to creating a standout LinkedIn profile that attracts recruiters and opportunities.',
    category: 'NETWORKING',
    iconType: 'USERS',
    downloadCount: 3156,
    fileSize: 312000,
    mimeType: 'application/pdf',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Interview Prep Checklist',
    description: 'Comprehensive checklist covering everything from research to follow-up for your next job interview.',
    category: 'CAREER_TOOLS',
    iconType: 'BRIEFCASE',
    downloadCount: 2234,
    fileSize: 189000,
    mimeType: 'application/pdf',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Weekly Career Planner',
    description: 'A printable weekly planner to track job applications, networking goals, and skill development.',
    category: 'PLANNING',
    iconType: 'BOOK_OPEN',
    downloadCount: 1567,
    fileSize: 278000,
    mimeType: 'application/pdf',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    title: 'Remote Work Productivity Guide',
    description: 'Tips and tools for staying productive while working remotely, including home office setup advice.',
    category: 'GUIDES',
    iconType: 'LIGHTBULB',
    downloadCount: 1834,
    fileSize: 234000,
    mimeType: 'application/pdf',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    title: 'Networking Email Templates',
    description: '10 proven email templates for reaching out to professionals, requesting informational interviews, and following up.',
    category: 'NETWORKING',
    iconType: 'USERS',
    downloadCount: 2089,
    fileSize: 145000,
    mimeType: 'application/pdf',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    title: 'First 90 Days Success Plan',
    description: 'A strategic guide to making a strong impression and setting yourself up for success in your new role.',
    category: 'PLANNING',
    iconType: 'TRENDING_UP',
    downloadCount: 1456,
    fileSize: 267000,
    mimeType: 'application/pdf',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '9',
    title: 'Personal Branding Workbook',
    description: 'Exercises and prompts to help you define and communicate your unique professional brand.',
    category: 'CAREER_TOOLS',
    iconType: 'STAR',
    downloadCount: 1678,
    fileSize: 345000,
    mimeType: 'application/pdf',
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const getFilteredResources = (
  resources: Resource[],
  category: string
): Resource[] => {
  if (category === 'ALL') {
    return resources;
  }
  return resources.filter((resource) => resource.category === category);
};
