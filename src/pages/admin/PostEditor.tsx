import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SmartRichTextEditor } from '@/components/admin/SmartRichTextEditor';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { ArrowLeft, Save, Eye, Plus, Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = !!id && id !== 'new';

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    categoryId: '',
    status: 'DRAFT',
    scheduledFor: '',
    isFeatured: false,
    isPremium: false,
    readTime: 5,
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // New category dialog state
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#8b5cf6'
  });

  useEffect(() => {
    loadCategories();
    loadTags();
    if (isEditMode) {
      loadPost();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const data = await apiClient.get('/categories');
      setCategories(data.categories);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const loadTags = async () => {
    try {
      const data = await apiClient.get('/tags');
      setTags(data.tags);
    } catch (error) {
      toast.error('Failed to load tags');
    }
  };

  const loadPost = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get(`/posts/${id}`);
      const post = data.post;
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        featuredImage: post.featuredImage || '',
        categoryId: post.categoryId,
        status: post.status,
        scheduledFor: post.scheduledFor || '',
        isFeatured: post.isFeatured,
        isPremium: post.isPremium,
        readTime: post.readTime || 5,
      });
      setSelectedTags(post.tags.map((t: any) => t.id));
    } catch (error: any) {
      toast.error(error.message || 'Failed to load post');
      navigate('/admin/posts');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title });
    if (!isEditMode || !formData.slug) {
      setFormData(prev => ({ ...prev, title, slug: generateSlug(title) }));
    }
  };

  const handleSave = async (status?: string) => {
    if (!formData.title || !formData.content || !formData.categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      const postData = {
        ...formData,
        status: status || formData.status,
        tagIds: selectedTags,
      };

      if (isEditMode) {
        await apiClient.put(`/posts/${id}`, postData);
        toast.success('Post updated successfully');
      } else {
        await apiClient.post('/posts', postData);
        toast.success('Post created successfully');
      }

      navigate('/admin/posts');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.slug) {
      toast.error('Please fill in category name and slug');
      return;
    }

    try {
      const data = await apiClient.post('/categories', newCategory);
      toast.success('Category created successfully');
      setCategories([...categories, data.category]);
      setFormData({ ...formData, categoryId: data.category.id });
      setIsAddCategoryOpen(false);
      setNewCategory({ name: '', slug: '', description: '', color: '#8b5cf6' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create category');
    }
  };

  const generateCategorySlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload through backend API (signed upload)
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.DEV 
        ? (import.meta.env.VITE_USE_LOCAL_API === 'true' 
            ? 'http://localhost:3001/api'
            : 'https://workieblog-api.onrender.com/api')
        : 'https://workieblog-api.onrender.com/api';
      
      console.log('Uploading to:', `${API_BASE_URL}/cloudinary/upload`);
      
      const response = await fetch(`${API_BASE_URL}/cloudinary/upload`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData,
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Upload error response:', errorData);
        const errorMessage = errorData?.error || errorData?.details || `Upload failed with status: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Upload success:', data);
      setFormData(prev => ({ ...prev, featuredImage: data.url }));
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      console.error('Image upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/posts')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Post' : 'New Post'}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave('DRAFT')}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            className="bg-pink-600 hover:bg-pink-700"
            onClick={() => handleSave('PUBLISHED')}
            disabled={isSaving}
          >
            <Eye className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter post title"
              className="text-lg"
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="post-slug"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief description of the post"
              rows={3}
            />
          </div>

          <div>
            <Label>Content *</Label>
            <SmartRichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Start writing your post..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.status === 'SCHEDULED' && (
              <div>
                <Label htmlFor="scheduledFor">Schedule For</Label>
                <Input
                  id="scheduledFor"
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="category">Category *</Label>
                <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-pink-600 hover:text-pink-700"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add New
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                      <DialogDescription>
                        Create a new category for your posts
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="category-name">Name *</Label>
                        <Input
                          id="category-name"
                          value={newCategory.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            setNewCategory({
                              ...newCategory,
                              name,
                              slug: generateCategorySlug(name)
                            });
                          }}
                          placeholder="e.g., Career Advice"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category-slug">Slug *</Label>
                        <Input
                          id="category-slug"
                          value={newCategory.slug}
                          onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                          placeholder="e.g., career-advice"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category-description">Description</Label>
                        <Textarea
                          id="category-description"
                          value={newCategory.description}
                          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                          placeholder="Brief description of the category"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category-color">Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="category-color"
                            type="color"
                            value={newCategory.color}
                            onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                            className="w-20 h-10"
                          />
                          <Input
                            value={newCategory.color}
                            onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                            placeholder="#8b5cf6"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddCategoryOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddCategory}
                          className="bg-pink-600 hover:bg-pink-700"
                        >
                          Add Category
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="readTime">Read Time (minutes)</Label>
              <Input
                id="readTime"
                type="number"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
                min={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Featured Image</Label>
            
              {/* Upload Button */}
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('image-upload')?.click()}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </div>

            {/* Or Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or paste URL</span>
              </div>
            </div>

            {/* URL Input */}
            <Input
              id="featuredImage"
              value={formData.featuredImage}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />

            {/* Image Preview */}
            {formData.featuredImage && (
              <div className="relative">
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  className="w-full rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setFormData({ ...formData, featuredImage: '' })}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="premium">Premium Content</Label>
              <Switch
                id="premium"
                checked={formData.isPremium}
                onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border space-y-4">
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input
              id="featuredImage"
              value={formData.featuredImage}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            {formData.featuredImage && (
              <img
                src={formData.featuredImage}
                alt="Featured"
                className="w-full rounded-lg"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
