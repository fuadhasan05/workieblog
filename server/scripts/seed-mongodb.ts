import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { 
  User, 
  Category, 
  Tag, 
  Post, 
  Resource, 
  Subscriber, 
  Analytics 
} from '../models/mongodb.js';
import { connectToMongoDB } from '../utils/mongodb.js';

async function main() {
  console.log('🌱 Starting MongoDB seed...');

  // Connect to MongoDB
  await connectToMongoDB();
  console.log('✅ Connected to MongoDB');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await User.findOneAndUpdate(
    { email: 'admin@careerbuddy.com' },
    {
      email: 'admin@careerbuddy.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      bio: 'System administrator',
    },
    { upsert: true, new: true }
  );
  console.log('✅ Created admin user');

  // Create editor user
  const editorPassword = await bcrypt.hash('editor123', 10);
  const editor = await User.findOneAndUpdate(
    { email: 'editor@careerbuddy.com' },
    {
      email: 'editor@careerbuddy.com',
      name: 'Editor User',
      password: editorPassword,
      role: 'EDITOR',
      bio: 'Content editor',
    },
    { upsert: true, new: true }
  );
  console.log('✅ Created editor user');

  // Create author user
  const authorPassword = await bcrypt.hash('author123', 10);
  const author = await User.findOneAndUpdate(
    { email: 'author@careerbuddy.com' },
    {
      email: 'author@careerbuddy.com',
      name: 'Sarah Johnson',
      password: authorPassword,
      role: 'AUTHOR',
      bio: 'Senior writer and content creator',
    },
    { upsert: true, new: true }
  );
  console.log('✅ Created author user');

  // Create categories
  const careerCategory = await Category.findOneAndUpdate(
    { slug: 'career' },
    {
      slug: 'career',
      name: 'Career',
      description: 'Career advice and professional growth',
      color: '#8b5cf6',
    },
    { upsert: true, new: true }
  );

  const successCategory = await Category.findOneAndUpdate(
    { slug: 'success' },
    {
      slug: 'success',
      name: 'Success',
      description: 'Success stories and inspiration',
      color: '#f59e0b',
    },
    { upsert: true, new: true }
  );

  const wellnessCategory = await Category.findOneAndUpdate(
    { slug: 'wellness' },
    {
      slug: 'wellness',
      name: 'Wellness',
      description: 'Work-life balance and mental health',
      color: '#10b981',
    },
    { upsert: true, new: true }
  );

  const moneyCategory = await Category.findOneAndUpdate(
    { slug: 'money' },
    {
      slug: 'money',
      name: 'Money',
      description: 'Financial advice and salary negotiation',
      color: '#ec4899',
    },
    { upsert: true, new: true }
  );

  const trendsCategory = await Category.findOneAndUpdate(
    { slug: 'trends' },
    {
      slug: 'trends',
      name: 'Trends',
      description: 'Industry trends and future of work',
      color: '#3b82f6',
    },
    { upsert: true, new: true }
  );

  console.log('✅ Created categories');

  // Create tags
  const negotiationTag = await Tag.findOneAndUpdate(
    { slug: 'negotiation' },
    { slug: 'negotiation', name: 'Negotiation' },
    { upsert: true, new: true }
  );

  const interviewTag = await Tag.findOneAndUpdate(
    { slug: 'interview' },
    { slug: 'interview', name: 'Interview' },
    { upsert: true, new: true }
  );

  const leadershipTag = await Tag.findOneAndUpdate(
    { slug: 'leadership' },
    { slug: 'leadership', name: 'Leadership' },
    { upsert: true, new: true }
  );

  const productivityTag = await Tag.findOneAndUpdate(
    { slug: 'productivity' },
    { slug: 'productivity', name: 'Productivity' },
    { upsert: true, new: true }
  );

  console.log('✅ Created tags');

  // Create sample posts
  const post1 = await Post.findOneAndUpdate(
    { slug: 'salary-negotiation-guide-2024' },
    {
      slug: 'salary-negotiation-guide-2024',
      title: 'The Ultimate Salary Negotiation Guide for African Women in 2024',
      excerpt: 'Learn proven strategies to negotiate your worth and close the gender pay gap.',
      content: '<h2>Know Your Worth</h2><p>Before walking into any negotiation, you need to know your market value.</p>',
      featuredImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-01-15'),
      readTime: 8,
      isFeatured: true,
      isPremium: false,
      views: 3450,
      authorId: author._id,
      categoryId: moneyCategory._id,
      tags: [negotiationTag._id],
    },
    { upsert: true, new: true }
  );

  const post2 = await Post.findOneAndUpdate(
    { slug: 'ace-tech-interviews' },
    {
      slug: 'ace-tech-interviews',
      title: 'How I Aced My Tech Interview at Google (And You Can Too)',
      excerpt: 'A step-by-step breakdown of how to prepare for and crush your dream tech interview.',
      content: '<h2>My Journey</h2><p>After three failed attempts, I finally landed my dream job at Google.</p>',
      featuredImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-01-12'),
      readTime: 10,
      isFeatured: true,
      isPremium: false,
      views: 5200,
      authorId: author._id,
      categoryId: successCategory._id,
      tags: [interviewTag._id],
    },
    { upsert: true, new: true }
  );

  const post3 = await Post.findOneAndUpdate(
    { slug: 'work-life-balance-myth' },
    {
      slug: 'work-life-balance-myth',
      title: 'Work-Life Balance is a Myth: Here\'s What to Do Instead',
      excerpt: 'Why chasing perfect balance is making you miserable and what actually works.',
      content: '<h2>The Balance Trap</h2><p>We\'ve been sold the idea that we can have it all.</p>',
      featuredImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-01-10'),
      readTime: 6,
      isFeatured: false,
      isPremium: true,
      views: 2890,
      authorId: author._id,
      categoryId: wellnessCategory._id,
      tags: [productivityTag._id],
    },
    { upsert: true, new: true }
  );

  const post4 = await Post.findOneAndUpdate(
    { slug: 'remote-work-trends-2024' },
    {
      slug: 'remote-work-trends-2024',
      title: '5 Remote Work Trends Shaping the Future of Work in Africa',
      excerpt: 'From hybrid models to digital nomadism, here\'s what\'s changing the workplace.',
      content: '<h2>The Remote Revolution</h2><p>The pandemic accelerated remote work adoption by a decade.</p>',
      featuredImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-01-08'),
      readTime: 7,
      isFeatured: false,
      isPremium: false,
      views: 1890,
      authorId: author._id,
      categoryId: trendsCategory._id,
      tags: [],
    },
    { upsert: true, new: true }
  );

  const post5 = await Post.findOneAndUpdate(
    { slug: 'first-management-role' },
    {
      slug: 'first-management-role',
      title: 'Lessons From My First 90 Days as a Manager',
      excerpt: 'The mistakes I made and what I wish I knew before stepping into leadership.',
      content: '<h2>The Promotion Paradox</h2><p>Getting promoted to manager was thrilling.</p>',
      featuredImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-01-05'),
      readTime: 9,
      isFeatured: true,
      isPremium: false,
      views: 4100,
      authorId: author._id,
      categoryId: careerCategory._id,
      tags: [leadershipTag._id],
    },
    { upsert: true, new: true }
  );

  console.log('✅ Created sample posts');

  // Create sample resources
  const resources = [
    {
      title: 'Salary Negotiation Script',
      description: 'Word-for-word scripts for negotiating your salary.',
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
      description: 'A comprehensive checklist to prepare for any interview.',
      category: 'CAREER_TOOLS',
      iconType: 'TARGET',
      fileUrl: '/public/resources/interview-prep-checklist.md',
      fileName: 'interview-prep-checklist.md',
      fileSize: 5200,
      mimeType: 'text/markdown',
      downloadCount: 2100,
      status: 'PUBLISHED',
    },
  ];

  for (const resource of resources) {
    await Resource.findOneAndUpdate(
      { title: resource.title },
      resource,
      { upsert: true }
    );
  }
  console.log('✅ Created sample resources');

  // Create subscribers
  const subscribers = [
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
  ];

  for (const subscriber of subscribers) {
    await Subscriber.findOneAndUpdate(
      { email: subscriber.email },
      subscriber,
      { upsert: true }
    );
  }
  console.log('✅ Created sample subscribers');

  // Create analytics events
  await Analytics.create({
    postId: post1._id,
    event: 'post_view',
    path: `/article/${post1.slug}`,
  });

  await Analytics.create({
    postId: post2._id,
    event: 'post_view',
    path: `/article/${post2.slug}`,
  });

  console.log('✅ Created analytics events');

  console.log('\n🎉 MongoDB seed completed successfully!');
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
    await mongoose.disconnect();
  });
