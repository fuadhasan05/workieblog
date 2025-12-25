import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@careerbuddy.com' },
    update: {},
    create: {
      email: 'admin@careerbuddy.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      bio: 'System administrator',
    },
  });
  console.log('✅ Created admin user');

  // Create editor user
  const editorPassword = await bcrypt.hash('editor123', 10);
  const editor = await prisma.user.upsert({
    where: { email: 'editor@careerbuddy.com' },
    update: {},
    create: {
      email: 'editor@careerbuddy.com',
      name: 'Editor User',
      password: editorPassword,
      role: 'EDITOR',
      bio: 'Content editor',
    },
  });
  console.log('✅ Created editor user');

  // Create author user
  const authorPassword = await bcrypt.hash('author123', 10);
  const author = await prisma.user.upsert({
    where: { email: 'author@careerbuddy.com' },
    update: {},
    create: {
      email: 'author@careerbuddy.com',
      name: 'Sarah Johnson',
      password: authorPassword,
      role: 'AUTHOR',
      bio: 'Senior writer and content creator',
    },
  });
  console.log('✅ Created author user');

  // Create categories
  const careerCategory = await prisma.category.upsert({
    where: { slug: 'career' },
    update: {},
    create: {
      slug: 'career',
      name: 'Career',
      description: 'Career advice and professional growth',
      color: '#8b5cf6',
    },
  });

  const successCategory = await prisma.category.upsert({
    where: { slug: 'success' },
    update: {},
    create: {
      slug: 'success',
      name: 'Success',
      description: 'Success stories and inspiration',
      color: '#f59e0b',
    },
  });

  const wellnessCategory = await prisma.category.upsert({
    where: { slug: 'wellness' },
    update: {},
    create: {
      slug: 'wellness',
      name: 'Wellness',
      description: 'Work-life balance and mental health',
      color: '#10b981',
    },
  });

  const moneyCategory = await prisma.category.upsert({
    where: { slug: 'money' },
    update: {},
    create: {
      slug: 'money',
      name: 'Money',
      description: 'Financial advice and salary negotiation',
      color: '#ec4899',
    },
  });

  const trendsCategory = await prisma.category.upsert({
    where: { slug: 'trends' },
    update: {},
    create: {
      slug: 'trends',
      name: 'Trends',
      description: 'Industry trends and future of work',
      color: '#3b82f6',
    },
  });

  console.log('✅ Created categories');

  // Create tags
  const negotiationTag = await prisma.tag.upsert({
    where: { slug: 'negotiation' },
    update: {},
    create: {
      slug: 'negotiation',
      name: 'Negotiation',
    },
  });

  const interviewTag = await prisma.tag.upsert({
    where: { slug: 'interview' },
    update: {},
    create: {
      slug: 'interview',
      name: 'Interview',
    },
  });

  const leadershipTag = await prisma.tag.upsert({
    where: { slug: 'leadership' },
    update: {},
    create: {
      slug: 'leadership',
      name: 'Leadership',
    },
  });

  const productivityTag = await prisma.tag.upsert({
    where: { slug: 'productivity' },
    update: {},
    create: {
      slug: 'productivity',
      name: 'Productivity',
    },
  });

  console.log('✅ Created tags');

  // Create sample posts
  const post1 = await prisma.post.create({
    data: {
      slug: 'salary-negotiation-guide-2024',
      title: 'The Ultimate Salary Negotiation Guide for African Women in 2024',
      excerpt: 'Learn proven strategies to negotiate your worth and close the gender pay gap.',
      content: '<h2>Know Your Worth</h2><p>Before walking into any negotiation, you need to know your market value. Research salary ranges for your role using platforms like Glassdoor, LinkedIn Salary, and PayScale. Factor in your experience, skills, and the value you bring to the organization.</p><h2>Timing is Everything</h2><p>The best time to negotiate is when you have leverage—during a job offer, after a major accomplishment, or during performance reviews. Don\'t wait for your employer to bring up compensation; be proactive.</p><h2>Practice Makes Perfect</h2><p>Rehearse your negotiation pitch with a friend or mentor. Anticipate pushback and prepare confident responses. Remember: negotiation is a conversation, not a confrontation.</p>',
      featuredImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-01-15'),
      readTime: 8,
      isFeatured: true,
      isPremium: false,
      views: 3450,
      authorId: author.id,
      categoryId: moneyCategory.id,
      tags: {
        connect: [{ id: negotiationTag.id }],
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      slug: 'ace-tech-interviews',
      title: 'How I Aced My Tech Interview at Google (And You Can Too)',
      excerpt: 'A step-by-step breakdown of how to prepare for and crush your dream tech interview.',
      content: '<h2>My Journey</h2><p>After three failed attempts, I finally landed my dream job at Google. Here\'s what I learned along the way and how you can avoid my early mistakes.</p><h2>The Preparation Framework</h2><p>I dedicated 3 months to focused preparation: 1 hour of coding practice daily, mock interviews every weekend, and deep dives into system design. Consistency beats intensity.</p><h2>During the Interview</h2><p>Think out loud. Interviewers want to understand your thought process, not just see the final answer. Ask clarifying questions and don\'t be afraid to say "I need a moment to think."</p>',
      featuredImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-01-12'),
      readTime: 10,
      isFeatured: true,
      isPremium: false,
      views: 5200,
      authorId: author.id,
      categoryId: successCategory.id,
      tags: {
        connect: [{ id: interviewTag.id }],
      },
    },
  });

  const post3 = await prisma.post.create({
    data: {
      slug: 'work-life-balance-myth',
      title: 'Work-Life Balance is a Myth: Here\'s What to Do Instead',
      excerpt: 'Why chasing perfect balance is making you miserable and what actually works.',
      content: '<h2>The Balance Trap</h2><p>We\'ve been sold the idea that we can have it all—if we just manage our time better. But the truth is, balance isn\'t about equal distribution. It\'s about intentional integration.</p><h2>Work-Life Integration</h2><p>Instead of separating work and life into neat boxes, embrace the overlap. Some weeks work demands more; other times, personal life takes priority. The goal is harmony, not equilibrium.</p><h2>Practical Strategies</h2><p>Set non-negotiable boundaries, batch similar tasks, and most importantly—let go of guilt. You\'re doing your best, and that\'s enough.</p>',
      featuredImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-01-10'),
      readTime: 6,
      isFeatured: false,
      isPremium: true,
      views: 2890,
      authorId: author.id,
      categoryId: wellnessCategory.id,
      tags: {
        connect: [{ id: productivityTag.id }],
      },
    },
  });

  const post4 = await prisma.post.create({
    data: {
      slug: 'remote-work-trends-2024',
      title: '5 Remote Work Trends Shaping the Future of Work in Africa',
      excerpt: 'From hybrid models to digital nomadism, here\'s what\'s changing the workplace.',
      content: '<h2>The Remote Revolution</h2><p>The pandemic accelerated remote work adoption by a decade. Now, African professionals are uniquely positioned to benefit from this global shift.</p><h2>Top Trends</h2><p>1. Hybrid is here to stay<br>2. Companies are hiring globally<br>3. Coworking spaces are booming<br>4. Time zone arbitrage is real<br>5. Skills matter more than location</p><h2>How to Position Yourself</h2><p>Build a strong online presence, invest in reliable internet and equipment, and develop async communication skills. The world is your oyster.</p>',
      featuredImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-01-08'),
      readTime: 7,
      isFeatured: false,
      isPremium: false,
      views: 1890,
      authorId: author.id,
      categoryId: trendsCategory.id,
    },
  });

  const post5 = await prisma.post.create({
    data: {
      slug: 'first-management-role',
      title: 'Lessons From My First 90 Days as a Manager',
      excerpt: 'The mistakes I made and what I wish I knew before stepping into leadership.',
      content: '<h2>The Promotion Paradox</h2><p>Getting promoted to manager was thrilling—until I realized I had no idea what I was doing. Here\'s what I learned the hard way.</p><h2>Key Lessons</h2><p>1. Your job is now to make others successful, not to be the hero<br>2. Feedback is a gift—give it often and graciously<br>3. One-on-ones are sacred; never skip them<br>4. Document everything</p><h2>The Growth Mindset</h2><p>Being a new manager is humbling. Embrace the learning curve and don\'t be afraid to ask for help.</p>',
      featuredImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-01-05'),
      readTime: 9,
      isFeatured: true,
      isPremium: false,
      views: 4100,
      authorId: author.id,
      categoryId: careerCategory.id,
      tags: {
        connect: [{ id: leadershipTag.id }],
      },
    },
  });

  console.log('✅ Created sample posts');

  // Create sample resources with actual downloadable files
  await prisma.resource.createMany({
    data: [
      {
        title: 'Salary Negotiation Script',
        description: 'Word-for-word scripts for negotiating your salary, from initial ask to counter-offer responses.',
        category: 'CAREER_TOOLS',
        iconType: 'BRIEFCASE',
        fileUrl: '/public/resources/salary-negotiation-script.md',
        fileName: 'salary-negotiation-script.md',
        fileSize: 4500,
        mimeType: 'text/markdown',
        downloadCount: 1234,
        status: 'PUBLISHED',
      },
      {
        title: 'Interview Prep Checklist',
        description: 'A comprehensive checklist to prepare for any interview, from research to follow-up.',
        category: 'CAREER_TOOLS',
        iconType: 'TARGET',
        fileUrl: '/public/resources/interview-prep-checklist.md',
        fileName: 'interview-prep-checklist.md',
        fileSize: 5200,
        mimeType: 'text/markdown',
        downloadCount: 2100,
        status: 'PUBLISHED',
      },
      {
        title: 'Weekly Career Planner',
        description: 'A weekly planning template to track your career goals, habits, and professional development.',
        category: 'PLANNING',
        iconType: 'TRENDING_UP',
        fileUrl: '/public/resources/weekly-planner-template.md',
        fileName: 'weekly-planner-template.md',
        fileSize: 4800,
        mimeType: 'text/markdown',
        downloadCount: 1567,
        status: 'PUBLISHED',
      },
      {
        title: 'Networking Email Templates',
        description: 'Cold email templates, follow-up messages, and LinkedIn connection requests that actually work.',
        category: 'NETWORKING',
        iconType: 'USERS',
        fileUrl: '/public/resources/networking-email-templates.md',
        fileName: 'networking-email-templates.md',
        fileSize: 6100,
        mimeType: 'text/markdown',
        downloadCount: 890,
        status: 'PUBLISHED',
      },
      {
        title: 'LinkedIn Profile Optimization Guide',
        description: 'A complete guide to optimizing your LinkedIn profile for maximum visibility and opportunities.',
        category: 'GUIDES',
        iconType: 'STAR',
        fileUrl: '/public/resources/linkedin-optimization-guide.md',
        fileName: 'linkedin-optimization-guide.md',
        fileSize: 7200,
        mimeType: 'text/markdown',
        downloadCount: 2340,
        status: 'PUBLISHED',
      },
      {
        title: 'Remote Work Productivity Guide',
        description: 'Master work-from-home success with workspace setup, time management, and communication tips.',
        category: 'GUIDES',
        iconType: 'BRIEFCASE',
        fileUrl: '/public/resources/remote-work-productivity-guide.md',
        fileName: 'remote-work-productivity-guide.md',
        fileSize: 8500,
        mimeType: 'text/markdown',
        downloadCount: 1890,
        status: 'PUBLISHED',
      },
    ],
  });

  console.log('✅ Created sample resources');

  // Create subscribers
  await prisma.subscriber.createMany({
    data: [
      {
        email: 'subscriber1@example.com',
        name: 'Jane Smith',
        tier: 'FREE',
        subscribedAt: new Date('2024-01-01'),
        isActive: true,
      },
      {
        email: 'subscriber2@example.com',
        name: 'John Doe',
        tier: 'PREMIUM',
        subscribedAt: new Date('2024-01-05'),
        isActive: true,
      },
      {
        email: 'subscriber3@example.com',
        name: 'Emily Brown',
        tier: 'VIP',
        subscribedAt: new Date('2024-01-10'),
        isActive: true,
      },
    ],
  });

  console.log('✅ Created sample subscribers');

  // Create analytics events
  await prisma.analytics.createMany({
    data: [
      {
        postId: post1.id,
        event: 'post_view',
        path: `/article/${post1.slug}`,
        createdAt: new Date('2024-01-16'),
      },
      {
        postId: post2.id,
        event: 'post_view',
        path: `/article/${post2.slug}`,
        createdAt: new Date('2024-01-17'),
      },
      {
        postId: post3.id,
        event: 'post_view',
        path: `/article/${post3.slug}`,
        createdAt: new Date('2024-01-18'),
      },
    ],
  });

  console.log('✅ Created analytics events');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📝 Login credentials:');
  console.log('Admin: admin@careerbuddy.com / admin123');
  console.log('Editor: editor@careerbuddy.com / editor123');
  console.log('Author: author@careerbuddy.com / author123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
