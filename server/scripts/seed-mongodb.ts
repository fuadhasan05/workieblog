import { connectToMongoDB, disconnectFromMongoDB } from '../utils/mongodb.js';
import { User, Article, Category } from '../models/mongodb.js';

async function seedMongoDB() {
  try {
    console.log('🌱 Starting MongoDB seeding...');
    
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Article.deleteMany({});
    await Category.deleteMany({});
    
    // Create sample categories
    console.log('📁 Creating categories...');
    const categories = await Category.create([
      {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest technology trends and news',
        color: '#3B82F6',
        icon: 'laptop',
        isActive: true,
      },
      {
        name: 'Career',
        slug: 'career',
        description: 'Career development and job search tips',
        color: '#10B981',
        icon: 'briefcase',
        isActive: true,
      },
      {
        name: 'Remote Work',
        slug: 'remote-work',
        description: 'Tips and tools for remote work',
        color: '#8B5CF6',
        icon: 'home',
        isActive: true,
      },
      {
        name: 'Productivity',
        slug: 'productivity',
        description: 'Productivity tips and techniques',
        color: '#F59E0B',
        icon: 'zap',
        isActive: true,
      },
    ]);
    
    // Create sample users
    console.log('👥 Creating users...');
    const users = await User.create([
      {
        email: 'admin@workieblog.com',
        name: 'Admin User',
        bio: 'System administrator and content manager',
        role: 'admin',
        isActive: true,
      },
      {
        email: 'john.doe@example.com',
        name: 'John Doe',
        bio: 'Tech enthusiast and writer passionate about web development',
        role: 'author',
        isActive: true,
      },
      {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        bio: 'Career coach and productivity expert',
        role: 'author',
        isActive: true,
      },
      {
        email: 'user@example.com',
        name: 'Regular User',
        role: 'user',
        isActive: true,
      },
    ]);
    
    // Create sample articles
    console.log('📝 Creating articles...');
    const articles = await Article.create([
      {
        title: 'Getting Started with React and Firebase',
        slug: 'getting-started-react-firebase',
        content: `
# Getting Started with React and Firebase

Firebase is a powerful platform that provides various services for web and mobile app development. In this article, we'll explore how to integrate Firebase with React applications.

## What is Firebase?

Firebase is a Backend-as-a-Service (BaaS) platform that provides developers with various tools and services to build, test, and deploy applications quickly.

## Key Features:

- **Authentication**: Easy user authentication with multiple providers
- **Firestore**: NoSQL document database
- **Hosting**: Fast and secure web hosting
- **Cloud Functions**: Serverless backend functions
- **Storage**: File storage and serving

## Setting Up Firebase with React

1. Create a Firebase project
2. Install Firebase SDK
3. Configure Firebase in your React app
4. Start using Firebase services

This is just the beginning of what you can accomplish with Firebase and React!
        `,
        excerpt: 'Learn how to integrate Firebase with React applications for authentication, database, and hosting.',
        author: users[1]._id, // John Doe
        categories: [categories[0]._id], // Technology
        tags: ['React', 'Firebase', 'JavaScript', 'Web Development'],
        featuredImage: '/images/react-firebase.jpg',
        status: 'published',
        publishedAt: new Date('2024-01-15'),
        views: 245,
        likes: 18,
        isFirebaseSync: false,
      },
      {
        title: 'Remote Work Productivity: Best Practices',
        slug: 'remote-work-productivity-best-practices',
        content: `
# Remote Work Productivity: Best Practices

Working remotely has become the new normal for many professionals. Here are some proven strategies to maintain high productivity while working from home.

## Creating the Right Environment

Your workspace significantly impacts your productivity:

- **Dedicated workspace**: Set up a specific area for work
- **Good lighting**: Ensure adequate natural or artificial light
- **Ergonomic setup**: Invest in a good chair and desk
- **Minimize distractions**: Keep your workspace clean and organized

## Time Management Techniques

1. **Time blocking**: Schedule specific times for different tasks
2. **Pomodoro Technique**: Work in 25-minute focused sessions
3. **Priority matrix**: Categorize tasks by importance and urgency
4. **Daily planning**: Start each day with a clear plan

## Communication and Collaboration

- Use video calls for important discussions
- Set clear expectations with your team
- Regular check-ins and updates
- Use collaborative tools effectively

Remember, remote work success requires discipline, proper tools, and clear communication.
        `,
        excerpt: 'Discover proven strategies and best practices for maintaining high productivity while working remotely.',
        author: users[2]._id, // Jane Smith
        categories: [categories[2]._id, categories[3]._id], // Remote Work, Productivity
        tags: ['Remote Work', 'Productivity', 'Work From Home', 'Time Management'],
        featuredImage: '/images/remote-work.jpg',
        status: 'published',
        publishedAt: new Date('2024-01-20'),
        views: 189,
        likes: 24,
        isFirebaseSync: false,
      },
      {
        title: 'Career Development in the Tech Industry',
        slug: 'career-development-tech-industry',
        content: `
# Career Development in the Tech Industry

The technology industry offers numerous opportunities for career growth. Here's how to navigate your tech career effectively.

## Understanding Career Paths

The tech industry offers diverse career paths:

### Technical Tracks:
- Software Development
- DevOps Engineering
- Data Science
- Cybersecurity
- Cloud Architecture

### Management Tracks:
- Engineering Management
- Product Management
- Technical Program Management
- Director/VP of Engineering

## Building Essential Skills

### Technical Skills:
1. **Programming Languages**: Master at least one, understand others
2. **System Design**: Learn to design scalable systems
3. **Cloud Platforms**: AWS, Azure, or Google Cloud
4. **Version Control**: Git is essential

### Soft Skills:
1. **Communication**: Essential for all levels
2. **Problem-solving**: Core of tech work
3. **Leadership**: Important for career advancement
4. **Continuous Learning**: Tech evolves rapidly

## Networking and Growth

- Attend tech meetups and conferences
- Contribute to open source projects
- Build a professional online presence
- Find mentors and be a mentor to others

Your tech career is a marathon, not a sprint. Focus on continuous learning and building meaningful relationships.
        `,
        excerpt: 'A comprehensive guide to building and advancing your career in the technology industry.',
        author: users[1]._id, // John Doe
        categories: [categories[0]._id, categories[1]._id], // Technology, Career
        tags: ['Career Development', 'Tech Industry', 'Programming', 'Skills'],
        featuredImage: '/images/tech-career.jpg',
        status: 'published',
        publishedAt: new Date('2024-01-25'),
        views: 156,
        likes: 31,
        isFirebaseSync: false,
      },
      {
        title: 'MongoDB vs. Firebase: Choosing the Right Database',
        slug: 'mongodb-vs-firebase-choosing-right-database',
        content: `
# MongoDB vs. Firebase: Choosing the Right Database

When building modern applications, choosing the right database is crucial. Let's compare MongoDB and Firebase Firestore to help you make an informed decision.

## MongoDB Overview

MongoDB is a popular NoSQL document database that offers:

- **Flexibility**: Schema-less design allows for easy data model changes
- **Scalability**: Horizontal scaling with sharding
- **Rich Queries**: Powerful query language and aggregation framework
- **Self-hosted**: Full control over your data and infrastructure

### MongoDB Use Cases:
- Complex data relationships
- High-performance requirements
- Need for advanced querying
- Self-hosted solutions

## Firebase Firestore Overview

Firestore is Google's NoSQL document database in the cloud:

- **Real-time**: Built-in real-time synchronization
- **Serverless**: No server management required
- **Security**: Built-in security rules
- **Offline Support**: Automatic offline data access

### Firebase Use Cases:
- Real-time applications
- Rapid prototyping
- Mobile applications
- Small to medium-scale apps

## Key Differences

| Feature | MongoDB | Firebase Firestore |
|---------|---------|-------------------|
| Hosting | Self-hosted/Cloud | Cloud-only |
| Queries | Complex queries | Limited querying |
| Real-time | Requires additional setup | Built-in |
| Pricing | Server costs | Pay-per-usage |
| Offline | Manual implementation | Automatic |

## Making the Decision

Choose **MongoDB** if:
- You need complex queries and aggregations
- You want full control over your infrastructure
- You're building enterprise-scale applications
- You have specific compliance requirements

Choose **Firebase** if:
- You want real-time synchronization
- You're building mobile apps
- You prefer serverless architecture
- You want to focus on frontend development

Both databases are excellent choices, and the decision ultimately depends on your specific requirements and constraints.
        `,
        excerpt: 'Compare MongoDB and Firebase Firestore to choose the best database solution for your project.',
        author: users[2]._id, // Jane Smith
        categories: [categories[0]._id], // Technology
        tags: ['MongoDB', 'Firebase', 'Database', 'NoSQL', 'Comparison'],
        status: 'draft',
        views: 0,
        likes: 0,
        isFirebaseSync: false,
      },
    ]);
    
    console.log('✅ MongoDB seeding completed!');
    console.log(`📊 Created:`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${articles.length} articles`);
    
    // Display some statistics
    const publishedArticles = await Article.countDocuments({ status: 'published' });
    const totalViews = await Article.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    
    console.log(`📈 Statistics:`);
    console.log(`   - ${publishedArticles} published articles`);
    console.log(`   - ${totalViews[0]?.totalViews || 0} total views`);
    
  } catch (error) {
    console.error('❌ Error seeding MongoDB:', error);
  } finally {
    await disconnectFromMongoDB();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the seeding script
seedMongoDB();