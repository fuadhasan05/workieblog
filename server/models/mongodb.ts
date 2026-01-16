import mongoose, { Schema, Document, Types } from 'mongoose';

// ============== ENUMS ==============
export const RoleEnum = ['ADMIN', 'EDITOR', 'AUTHOR'] as const;
export const PostStatusEnum = ['DRAFT', 'SCHEDULED', 'PUBLISHED'] as const;
export const SubscriptionTierEnum = ['FREE', 'PREMIUM', 'VIP'] as const;
export const MembershipStatusEnum = ['ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING'] as const;
export const ContentAccessLevelEnum = ['FREE', 'SUBSCRIBER', 'PREMIUM'] as const;
export const PaymentGatewayEnum = ['STRIPE', 'PAYSTACK', 'PAYPAL'] as const;
export const JobTypeEnum = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP'] as const;
export const JobStatusEnum = ['ACTIVE', 'INACTIVE', 'EXPIRED'] as const;
export const ResourceStatusEnum = ['DRAFT', 'PUBLISHED'] as const;
export const ResourceCategoryEnum = ['CAREER_TOOLS', 'NETWORKING', 'PLANNING', 'TEMPLATES', 'GUIDES'] as const;
export const ResourceIconTypeEnum = ['FILE_TEXT', 'BOOK_OPEN', 'TARGET', 'USERS', 'TRENDING_UP', 'BRIEFCASE', 'LIGHTBULB', 'STAR'] as const;

// ============== USER MODEL ==============
export interface IUser extends Document {
  _id: Types.ObjectId;
  firebaseUid?: string;
  email: string;
  name: string;
  password: string;
  avatar?: string;
  bio?: string;
  role: typeof RoleEnum[number];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  role: {
    type: String,
    enum: RoleEnum,
    default: 'AUTHOR',
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export const User = mongoose.model<IUser>('User', UserSchema);

// ============== CATEGORY MODEL ==============
export interface ICategory extends Document {
  _id: Types.ObjectId;
  slug: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    default: '#ec4899',
  },
}, {
  timestamps: true,
});

export const Category = mongoose.model<ICategory>('Category', CategorySchema);

// ============== TAG MODEL ==============
export interface ITag extends Document {
  _id: Types.ObjectId;
  slug: string;
  name: string;
  createdAt: Date;
}

const TagSchema: Schema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

export const Tag = mongoose.model<ITag>('Tag', TagSchema);

// ============== POST MODEL ==============
export interface IPost extends Document {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  status: typeof PostStatusEnum[number];
  publishedAt?: Date;
  scheduledFor?: Date;
  readTime?: number;
  isFeatured: boolean;
  isPremium: boolean;
  accessLevel: typeof ContentAccessLevelEnum[number];
  views: number;
  authorId: Types.ObjectId;
  categoryId: Types.ObjectId;
  tags: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  excerpt: {
    type: String,
    default: null,
  },
  content: {
    type: String,
    required: true,
  },
  featuredImage: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: PostStatusEnum,
    default: 'DRAFT',
    index: true,
  },
  publishedAt: {
    type: Date,
    default: null,
    index: -1,
  },
  scheduledFor: {
    type: Date,
    default: null,
  },
  readTime: {
    type: Number,
    default: null,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  accessLevel: {
    type: String,
    enum: ContentAccessLevelEnum,
    default: 'FREE',
    index: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
    index: true,
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag',
  }],
}, {
  timestamps: true,
});

export const Post = mongoose.model<IPost>('Post', PostSchema);

// ============== MEDIA MODEL ==============
export interface IMedia extends Document {
  _id: Types.ObjectId;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  uploadedBy: Types.ObjectId;
  createdAt: Date;
}

const MediaSchema: Schema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    default: null,
  },
  width: {
    type: Number,
    default: null,
  },
  height: {
    type: Number,
    default: null,
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

export const Media = mongoose.model<IMedia>('Media', MediaSchema);

// ============== SUBSCRIBER MODEL ==============
export interface ISubscriber extends Document {
  _id: Types.ObjectId;
  email: string;
  name?: string;
  tier: typeof SubscriptionTierEnum[number];
  subscribedAt: Date;
  lastActiveAt?: Date;
  isActive: boolean;
}

const SubscriberSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  name: {
    type: String,
    default: null,
  },
  tier: {
    type: String,
    enum: SubscriptionTierEnum,
    default: 'FREE',
    index: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  lastActiveAt: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
});

export const Subscriber = mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);

// ============== ANALYTICS MODEL ==============
export interface IAnalytics extends Document {
  _id: Types.ObjectId;
  postId?: Types.ObjectId;
  event: string;
  path?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
}

const AnalyticsSchema: Schema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    default: null,
    index: true,
  },
  event: {
    type: String,
    required: true,
    index: true,
  },
  path: {
    type: String,
    default: null,
  },
  referrer: {
    type: String,
    default: null,
  },
  userAgent: {
    type: String,
    default: null,
  },
  ipAddress: {
    type: String,
    default: null,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

// Compound index for createdAt descending
AnalyticsSchema.index({ createdAt: -1 });

export const Analytics = mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);

