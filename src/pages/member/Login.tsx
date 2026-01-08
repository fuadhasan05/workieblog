import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMember } from '@/contexts/MemberContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { setMemberSession, member } = useMember();
  const navigate = useNavigate();

  useEffect(() => {
    if (member) {
      console.log('[Login] Member detected in context, redirecting to dashboard');
      navigate('/member/dashboard', { replace: true });
    }
  }, [member, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('[Login] Signing in with Firebase...');
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      console.log('[Login] Firebase sign in successful:', user.uid);

      // Try to get additional user data from Firestore
      let membershipTier: 'FREE' | 'PREMIUM' | 'VIP' = 'FREE';
      let membershipStatus = 'ACTIVE';
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          membershipTier = userData.membershipTier || 'FREE';
          membershipStatus = userData.membershipStatus || 'ACTIVE';
          console.log('[Login] Firestore user data retrieved');
        }
      } catch (firestoreErr) {
        console.warn('[Login] Could not fetch Firestore data (non-blocking):', firestoreErr);
      }

      // Set member session
      const memberData = {
        id: user.uid,
        email: user.email || formData.email,
        name: user.displayName || formData.email.split('@')[0],
        avatar: user.photoURL || undefined,
        membershipTier,
        membershipStatus,
        emailVerified: user.emailVerified,
        createdAt: user.metadata.creationTime || new Date().toISOString()
      };

      console.log('[Login] Setting member session...');
      setMemberSession(memberData, null);

      toast.success('Welcome back!');
      navigate('/member/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Firebase login error:', error);

      switch (error.code) {
        case 'auth/user-not-found':
          toast.error('No account found with this email. Please sign up first.');
          break;
        case 'auth/wrong-password':
          toast.error('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          toast.error('Invalid email format.');
          break;
        case 'auth/invalid-credential':
          toast.error('Invalid email or password. Please try again.');
          break;
        case 'auth/too-many-requests':
          toast.error('Too many failed attempts. Please try again later.');
          break;
        case 'auth/network-request-failed':
          toast.error('Network error. Check your internet connection.');
          break;
        default:
          toast.error(error.message || 'Login failed. Please try again.');
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
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your CareerBuddy account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
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
                />
              </div>
              <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{' '}
              <Link to="/member/signup" className="text-pink-600 hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
