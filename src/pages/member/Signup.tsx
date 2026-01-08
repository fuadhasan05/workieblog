import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import { useMember } from '@/contexts/MemberContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Signup() {
  const [formData, setFormData] = useState({ 
    email: '', 
    name: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const { setMemberSession, member } = useMember();
  const navigate = useNavigate();
  useEffect(() => {
    if (member) {
      console.log('[Signup] Member detected in context, redirecting to dashboard');
      navigate('/member/dashboard', { replace: true });
    }
  }, [member, navigate]);

  const waitForNextPaint = () => new Promise(resolve => setTimeout(resolve, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      console.log('[Signup] Creating Firebase auth user...');
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      console.log('[Signup] Firebase auth user created:', user.uid);

      console.log('[Signup] Updating Firebase display name...');
      await updateProfile(user, {
        displayName: formData.name
      });
      console.log('[Signup] Display name updated');

      // Seed MemberContext FIRST so user is authenticated immediately
      const memberData = {
        id: user.uid,
        email: user.email || formData.email,
        name: formData.name,
        avatar: user.photoURL || undefined,
        membershipTier: 'FREE' as const,
        membershipStatus: 'ACTIVE',
        emailVerified: user.emailVerified,
        createdAt: new Date().toISOString()
      };
      
      console.log('[Signup] Seeding MemberContext session...');
      setMemberSession(memberData, null);
      console.log('[Signup] MemberContext seeded');

      // Try Firestore write in background - don't block redirect
      const userDoc = {
        uid: user.uid,
        email: user.email,
        displayName: formData.name,
        photoURL: user.photoURL || null,
        emailVerified: user.emailVerified,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        membershipTier: 'FREE',
        isActive: true,
        provider: 'email'
      };

      // Fire and forget Firestore write
      setDoc(doc(db, 'users', user.uid), userDoc)
        .then(() => console.log('[Signup] Firestore profile saved'))
        .catch((err) => console.warn('[Signup] Firestore write failed (non-blocking):', err));

      // Sync to MongoDB Atlas
      console.log('[Signup] Syncing to MongoDB...');
      try {
        const mongoResponse = await fetch('http://localhost:3001/api/firebase-mongo/sync-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: formData.name,
            photoURL: user.photoURL || null,
            emailVerified: user.emailVerified,
            membershipTier: 'FREE',
            provider: 'email'
          })
        });
        const mongoResult = await mongoResponse.json();
        console.log('[Signup] MongoDB sync result:', mongoResult);
      } catch (mongoErr) {
        console.error('[Signup] MongoDB sync failed:', mongoErr);
      }

      console.log('[Signup] Registration complete, redirecting...');
      toast.success('Account created successfully!');
      
      // Force navigation
      navigate('/member/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Firebase registration error:', error);

      switch (error.code) {
        case 'auth/email-already-in-use':
          toast.error('Email already registered. Please log in instead.');
          break;
        case 'auth/weak-password':
          toast.error('Password is too weak. Please use at least 6 characters.');
          break;
        case 'auth/invalid-email':
          toast.error('Invalid email format. Please try again.');
          break;
        case 'auth/network-request-failed':
          toast.error('Network error. Check your internet connection.');
          break;
        default:
          toast.error(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Join CareerBuddy and get access to exclusive content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  disabled={isLoading}
                  placeholder="Create a password (min. 6 characters)"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                  disabled={isLoading}
                  placeholder="Confirm your password"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-pink-600 hover:bg-pink-700" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/member/login" className="text-pink-600 hover:underline">
                Sign in here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