// ============== VIDEO MODEL ==============
export interface IVideo extends Document {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  description?: string;
  thumbnail: string;
  videoUrl: string;
  duration?: string;
  views: number;
  publishedAt: Date;
  categoryId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema: Schema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: null,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    default: null,
  },
  views: {
    type: Number,
    default: 0,
  },
  publishedAt: {
    type: Date,
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
}, {
  timestamps: true,
});

export const Video = mongoose.model<IVideo>('Video', VideoSchema);

// ============== JOB MODEL ==============
export interface IJob extends Document {
  _id: Types.ObjectId;
  title: string;
  company: string;
  location: string;
  salary?: string;
  jobType: typeof JobTypeEnum[number];
  remote: boolean;
  description: string;
  requirements?: string;
  applicationUrl: string;
  tags: string[];
  status: typeof JobStatusEnum[number];
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    default: null,
  },
  jobType: {
    type: String,
    enum: JobTypeEnum,
    default: 'FULL_TIME',
  },
  remote: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    default: null,
  },
  applicationUrl: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  status: {
    type: String,
    enum: JobStatusEnum,
    default: 'ACTIVE',
    index: true,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

JobSchema.index({ jobType: 1 });
JobSchema.index({ remote: 1 });

export const Job = mongoose.model<IJob>('Job', JobSchema);

// ============== MEMBER MODEL ==============
export interface IMember extends Document {
  _id: Types.ObjectId;
  email: string;
  name: string;
  password: string;
  avatar?: string;
  emailVerified: boolean;
  membershipTier: typeof SubscriptionTierEnum[number];
  membershipStatus?: typeof MembershipStatusEnum[number];
  paymentGateway?: typeof PaymentGatewayEnum[number];
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  paystackCustomerId?: string;
  paystackSubscriptionCode?: string;
  paypalSubscriptionId?: string;
  paypalCustomerId?: string;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  firebaseUid?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    default: null,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  membershipTier: {
    type: String,
    enum: SubscriptionTierEnum,
    default: 'FREE',
    index: true,
  },
  membershipStatus: {
    type: String,
    enum: MembershipStatusEnum,
    default: null,
  },
  paymentGateway: {
    type: String,
    enum: PaymentGatewayEnum,
    default: null,
  },
  stripeCustomerId: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  stripeSubscriptionId: {
    type: String,
    unique: true,
    sparse: true,
  },
  paystackCustomerId: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  paystackSubscriptionCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  paypalSubscriptionId: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  paypalCustomerId: {
    type: String,
    default: null,
  },
  subscriptionStartDate: {
    type: Date,
    default: null,
  },
  subscriptionEndDate: {
    type: Date,
    default: null,
  },
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLoginAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

export const Member = mongoose.model<IMember>('Member', MemberSchema);

// ============== SAVED ARTICLE MODEL ==============
export interface ISavedArticle extends Document {
  _id: Types.ObjectId;
  memberId: Types.ObjectId;
  postId: Types.ObjectId;
  savedAt: Date;
}

const SavedArticleSchema: Schema = new Schema({
  memberId: {
    type: Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

SavedArticleSchema.index({ memberId: 1, postId: 1 }, { unique: true });
SavedArticleSchema.index({ memberId: 1 });
SavedArticleSchema.index({ postId: 1 });

export const SavedArticle = mongoose.model<ISavedArticle>('SavedArticle', SavedArticleSchema);

// ============== PAYMENT MODEL ==============
export interface IPayment extends Document {
  _id: Types.ObjectId;
  memberId: Types.ObjectId;
  gateway: typeof PaymentGatewayEnum[number];
  gatewayPaymentId: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  metadata?: string;
  createdAt: Date;
}

const PaymentSchema: Schema = new Schema({
  memberId: {
    type: Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
    index: true,
  },
  gateway: {
    type: String,
    enum: PaymentGatewayEnum,
    required: true,
    index: true,
  },
  gatewayPaymentId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'usd',
  },
  status: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  metadata: {
    type: String,
    default: null,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

// ============== RESOURCE MODEL ==============
export interface IResource extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  category: typeof ResourceCategoryEnum[number];
  iconType: typeof ResourceIconTypeEnum[number];
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  downloadCount: number;
  status: typeof ResourceStatusEnum[number];
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ResourceCategoryEnum,
    default: 'CAREER_TOOLS',
    index: true,
  },
  iconType: {
    type: String,
    enum: ResourceIconTypeEnum,
    default: 'FILE_TEXT',
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ResourceStatusEnum,
    default: 'DRAFT',
    index: true,
  },
}, {
  timestamps: true,
});

export const Resource = mongoose.model<IResource>('Resource', ResourceSchema);

// ============== LEGACY EXPORTS (for compatibility) ==============
export const Article = Post;
export type IArticle = IPost;
