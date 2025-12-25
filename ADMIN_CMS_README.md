# CareerBuddy Admin CMS Dashboard

A comprehensive admin dashboard for managing content, media, team members, subscribers, and analytics.

## Features

### 1. **Post Editor with Rich Text**
- Full-featured rich text editor using TipTap
- Support for headings, lists, quotes, code blocks
- Image and YouTube video embedding
- Link management
- Text formatting (bold, italic, underline, strikethrough)
- Text alignment options

### 2. **Draft/Publish Workflow**
- Three post statuses: Draft, Published, Scheduled
- Schedule posts for future publication
- Auto-save functionality
- Featured post option
- Premium content flag

### 3. **Media Library**
- Upload images and videos
- Grid view with thumbnails
- Filter by media type (images/videos)
- Copy URL to clipboard
- Delete media files
- File size and type information

### 4. **Team Management**
- Three user roles: Admin, Editor, Author
- Add/remove team members
- Role-based access control
- View post counts per author
- User profile management

### 5. **Member Management**
- View all subscribers
- Filter by subscription tier (Free, Premium, VIP)
- Filter by active status
- Search by name or email
- Export subscribers to CSV
- Subscription date tracking

### 6. **Analytics Dashboard**
- Total views tracking
- Subscriber growth metrics
- Popular posts ranking
- Views over time chart
- Subscribers by tier breakdown
- Customizable date ranges (7, 30, 90 days)

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Git

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

1. Create a PostgreSQL database:
```bash
createdb betches_cms
```

2. Update the `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/betches_cms?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
```

### 3. Run Database Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Seed the Database

```bash
npm run prisma:seed
```

This will create:
- 3 users (admin, editor, author)
- 4 categories
- 3 tags
- 3 sample posts
- 3 sample subscribers
- Sample analytics data

### 5. Start the Development Servers

In separate terminal windows:

**Terminal 1 - Backend API:**
```bash
npm run server
```
This starts the Express server on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
npm run dev
```
This starts the Vite dev server on http://localhost:5173

## Login Credentials

After seeding, you can log in with these credentials:

- **Admin:** admin@careerbuddy.com / admin123
- **Editor:** editor@careerbuddy.com / editor123
- **Author:** author@careerbuddy.com / author123

## Admin Dashboard Routes

- `/admin/login` - Login page
- `/admin` - Dashboard home
- `/admin/posts` - Posts management
- `/admin/posts/new` - Create new post
- `/admin/posts/:id/edit` - Edit existing post
- `/admin/media` - Media library
- `/admin/team` - Team management
- `/admin/subscribers` - Subscriber management
- `/admin/analytics` - Analytics dashboard

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts (with filters)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Media
- `GET /api/media` - Get media library
- `POST /api/media` - Upload file
- `DELETE /api/media/:id` - Delete media

### Users
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Subscribers
- `GET /api/subscribers` - Get all subscribers
- `POST /api/subscribers` - Create subscriber
- `PUT /api/subscribers/:id` - Update subscriber
- `GET /api/subscribers/export` - Export to CSV

### Analytics
- `POST /api/analytics/track` - Track event
- `GET /api/analytics/dashboard` - Get dashboard stats
- `GET /api/analytics/posts/:postId` - Get post analytics

### Categories & Tags
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create tag

## Role-Based Permissions

### Admin
- Full access to all features
- Can manage users and roles
- Can delete any content

### Editor
- Can create, edit, and publish posts
- Can manage media
- Can view subscribers and analytics
- Cannot manage team members

### Author
- Can create and edit own posts
- Can upload media
- Can view own post analytics
- Cannot publish without editor approval

## Technology Stack

### Backend
- Express.js - Web framework
- Prisma - ORM
- PostgreSQL - Database
- JWT - Authentication
- Bcrypt - Password hashing
- Multer - File uploads

### Frontend
- React 18 - UI library
- React Router - Routing
- TipTap - Rich text editor
- TanStack Query - Data fetching
- shadcn/ui - Component library
- Recharts - Analytics charts
- Tailwind CSS - Styling

## Development Tools

```bash
# View database in Prisma Studio
npm run prisma:studio

# Generate Prisma Client after schema changes
npm run prisma:generate

# Create new migration
npm run prisma:migrate

# Reset database
npx prisma migrate reset
```

## Production Deployment

1. Set environment variables:
   - Set `NODE_ENV=production`
   - Use a strong `JWT_SECRET`
   - Configure production database URL

2. Build the frontend:
```bash
npm run build
```

3. Run migrations:
```bash
npx prisma migrate deploy
```

4. Start the backend server:
```bash
npm run server:prod
```

5. Serve the built frontend files using a web server (nginx, Apache, etc.)

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Authentication Issues
- Check JWT_SECRET is set
- Clear browser localStorage
- Verify token expiration settings

### File Upload Issues
- Check uploads directory exists and has write permissions
- Verify MAX_FILE_SIZE setting
- Check file type restrictions

## Support

For issues and questions, please refer to the main project documentation or contact the development team.
